#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"

FRONTEND_DIR="${REPO_ROOT}/frontend/aakorea-main"
FRONTEND_DIST="${FRONTEND_DIR}/dist"
BACKEND_DIR="${REPO_ROOT}/backend/aakorea-main"
BACKEND_JAR="${BACKEND_DIR}/build/libs/aakorea-main-0.0.1-SNAPSHOT.jar"

LOCAL_TERMUX_NGINX_CONF="${REPO_ROOT}/deploy/nginx/aakorea-termux.conf"
LOCAL_NGINX_ENV_EXAMPLE="${REPO_ROOT}/deploy/env/nginx.env.example"
LOCAL_RESTART_SCRIPT="${REPO_ROOT}/deploy/scripts/restart-backend.sh"

TERMUX_TARGET="${TERMUX_TARGET:-}"
TERMUX_SSH_PORT="${TERMUX_SSH_PORT:-}"
TERMUX_APP_DIR="${TERMUX_APP_DIR:-/data/data/com.termux/files/home/apps/aakorea-main}"
TERMUX_ENV_FILE="${TERMUX_ENV_FILE:-/data/data/com.termux/files/home/aakorea-nginx.env}"
REMOTE_RESTART_SCRIPT="${REMOTE_RESTART_SCRIPT:-${TERMUX_APP_DIR}/deploy/scripts/restart-backend.sh}"

SYNC_FRONTEND=1
SYNC_BACKEND=1
BUILD_FRONTEND=1
BUILD_BACKEND=1
RESTART_BACKEND=1
SSH_CMD=(ssh)
SCP_CMD=(scp)
RSYNC_SSH_COMMAND="ssh"

usage() {
    cat <<'EOF'
Usage:
  ./deploy/scripts/deploy-to-termux.sh <termux-user>@<termux-host> [options]

Required:
  TERMUX_TARGET or the first positional argument must be set.

Options:
  --frontend-only  Build and upload only frontend dist files
  --backend-only   Build and upload only backend jar file
  --skip-build     Reuse existing local build outputs
  --no-restart     Do not restart backend after upload
  --help           Show this help

Environment variables:
  TERMUX_TARGET         SSH target for the phone server
  TERMUX_SSH_PORT       SSH port for direct Termux access, e.g. 8022
  TERMUX_APP_DIR        Remote app root
  TERMUX_ENV_FILE       Remote env file consumed by restart-backend.sh
  REMOTE_RESTART_SCRIPT Remote restart script path

Examples:
  TERMUX_TARGET=termux@192.168.0.20 TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh
  ./deploy/scripts/deploy-to-termux.sh ssh.maumtalk.win --skip-build
  TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh termux@192.168.0.20 --frontend-only
EOF
}

log() {
    printf '[deploy-to-termux] %s\n' "$*"
}

require_file() {
    local path="$1"
    if [[ ! -e "${path}" ]]; then
        printf 'Missing required file: %s\n' "${path}" >&2
        exit 1
    fi
}

remote_exec() {
    "${SSH_CMD[@]}" "${TERMUX_TARGET}" "$@"
}

sync_frontend_dist() {
    if command -v rsync >/dev/null 2>&1 && remote_exec "command -v rsync >/dev/null 2>&1"; then
        log "Syncing frontend dist with rsync"
        rsync -av --delete -e "${RSYNC_SSH_COMMAND}" \
            "${FRONTEND_DIST}/" \
            "${TERMUX_TARGET}:${TERMUX_APP_DIR}/frontend/aakorea-main/dist/"
        return
    fi

    log "rsync is unavailable on one side, falling back to scp"
    remote_exec "rm -rf '${TERMUX_APP_DIR}/frontend/aakorea-main/dist' && mkdir -p '${TERMUX_APP_DIR}/frontend/aakorea-main'"
    "${SCP_CMD[@]}" -r "${FRONTEND_DIST}" "${TERMUX_TARGET}:${TERMUX_APP_DIR}/frontend/aakorea-main/"
}

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
            printf 'Unknown option: %s\n\n' "$1" >&2
            usage >&2
            exit 1
            ;;
        *)
            if [[ -z "${TERMUX_TARGET}" ]]; then
                TERMUX_TARGET="$1"
            else
                printf 'Unexpected positional argument: %s\n\n' "$1" >&2
                usage >&2
                exit 1
            fi
            ;;
    esac
    shift
