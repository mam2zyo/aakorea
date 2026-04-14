#!/usr/bin/env bash
# Termux 테스트 서버 배포 스크립트
# 프론트엔드 빌드, 백엔드 빌드 후 SSH를 통해 Termux 환경으로 파일을 전송하고 서버를 재시작합니다.

set -euo pipefail

# 로컬 디렉토리 경로 설정
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"

# 프로젝트 구성 요소 경로 (로컬)
FRONTEND_DIR="${REPO_ROOT}/frontend/aakorea-main"
FRONTEND_DIST="${FRONTEND_DIR}/dist"
BACKEND_DIR="${REPO_ROOT}/backend/aakorea-main"
# 빌드된 JAR 파일 경로
BACKEND_JAR="${BACKEND_DIR}/build/libs/aakorea-main-0.0.1-SNAPSHOT.jar"

# 공유 배포 파일 (로컬)
LOCAL_TERMUX_NGINX_CONF="${REPO_ROOT}/deploy/nginx/aakorea-termux.conf"
LOCAL_TERMUX_ENV_EXAMPLE="${REPO_ROOT}/deploy/env/termux.env.example"
LOCAL_RESTART_SCRIPT="${REPO_ROOT}/deploy/scripts/restart-backend.sh"

# 원격(Termux) 설정 - 기본 구조: ~/aakorea
TERMUX_TARGET="${TERMUX_TARGET:-}"   # 사용자명@호스트 주소
TERMUX_SSH_PORT="${TERMUX_SSH_PORT:-}" # SSH 포트 (Termux 기본값: 8022)
TERMUX_APP_DIR="${TERMUX_APP_DIR:-/data/data/com.termux/files/home/aakorea}"
TERMUX_ENV_FILE="${TERMUX_ENV_FILE:-${TERMUX_APP_DIR}/config/aakorea-termux.env}"
REMOTE_RESTART_SCRIPT="${REMOTE_RESTART_SCRIPT:-${TERMUX_APP_DIR}/scripts/restart-backend.sh}"
# 데이터 및 업로드 경로
TERMUX_CONTENT_DIR="${TERMUX_CONTENT_DIR:-${TERMUX_APP_DIR}/contents}"
TERMUX_UPLOAD_DIR="${TERMUX_UPLOAD_DIR:-${TERMUX_APP_DIR}/uploads}"

# 배포 제어 플래그
SYNC_FRONTEND=1
SYNC_BACKEND=1
BUILD_FRONTEND=1
BUILD_BACKEND=1
RESTART_BACKEND=1
SSH_CMD=(ssh)
SCP_CMD=(scp)
RSYNC_SSH_COMMAND="ssh"

# 도움말 출력 함수
usage() {
    cat <<'EOF'
사용법:
  ./deploy/scripts/deploy-to-termux.sh <termux-user>@<termux-host> [options]

필수:
  TERMUX_TARGET 환경 변수 혹은 첫 번째 인자로 타겟 주소를 지정해야 합니다.

옵션:
  --frontend-only  프론트엔드 빌드 및 업로드만 수행
  --backend-only   백엔드 빌드 및 업로드만 수행
  --skip-build     이미 빌드된 파일 사용 (빌드 단계 건너뜀)
  --no-restart     업로드 후 백엔드 재시작을 수행하지 않음
  --help           도움말 표시

환경 변수:
  TERMUX_TARGET         SSH 타겟 주소 (예: u0_a312@172.30.1.81)
  TERMUX_SSH_PORT       SSH 포트 (예: 8022)
  TERMUX_APP_DIR        원격 서버 앱 루트 경로
  TERMUX_ENV_FILE       환경 변수 파일 경로 (.env)
  REMOTE_RESTART_SCRIPT 원격 서버 재시작 스크립트 경로

예시:
  TERMUX_TARGET=termux@192.168.0.20 TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh
  ./deploy/scripts/deploy-to-termux.sh ssh.maumtalk.win --skip-build
EOF
}

