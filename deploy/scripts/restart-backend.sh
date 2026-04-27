#!/usr/bin/env bash
# AAKorea 백엔드 재시작 및 관리 스크립트 (Termux 최적화 버전)
set -euo pipefail

COMMAND="${1:-restart}"

# 기본 경로 설정
APP_ROOT="/data/data/com.termux/files/home/aakorea"
APP_DIR="${APP_ROOT}/backend"
JAR_PATH="${APP_DIR}/aakorea-core.jar"
LOG_PATH="${APP_ROOT}/log/application.log"
PID_FILE="${APP_DIR}/application.pid"
ENV_FILE="${APP_ROOT}/config/aakorea-termux.env"

# WiFi Keep Alive 설정
WIFI_KEEPALIVE_PID_FILE="${APP_DIR}/wifi-keepalive.pid"
WIFI_KEEPALIVE_INTERVAL=30

log() { printf '[restart-backend] %s\n' "$*"; }

load_env_file() {
    if [[ -f "${ENV_FILE}" ]]; then
        set -a; source "${ENV_FILE}"; set +a
    fi
}

stop_wifi_keepalive() {
    if [[ -f "${WIFI_KEEPALIVE_PID_FILE}" ]]; then
        local kpid; kpid=$(cat "${WIFI_KEEPALIVE_PID_FILE}")
        kill "${kpid}" 2>/dev/null || true
        rm -f "${WIFI_KEEPALIVE_PID_FILE}"
    fi
}

start_wifi_keepalive() {
    stop_wifi_keepalive
    load_env_file
    
    # 환경 변수에서 타겟을 가져오고, 없으면 기본값(192.168.50.1) 사용
    local target="${WIFI_KEEPALIVE_TARGET:-192.168.50.1}"
    
    if [[ "${WIFI_KEEPALIVE_ENABLED:-1}" == "1" ]]; then
        log "WiFi Keep-alive 시작 (대상: ${target})"
        nohup ping -i "${WIFI_KEEPALIVE_INTERVAL}" "${target}" > /dev/null 2>&1 &
        echo "$!" > "${WIFI_KEEPALIVE_PID_FILE}"
    fi
}

stop_backend() {
    stop_wifi_keepalive
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
    
    if command -v termux-wake-lock >/dev/null; then
        termux-wake-lock
    fi

    log "백엔드 시작 (프로필: termux)"
    JAVA_OPTS="${JAVA_OPTS:-} -DAAKOREA_CONTENT_ROOT=${APP_ROOT}/contents -DAAKOREA_STORAGE_ROOT=${APP_ROOT}/uploads"
    
    SPRING_PROFILES_ACTIVE="termux" nohup java ${JAVA_OPTS} -jar "${JAR_PATH}" --server.port=8081 > "${LOG_PATH}" 2>&1 &
    echo "$!" > "${PID_FILE}"
    
    sleep 3
    if kill -0 "$(cat "${PID_FILE}")" 2>/dev/null; then
        log "백엔드 시작 성공 (PID: $(cat "${PID_FILE}"))"
        start_wifi_keepalive
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
        if [[ -f "${WIFI_KEEPALIVE_PID_FILE}" ]]; then
            local kpid; kpid=$(cat "${WIFI_KEEPALIVE_PID_FILE}")
            if kill -0 "${kpid}" 2>/dev/null; then
                log "WiFi Keep-alive: 실행 중 (PID: ${kpid})"
            else
                log "WiFi Keep-alive: 정지됨 (PID 파일만 존재)"
            fi
        else
            log "WiFi Keep-alive: 정지됨"
        fi
        ;;
    *) echo "Usage: $0 {start|stop|restart|status}"; exit 1 ;;
esac
