#!/usr/bin/env bash
# AAKorea OCI ARM 인스턴스 통합 배포 스크립트 (Web, Office, Backend)
set -euo pipefail

# 경로 설정
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"

# 로컬 컴포넌트 경로
WEB_DIR="${REPO_ROOT}/web"
OFFICE_DIR="${REPO_ROOT}/office"
BACKEND_DIR="${REPO_ROOT}/backend"
BACKEND_JAR_LOCAL="${BACKEND_DIR}/build/libs/aakorea-core-0.0.1-SNAPSHOT.jar"

# OCI 접속 정보 (환경 변수 또는 인자로 설정 가능)
OCI_TARGET="${1:-ubuntu@134.185.125.64}"
OCI_SSH_PORT="${OCI_SSH_PORT:-22}"
OCI_KEY_FILE="${2:-ssh-key-2026-05-28.key}"
OCI_APP_ROOT="/home/ubuntu/aakorea"

log() { printf '\n[deploy] %s\n' "$*"; }

# SSH/SCP 공통 옵션 구성
SOCKET="/tmp/ssh_mux_%h_%p_%r"
SSH_OPTS="-p ${OCI_SSH_PORT} -o ControlMaster=auto -o ControlPath=${SOCKET} -o ControlPersist=600"
SCP_OPTS="-P ${OCI_SSH_PORT} -o ControlPath=${SOCKET}"

# SSH Key 파일이 존재하는 경우 옵션에 추가
if [[ -f "${OCI_KEY_FILE}" ]]; then
    SSH_OPTS="${SSH_OPTS} -i ${OCI_KEY_FILE}"
    SCP_OPTS="${SCP_OPTS} -i ${OCI_KEY_FILE}"
    log "사용할 SSH Key: ${OCI_KEY_FILE}"
else
    # 현재 디렉토리에 없으면 상위 디렉토리나 환경 기본 경로 확인
    if [[ -f "${REPO_ROOT}/${OCI_KEY_FILE}" ]]; then
        SSH_OPTS="${SSH_OPTS} -i ${REPO_ROOT}/${OCI_KEY_FILE}"
        SCP_OPTS="${SCP_OPTS} -i ${REPO_ROOT}/${OCI_KEY_FILE}"
        log "사용할 SSH Key: ${REPO_ROOT}/${OCI_KEY_FILE}"
    elif [[ -f "${HOME}/${OCI_KEY_FILE}" ]]; then
        SSH_OPTS="${SSH_OPTS} -i ${HOME}/${OCI_KEY_FILE}"
        SCP_OPTS="${SCP_OPTS} -i ${HOME}/${OCI_KEY_FILE}"
        log "사용할 SSH Key: ${HOME}/${OCI_KEY_FILE}"
    else
        log "경고: 지정된 SSH Key 파일(${OCI_KEY_FILE})을 찾을 수 없습니다. 기본 시스템 SSH 키(또는 ssh-agent)를 사용합니다."
    fi
fi

# 스크립트 종료 시 SSH 마스터 세션 종료
trap 'ssh -O exit -p ${OCI_SSH_PORT} -o ControlPath=${SOCKET} "${OCI_TARGET}" 2>/dev/null || true' EXIT

# 1. 빌드 단계
log "--- 빌드 단계 시작 ---"

log "1-1. Web (SvelteKit) 빌드 중..."
(cd "${WEB_DIR}" && npm run build)

log "1-2. Office (React) 빌드 중..."
(cd "${OFFICE_DIR}" && npm run build)

log "1-3. Backend (Spring Boot) 빌드 중..."
(cd "${BACKEND_DIR}" && ./gradlew bootJar)

# 2. 원격 서버 준비
log "--- 원격 서버 디렉토리 준비 ---"
ssh ${SSH_OPTS} "${OCI_TARGET}" "mkdir -p ${OCI_APP_ROOT}/{web,office,backend,config,scripts,log,contents,uploads}"

# 3. 파일 전송
log "--- 파일 전송 시작 ---"

log "3-1. Office (관리자) 전송 중..."
# 기존 파일 정리 후 전송
ssh ${SSH_OPTS} "${OCI_TARGET}" "rm -rf ${OCI_APP_ROOT}/office/*"
scp ${SCP_OPTS} -r "${OFFICE_DIR}/dist/"* "${OCI_TARGET}:${OCI_APP_ROOT}/office/"

log "3-2. Web (사용자) 전송 중..."
# SvelteKit adapter-node 빌드 결과물(build/) 및 package.json 전송
ssh ${SSH_OPTS} "${OCI_TARGET}" "rm -rf ${OCI_APP_ROOT}/web/build"
scp ${SCP_OPTS} -r "${WEB_DIR}/build" "${WEB_DIR}/package.json" "${OCI_TARGET}:${OCI_APP_ROOT}/web/"

log "3-3. Backend 전송 중..."
scp ${SCP_OPTS} "${BACKEND_JAR_LOCAL}" "${OCI_TARGET}:${OCI_APP_ROOT}/backend/aakorea-core.jar"

log "3-4. 관리 스크립트 및 설정 전송 중..."
scp ${SCP_OPTS} "${REPO_ROOT}/deploy/scripts/restart-backend.sh" "${REPO_ROOT}/deploy/scripts/restart-web.sh" "${OCI_TARGET}:${OCI_APP_ROOT}/scripts/"
scp ${SCP_OPTS} "${REPO_ROOT}/deploy/nginx/aakorea-oci.conf" "${OCI_TARGET}:${OCI_APP_ROOT}/config/aakorea-oci.conf"
ssh ${SSH_OPTS} "${OCI_TARGET}" "chmod +x ${OCI_APP_ROOT}/scripts/*.sh"

# 4. 서버 재시작
log "--- 서버 재시작 중 ---"
ssh ${SSH_OPTS} "${OCI_TARGET}" "${OCI_APP_ROOT}/scripts/restart-web.sh"
ssh ${SSH_OPTS} "${OCI_TARGET}" "${OCI_APP_ROOT}/scripts/restart-backend.sh restart"

log "--- 배포 완료 ---"
log "웹 접속: http://maumtalk.win (Cloudflare 프록시를 통해 https 접속 권장)"
log "관리자: http://maumtalk.win/office"
log ""
log "주의: SvelteKit(Web)의 의존성이 바뀐 경우 서버에서 'npm install --omit=dev --ignore-scripts'가 필요할 수 있습니다."