done

if [[ -z "${TERMUX_TARGET}" ]]; then
    printf 'TERMUX_TARGET is required.\n\n' >&2
    usage >&2
    exit 1
fi

if [[ -n "${TERMUX_SSH_PORT}" ]]; then
    SSH_CMD+=(-p "${TERMUX_SSH_PORT}")
    SCP_CMD+=(-P "${TERMUX_SSH_PORT}")
    RSYNC_SSH_COMMAND="ssh -p ${TERMUX_SSH_PORT}"
fi

require_file "${LOCAL_TERMUX_NGINX_CONF}"
require_file "${LOCAL_NGINX_ENV_EXAMPLE}"
require_file "${LOCAL_RESTART_SCRIPT}"

if [[ ${BUILD_FRONTEND} -eq 1 ]]; then
    log "Building frontend dist"
    (
        cd "${FRONTEND_DIR}"
        npm run build
    )
fi

if [[ ${BUILD_BACKEND} -eq 1 ]]; then
    log "Building backend boot jar"
    (
        cd "${BACKEND_DIR}"
        ./gradlew bootJar
    )
fi

if [[ ${SYNC_FRONTEND} -eq 1 ]]; then
    require_file "${FRONTEND_DIST}"
fi

if [[ ${SYNC_BACKEND} -eq 1 ]]; then
    require_file "${BACKEND_JAR}"
fi

log "Preparing remote directories"
remote_exec "mkdir -p \
    '${TERMUX_APP_DIR}/frontend/aakorea-main' \
    '${TERMUX_APP_DIR}/backend/aakorea-main' \
    '${TERMUX_APP_DIR}/deploy/nginx' \
    '${TERMUX_APP_DIR}/deploy/env' \
    '${TERMUX_APP_DIR}/deploy/scripts'"

log "Uploading shared deployment files"
"${SCP_CMD[@]}" "${LOCAL_TERMUX_NGINX_CONF}" "${TERMUX_TARGET}:${TERMUX_APP_DIR}/deploy/nginx/aakorea-termux.conf"
"${SCP_CMD[@]}" "${LOCAL_NGINX_ENV_EXAMPLE}" "${TERMUX_TARGET}:${TERMUX_APP_DIR}/deploy/env/nginx.env.example"
"${SCP_CMD[@]}" "${LOCAL_RESTART_SCRIPT}" "${TERMUX_TARGET}:${REMOTE_RESTART_SCRIPT}"
remote_exec "chmod +x '${REMOTE_RESTART_SCRIPT}'"

if [[ ${SYNC_FRONTEND} -eq 1 ]]; then
    sync_frontend_dist
fi

if [[ ${SYNC_BACKEND} -eq 1 ]]; then
    log "Uploading backend jar"
    "${SCP_CMD[@]}" "${BACKEND_JAR}" "${TERMUX_TARGET}:${TERMUX_APP_DIR}/backend/aakorea-main/aakorea-main.jar"
fi

if [[ ${SYNC_BACKEND} -eq 1 && ${RESTART_BACKEND} -eq 1 ]]; then
    if remote_exec "test -f '${TERMUX_ENV_FILE}'"; then
        log "Restarting backend on Termux"
        remote_exec "APP_DIR='${TERMUX_APP_DIR}/backend/aakorea-main' \
            ENV_FILE='${TERMUX_ENV_FILE}' \
            '${REMOTE_RESTART_SCRIPT}' restart"
    else
        log "Skipping backend restart because ${TERMUX_ENV_FILE} does not exist yet"
        log "Create the env file on the phone, then run restart-backend.sh manually"
    fi
fi

log "Deployment completed"
if [[ ${SYNC_FRONTEND} -eq 1 ]]; then
    log "Frontend preview: http://127.0.0.1:8080 on the phone"
fi
if [[ ${SYNC_BACKEND} -eq 1 ]]; then
    log "Backend log: ${TERMUX_APP_DIR}/backend/aakorea-main/application.log"
    log "If this is the first deploy, create ${TERMUX_ENV_FILE} on the phone before restarting."
fi
