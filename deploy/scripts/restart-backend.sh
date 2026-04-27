#!/usr/bin/env bash
# 백엔드(aakorea-core) 재시작 및 관리 스크립트 (Termux용)
set -euo pipefail

# 실행할 명령 (기본값: restart)
COMMAND="${1:-restart}"

# 기본 경로 설정
APP_DIR="${APP_DIR:-/data/data/com.termux/files/home/aakorea/backend}"
JAR_PATH="${JAR_PATH:-${APP_DIR}/aakorea-core.jar}"
LOG_PATH="${LOG_PATH:-/data/data/com.termux/files/home/aakorea/log/application.log}"
PID_FILE="${PID_FILE:-${APP_DIR}/application.pid}"
ENV_FILE="${ENV_FILE:-/data/data/com.termux/files/home/aakorea/config/aakorea-termux.env}"
APP_NAME_PATTERN="${APP_NAME_PATTERN:-aakorea-core.jar}"
SPRING_PROFILE="${SPRING_PROFILE:-termux}"

log() { printf '[restart-backend] %s\n' "$*"; }

load_env_file() {
    if [[ -f "${ENV_FILE}" ]]; then
        set -a
        source "${ENV_FILE}"
        set +a
    fi
}

find_running_pids() {
    ps -ef | awk -v pattern="${APP_NAME_PATTERN}" '$0 ~ pattern && $0 !~ /awk/ && $0 !~ /grep/ { print $2 }'
}

stop_backend() {
    local pids=()
    while IFS= read -r pid; do [[ -n "${pid}" ]] && pids+=("${pid}"); done < <(find_running_pids)
    
    if [[ ${#pids[@]} -eq 0 ]]; then
        log "실행 중인 백엔드 프로세스가 없습니다."
        return
    fi

    log "백엔드 프로세스 종료 시도 (PID: ${pids[*]})"
    kill "${pids[@]}" 2>/dev/null || true
    sleep 3
    kill -9 "${pids[@]}" 2>/dev/null || true
    rm -f "${PID_FILE}"
}

start_backend() {
    load_env_file
    mkdir -p "$(dirname "${LOG_PATH}")"
    
    log "백엔드 시작 (프로필: ${SPRING_PROFILE})"
    JAVA_OPTS="${JAVA_OPTS:-} -DAAKOREA_CONTENT_ROOT=${AAKOREA_CONTENT_ROOT:-/data/data/com.termux/files/home/aakorea/contents} -DAAKOREA_STORAGE_ROOT=${AAKOREA_STORAGE_ROOT:-/data/data/com.termux/files/home/aakorea/uploads}"
    
    SPRING_PROFILES_ACTIVE="${SPRING_PROFILE}" nohup java ${JAVA_OPTS} -jar "${JAR_PATH}" --server.port="${AAKOREA_SERVER_PORT:-8081}" > "${LOG_PATH}" 2>&1 &
    echo "$!" > "${PID_FILE}"
    
    sleep 2
    if kill -0 "$(cat "${PID_FILE}")" 2>/dev/null; then
        log "백엔드 시작 성공 (PID: $(cat "${PID_FILE}"))"
    else
        log "백엔드 시작 실패. 로그를 확인하세요: ${LOG_PATH}"
        exit 1
    fi
}

case "${COMMAND}" in
    start) start_backend ;;
    stop) stop_backend ;;
    restart) stop_backend; start_backend ;;
    status)
        pids=($(find_running_pids))
        if [[ ${#pids[@]} -gt 0 ]]; then log "실행 중 (PID: ${pids[*]})"; else log "정지됨"; fi
        ;;
    *) echo "Usage: $0 {start|stop|restart|status}"; exit 1 ;;
esac
