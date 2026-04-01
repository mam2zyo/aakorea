#!/usr/bin/env bash
set -euo pipefail

COMMAND="${1:-restart}"

APP_DIR="${APP_DIR:-/data/data/com.termux/files/home/apps/aakorea-main/backend/aakorea-main}"
JAR_PATH="${JAR_PATH:-${APP_DIR}/aakorea-main.jar}"
LOG_PATH="${LOG_PATH:-${APP_DIR}/application.log}"
PID_FILE="${PID_FILE:-${APP_DIR}/application.pid}"
ENV_FILE="${ENV_FILE:-/data/data/com.termux/files/home/aakorea-nginx.env}"
APP_NAME_PATTERN="${APP_NAME_PATTERN:-aakorea-main.jar}"
SPRING_PROFILE="${SPRING_PROFILE:-nginx}"
APP_PORT="${APP_PORT:-}"
JAVA_OPTS="${JAVA_OPTS:-}"

log() {
    printf '[restart-backend] %s\n' "$*"
}

usage() {
    cat <<EOF
Usage:
  $(basename "$0") [start|stop|restart|status]

Environment variables:
  APP_DIR          Backend directory on the phone
  JAR_PATH         Spring Boot jar path
  LOG_PATH         Application log path
  PID_FILE         PID file path
  ENV_FILE         Env file loaded before start
  APP_NAME_PATTERN Process match pattern used for stop/status
  SPRING_PROFILE   Spring profile passed as SPRING_PROFILES_ACTIVE
  APP_PORT         Explicit port override. Defaults to AAKOREA_SERVER_PORT or 8081
  JAVA_OPTS        Extra JVM options appended before -jar
EOF
}

find_running_pids() {
    ps -ef | awk -v pattern="${APP_NAME_PATTERN}" '
        $0 ~ pattern && $0 !~ /awk/ && $0 !~ /grep/ { print $2 }
    '
}

stop_running_processes() {
    local pids=()

    if [[ -f "${PID_FILE}" ]]; then
        local pid_from_file
        pid_from_file="$(cat "${PID_FILE}")"
        if [[ -n "${pid_from_file}" ]] && kill -0 "${pid_from_file}" 2>/dev/null; then
            pids+=("${pid_from_file}")
        fi
    fi

    while IFS= read -r pid; do
        [[ -n "${pid}" ]] && pids+=("${pid}")
    done < <(find_running_pids)

    if [[ ${#pids[@]} -eq 0 ]]; then
        log "No running backend process found"
        rm -f "${PID_FILE}"
        return
    fi

    mapfile -t pids < <(printf '%s\n' "${pids[@]}" | sort -u)

    log "Stopping backend process: ${pids[*]}"
    kill "${pids[@]}" 2>/dev/null || true
    sleep 3

    mapfile -t pids < <(
        printf '%s\n' "${pids[@]}" | while read -r pid; do
            if kill -0 "${pid}" 2>/dev/null; then
                printf '%s\n' "${pid}"
            fi
        done
    )

    if [[ ${#pids[@]} -gt 0 ]]; then
        log "Force killing remaining process: ${pids[*]}"
        kill -9 "${pids[@]}" 2>/dev/null || true
    fi

    rm -f "${PID_FILE}"
}

load_env_file() {
    if [[ ! -f "${ENV_FILE}" ]]; then
        printf 'Missing env file: %s\n' "${ENV_FILE}" >&2
        exit 1
    fi

    set -a
    # shellcheck disable=SC1090
    source "${ENV_FILE}"
    set +a
}

resolve_app_port() {
    if [[ -n "${APP_PORT}" ]]; then
        return
    fi

    if [[ -n "${AAKOREA_SERVER_PORT:-}" ]]; then
        APP_PORT="${AAKOREA_SERVER_PORT}"
        return
    fi

    if [[ -n "${SERVER_PORT:-}" ]]; then
        APP_PORT="${SERVER_PORT}"
        return
    fi

    APP_PORT="8081"
}

reload_nginx_if_available() {
    if ! command -v nginx >/dev/null 2>&1; then
        log "nginx is not installed, skipping reload"
        return
    fi

    if ! nginx -t >/dev/null 2>&1; then
        log "nginx config check failed, please review it manually"
        return
    fi

    if nginx -s reload >/dev/null 2>&1; then
        log "nginx reloaded"
        return
    fi

    if nginx >/dev/null 2>&1; then
        log "nginx started"
        return
    fi

    log "nginx start/reload did not succeed"
}

start_backend() {
    if ! command -v java >/dev/null 2>&1; then
        printf 'java command is required.\n' >&2
        exit 1
    fi

    if [[ ! -f "${JAR_PATH}" ]]; then
        printf 'Missing backend jar: %s\n' "${JAR_PATH}" >&2
        exit 1
    fi

    load_env_file
    resolve_app_port
    mkdir -p "${APP_DIR}"

    log "Starting backend with profile ${SPRING_PROFILE} on port ${APP_PORT}"
    SPRING_PROFILES_ACTIVE="${SPRING_PROFILE}" nohup java ${JAVA_OPTS} -jar "${JAR_PATH}" --server.port="${APP_PORT}" > "${LOG_PATH}" 2>&1 &
    echo "$!" > "${PID_FILE}"
    sleep 3

    if ! kill -0 "$(cat "${PID_FILE}")" 2>/dev/null; then
        log "Backend did not stay up. Recent log output:"
        tail -n 40 "${LOG_PATH}" || true
        exit 1
    fi

    log "Backend started with PID $(cat "${PID_FILE}")"
    reload_nginx_if_available
}

print_status() {
    mapfile -t pids < <(find_running_pids)

    if [[ ${#pids[@]} -eq 0 ]]; then
        log "Backend is not running"
        return
    fi

    log "Backend is running with PID(s): ${pids[*]}"
    if [[ -f "${PID_FILE}" ]]; then
        log "PID file: ${PID_FILE} -> $(cat "${PID_FILE}")"
    fi
    log "Log file: ${LOG_PATH}"
}

case "${COMMAND}" in
    start)
        start_backend
        ;;
    stop)
        stop_running_processes
        ;;
    restart)
        stop_running_processes
        start_backend
        ;;
    status)
        print_status
        ;;
    --help|-h|help)
        usage
        ;;
    *)
        printf 'Unknown command: %s\n\n' "${COMMAND}" >&2
        usage >&2
        exit 1
        ;;
esac