# 로그 출력용 함수
log() {
    printf '[deploy-to-termux] %s\n' "$*"
}

# 로컬 파일 존재 여부 확인 함수
require_file() {
    local path="$1"
    if [[ ! -e "${path}" ]]; then
        printf '필수 파일을 찾을 수 없습니다: %s\n' "${path}" >&2
        exit 1
    fi
}

# 원격 서버 명령어 실행 함수
remote_exec() {
    "${SSH_CMD[@]}" "${TERMUX_TARGET}" "$@"
}

# 프론트엔드 정적 파일 동기화 함수
sync_frontend_dist() {
    # 원격 서버에 rsync가 설치되어 있는지 확인 후 rsync 사용 시도
    if command -v rsync >/dev/null 2>&1 && remote_exec "command -v rsync >/dev/null 2>&1"; then
        log "rsync를 사용하여 프론트엔드 파일을 배포합니다."
        rsync -av --delete -e "${RSYNC_SSH_COMMAND}" \
            "${FRONTEND_DIST}/" \
            "${TERMUX_TARGET}:${TERMUX_APP_DIR}/frontend/"
        return
    fi

    # rsync가 없을 경우 scp로 폴더 전체 복사
    log "rsync를 사용할 수 없어 scp로 대체합니다 (기존 폴더 삭제 후 재전송)."
    remote_exec "rm -rf '${TERMUX_APP_DIR}/frontend' && mkdir -p '${TERMUX_APP_DIR}/frontend'"
    "${SCP_CMD[@]}" -r "${FRONTEND_DIST}/" "${TERMUX_TARGET}:${TERMUX_APP_DIR}/frontend/"
}

# 명령줄 인수 파싱
while (($# > 0)); do
    case "$1" in
        --frontend-only)
            SYNC_BACKEND=0
            BUILD_BACKEND=0
            RESTART_BACKEND=0
            ;;
        --backend-only)
            SYNC_FRONTEND=0
            BUILD_FRONTEND=0
            ;;
        --skip-build)
            BUILD_FRONTEND=0
            BUILD_BACKEND=0
            ;;
        --no-restart)
            RESTART_BACKEND=0
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        -*)
            printf '알 수 없는 옵션: %s\n\n' "$1" >&2
            usage >&2
            exit 1
            ;;
        *)
            if [[ -z "${TERMUX_TARGET}" ]]; then
                TERMUX_TARGET="$1"
            else
                printf '허용되지 않는 추가 인자입니다: %s\n\n' "$1" >&2
                usage >&2
                exit 1
            fi
            ;;
    esac
    shift
done

# 타겟 주소 확인
if [[ -z "${TERMUX_TARGET}" ]]; then
    printf '배포 타겟(TERMUX_TARGET)이 지정되지 않았습니다.\n\n' >&2
    usage >&2
    exit 1
fi

# SSH/SCP/rsync 포트 설정
if [[ -n "${TERMUX_SSH_PORT}" ]]; then
    SSH_CMD+=(-p "${TERMUX_SSH_PORT}")
    SCP_CMD+=(-P "${TERMUX_SSH_PORT}")
    RSYNC_SSH_COMMAND="ssh -p ${TERMUX_SSH_PORT}"
fi

# 필수 설정 파일 존재 확인
require_file "${LOCAL_TERMUX_NGINX_CONF}"
require_file "${LOCAL_TERMUX_ENV_EXAMPLE}"
require_file "${LOCAL_RESTART_SCRIPT}"

# 1. 프론트엔드 빌드 (npm)
if [[ ${BUILD_FRONTEND} -eq 1 ]]; then
    log "프론트엔드 프로덕션 빌드를 시작합니다."
    (
        cd "${FRONTEND_DIR}"
        npm run build
    )
fi

# 2. 백엔드 빌드 (Gradle)
if [[ ${BUILD_BACKEND} -eq 1 ]]; then
    log "백엔드 실행 가능 JAR를 빌드합니다."
    (
        cd "${BACKEND_DIR}"
        ./gradlew bootJar
    )
