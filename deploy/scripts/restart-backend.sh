#!/usr/bin/env bash
# AAKorea 백엔드 재시작 및 관리 스크립트 (OCI Linux 환경 버전)
set -euo pipefail

COMMAND="${1:-restart}"

# 기본 경로 설정
APP_ROOT="/home/ubuntu/aakorea"
APP_DIR="${APP_ROOT}/backend"
JAR_PATH="${APP_DIR}/aakorea-core.jar"
LOG_PATH="${APP_ROOT}/log/application.log"
PID_FILE="${APP_DIR}/application.pid"
ENV_FILE="${APP_ROOT}/config/aakorea-oci.env"

log() { printf '[restart-backend] %s\n' "$*"; }

load_env_file() {
    if [[ -f "${ENV_FILE}" ]]; then
        set -a; source "${ENV_FILE}"; set +a
    fi
}

stop_backend() {
    log "기존 백엔드 종료 시도..."
    
    if [[ -f "${PID_FILE}" ]]; then
        local pid; pid=$(cat "${PID_FILE}")
        kill "${pid}" 2>/dev/null || true
        sleep 2
    fi

    local pids; pids=$(pgrep -f "aakorea-core.jar" || true)
    if [[ -n "${pids}" ]]; then
        log "남아있는 프로세스 강제 종료 (PIDs: ${pids})"
        pkill -9 -f "aakorea-core.jar" || true
    fi
    
    rm -f "${PID_FILE}"
}

start_backend() {
    load_env_file
    mkdir -p "$(dirname "${LOG_PATH}")"
    
    log "백엔드 시작 (프로필: oci)"
    JAVA_OPTS="${JAVA_OPTS:-} -DAAKOREA_CONTENT_ROOT=${APP_ROOT}/contents -DAAKOREA_STORAGE_ROOT=${APP_ROOT}/uploads"
    
    SPRING_PROFILES_ACTIVE="oci" nohup java ${JAVA_OPTS} -jar "${JAR_PATH}" --server.port=8081 > "${LOG_PATH}" 2>&1 &
    echo "$!" > "${PID_FILE}"
    
    sleep 3
    if kill -0 "$(cat "${PID_FILE}")" 2>/dev/null; then
        log "백엔드 시작 성공 (PID: $(cat "${PID_FILE}"))"
    else
        log "백엔드 시작 실패! 로그를 확인하세요: ${LOG_PATH}"
        exit 1
    fi
}

case "${COMMAND}" in
    start) start_backend ;;
    stop) stop_backend ;;
    restart) stop_backend; start_backend ;;
    status)
        if pgrep -f "aakorea-core.jar" >/dev/null; then log "백엔드: 실행 중"; else log "백엔드: 정지됨"; fi
        ;;
    *) echo "Usage: $0 {start|stop|restart|status}"; exit 1 ;;
esac
