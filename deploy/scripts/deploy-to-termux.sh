#!/usr/bin/env bash
# AAKorea Termux 통합 배포 스크립트 (Web, Office, Backend)
set -euo pipefail

# 경로 설정
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"

# 로컬 컴포넌트 경로
WEB_DIR="${REPO_ROOT}/web"
OFFICE_DIR="${REPO_ROOT}/office"
BACKEND_DIR="${REPO_ROOT}/backend"
BACKEND_JAR_LOCAL="${BACKEND_DIR}/build/libs/aakorea-core-0.0.1-SNAPSHOT.jar"

# Termux 접속 정보 (환경 변수 또는 인자로 설정 가능)
TERMUX_TARGET="${1:-u0_a312@192.168.50.211}"
TERMUX_SSH_PORT="${TERMUX_SSH_PORT:-8022}"
TERMUX_APP_ROOT="/data/data/com.termux/files/home/aakorea"

log() { printf '\n[deploy] %s\n' "$*"; }

# SSH/SCP 공통 옵션
SSH_OPTS="-p ${TERMUX_SSH_PORT}"
SCP_OPTS="-P ${TERMUX_SSH_PORT}"

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
ssh ${SSH_OPTS} "${TERMUX_TARGET}" "mkdir -p ${TERMUX_APP_ROOT}/{web,office,backend,config,scripts,log,contents,uploads}"

# 3. 파일 전송
log "--- 파일 전송 시작 ---"

log "3-1. Office (관리자) 전송 중..."
scp ${SCP_OPTS} -r "${OFFICE_DIR}/dist/"* "${TERMUX_TARGET}:${TERMUX_APP_ROOT}/office/"

log "3-2. Web (사용자) 전송 중..."
# SvelteKit adapter-node 빌드 결과물(build/) 및 package.json 전송
scp ${SCP_OPTS} -r "${WEB_DIR}/build" "${WEB_DIR}/package.json" "${TERMUX_TARGET}:${TERMUX_APP_ROOT}/web/"

log "3-3. Backend 전송 중..."
scp ${SCP_OPTS} "${BACKEND_JAR_LOCAL}" "${TERMUX_TARGET}:${TERMUX_APP_ROOT}/backend/aakorea-core.jar"

log "3-4. 관리 스크립트 및 설정 전송 중..."
scp ${SCP_OPTS} "${REPO_ROOT}/deploy/scripts/restart-backend.sh" "${REPO_ROOT}/deploy/scripts/restart-web.sh" "${TERMUX_TARGET}:${TERMUX_APP_ROOT}/scripts/"
scp ${SCP_OPTS} "${REPO_ROOT}/deploy/nginx/aakorea-termux.conf" "${TERMUX_TARGET}:${TERMUX_APP_ROOT}/config/aakorea-termux.conf"
ssh ${SSH_OPTS} "${TERMUX_TARGET}" "chmod +x ${TERMUX_APP_ROOT}/scripts/*.sh"

# 4. 서버 재시작
log "--- 서버 재시작 중 ---"
ssh ${SSH_OPTS} "${TERMUX_TARGET}" "${TERMUX_APP_ROOT}/scripts/restart-web.sh"
ssh ${SSH_OPTS} "${TERMUX_TARGET}" "${TERMUX_APP_ROOT}/scripts/restart-backend.sh restart"

log "--- 배포 완료 ---"
log "웹 접속: https://maumtalk.win"
log "관리자: https://maumtalk.win/office"
log ""
log "주의: SvelteKit(Web)의 의존성이 바뀐 경우 서버에서 'npm install --omit=dev --ignore-scripts'가 필요할 수 있습니다."