fi

# 전송 전 빌드 결과물 확인
if [[ ${SYNC_FRONTEND} -eq 1 ]]; then
    require_file "${FRONTEND_DIST}"
fi

if [[ ${SYNC_BACKEND} -eq 1 ]]; then
    require_file "${BACKEND_JAR}"
fi

# 3. 원격 서버 디렉토리 준비
log "원격 서버의 디렉토리 구조를 준비합니다."
remote_exec "mkdir -p \
    '${TERMUX_APP_DIR}/frontend' \
    '${TERMUX_APP_DIR}/backend' \
    '${TERMUX_APP_DIR}/config' \
    '${TERMUX_APP_DIR}/scripts' \
    '${TERMUX_APP_DIR}/log' \
    '${TERMUX_CONTENT_DIR}' \
    '${TERMUX_UPLOAD_DIR}'"

# 4. 공유 설정 및 스크립트 전송
log "공통 설정 파일 및 관리 스크립트를 업로드합니다."
"${SCP_CMD[@]}" "${LOCAL_TERMUX_NGINX_CONF}" "${TERMUX_TARGET}:${TERMUX_APP_DIR}/config/aakorea-termux.conf"
"${SCP_CMD[@]}" "${LOCAL_TERMUX_ENV_EXAMPLE}" "${TERMUX_TARGET}:${TERMUX_APP_DIR}/config/termux.env.example"
"${SCP_CMD[@]}" "${LOCAL_RESTART_SCRIPT}" "${TERMUX_TARGET}:${REMOTE_RESTART_SCRIPT}"
# 원격 서버의 관리 스크립트에 실행 권한 부여
remote_exec "chmod +x '${REMOTE_RESTART_SCRIPT}'"

# 5. 프론트엔드 정적 파일 전송
if [[ ${SYNC_FRONTEND} -eq 1 ]]; then
    sync_frontend_dist
fi

# 6. 백엔드 JAR 전송
if [[ ${SYNC_BACKEND} -eq 1 ]]; then
    log "백엔드 실행 파일을 업로드합니다."
    "${SCP_CMD[@]}" "${BACKEND_JAR}" "${TERMUX_TARGET}:${TERMUX_APP_DIR}/backend/aakorea-main.jar"
fi

# 7. 백엔드 재시작 (환경 변수 적용)
if [[ ${SYNC_BACKEND} -eq 1 && ${RESTART_BACKEND} -eq 1 ]]; then
    # 환경 변수 파일(.env)이 있을 경우에만 자동 재시작 수행
    if remote_exec "test -f '${TERMUX_ENV_FILE}'"; then
        log "Termux 서버의 백엔드를 재시작합니다."
        remote_exec "APP_DIR='${TERMUX_APP_DIR}/backend' \
            ENV_FILE='${TERMUX_ENV_FILE}' \
            AAKOREA_CONTENT_ROOT='${TERMUX_CONTENT_DIR}' \
            AAKOREA_STORAGE_ROOT='${TERMUX_UPLOAD_DIR}' \
            '${REMOTE_RESTART_SCRIPT}' restart"
    else
        log "환경 변수 파일(${TERMUX_ENV_FILE})이 없어 재시작을 건너뜁니다."
        log "휴대폰 서버에서 해당 파일을 생성한 후 직접 restart-backend.sh를 실행해 주세요."
    fi
fi

log "배포가 완료되었습니다."
if [[ ${SYNC_FRONTEND} -eq 1 ]]; then
    log "프론트엔드 확인 (전화기 내부): http://127.0.0.1:8080"
fi
if [[ ${SYNC_BACKEND} -eq 1 ]]; then
    log "백엔드 로그: ${TERMUX_APP_DIR}/log/application.log"
    log "첫 배포라면 가동 전 반드시 ${TERMUX_ENV_FILE} 파일을 생성해야 합니다."
fi
