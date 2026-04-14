#!/usr/bin/env bash
# 백엔드 재시작 및 관리 스크립트 (원격 서버용)
# Spring Boot JAR 프로세스를 중지/시작하고 Nginx 설정을 리로드합니다.

set -euo pipefail

# 실행할 명령 (기본값: restart)
COMMAND="${1:-restart}"

# 기본 경로 및 설정 (환경 변수로 덮어쓰기 가능)
# 1. 앱 관련 경로
APP_DIR="${APP_DIR:-/data/data/com.termux/files/home/aakorea/backend}"
JAR_PATH="${JAR_PATH:-${APP_DIR}/aakorea-main.jar}"
LOG_PATH="${LOG_PATH:-/data/data/com.termux/files/home/aakorea/log/application.log}"
PID_FILE="${PID_FILE:-${APP_DIR}/application.pid}"

# 2. 설정 관련 경로
ENV_FILE="${ENV_FILE:-/data/data/com.termux/files/home/aakorea/config/aakorea-termux.env}"
APP_NAME_PATTERN="${APP_NAME_PATTERN:-aakorea-main.jar}"  # 프로세스 식별용 패턴
SPRING_PROFILE="${SPRING_PROFILE:-termux}"                 # 사용할 Spring Profile

# 3. 추가 옵션
APP_PORT="${APP_PORT:-}"                                  # 포트 오버라이드
JAVA_OPTS="${JAVA_OPTS:-}"                                # 추가 JVM 옵션
AAKOREA_CONTENT_ROOT="${AAKOREA_CONTENT_ROOT:-}"          # 콘텐츠 저장소 경로
AAKOREA_STORAGE_ROOT="${AAKOREA_STORAGE_ROOT:-}"          # 일반 파일 업로드 경로

# 로그 출력용 함수
log() {
    printf '[restart-backend] %s\n' "$*"
}

# 도움말 출력 함수
usage() {
    cat <<EOF
사용법:
  $(basename "$0") [start|stop|restart|status]

환경 변수:
  APP_DIR          백엔드 jar가 위치한 디렉토리
  JAR_PATH         Spring Boot jar 파일 전체 경로
  LOG_PATH         애플리케이션 로그 파일 경로
  PID_FILE         프로세스 ID 저장 파일 경로
  ENV_FILE         실행 전 로드할 환경 변수 파일 (.env)
  SPRING_PROFILE   적용할 Spring 프로필 (기본값: termux)
  AAKOREA_CONTENT_ROOT  콘텐츠(HTML) 저장 위치 (환경 변수 주입)
  AAKOREA_STORAGE_ROOT  업로드 파일(Asset) 저장 위치 (환경 변수 주입)
EOF
}

# 현재 실행 중인 프로세스의 PID를 찾는 함수
find_running_pids() {
    ps -ef | awk -v pattern="${APP_NAME_PATTERN}" '
        $0 ~ pattern && $0 !~ /awk/ && $0 !~ /grep/ { print $2 }
    '
}

# 기존에 실행 중인 백엔드 프로세스를 안전하게 종료하는 함수
stop_running_processes() {
    local pids=()

    # 1. PID 파일에서 확인
    if [[ -f "${PID_FILE}" ]]; then
        local pid_from_file
        pid_from_file="$(cat "${PID_FILE}")"
        if [[ -n "${pid_from_file}" ]] && kill -0 "${pid_from_file}" 2>/dev/null; then
            pids+=("${pid_from_file}")
        fi
    fi

    # 2. 프로세스 목록에서 패턴으로 추가 확인
    while IFS= read -r pid; do
        [[ -n "${pid}" ]] && pids+=("${pid}")
    done < <(find_running_pids)

    if [[ ${#pids[@]} -eq 0 ]]; then
        log "실행 중인 백엔드 프로세스가 없습니다."
        rm -f "${PID_FILE}"
        return
    fi

    # 중복 PID 제거
    mapfile -t pids < <(printf '%s\n' "${pids[@]}" | sort -u)

    log "백엔드 프로세스 종료 시도 (PID: ${pids[*]})"
    kill "${pids[@]}" 2>/dev/null || true
    sleep 3

    # 여전히 살아있는 프로세스가 있는지 확인
    mapfile -t pids < <(
        printf '%s\n' "${pids[@]}" | while read -r pid; do
            if kill -0 "${pid}" 2>/dev/null; then
                printf '%s\n' "${pid}"
            fi
        done
    )

    # 종료되지 않은 프로세스는 강제 종료(SIGKILL)
    if [[ ${#pids[@]} -gt 0 ]]; then
        log "남아있는 프로세스 강제 종료 시도: ${pids[*]}"
        kill -9 "${pids[@]}" 2>/dev/null || true
    fi

    rm -f "${PID_FILE}"
}

# 환경 변수 파일을 읽어서 현재 셸 세션에 적용하는 함수
load_env_file() {
    if [[ ! -f "${ENV_FILE}" ]]; then
        printf '환경 변수 파일을 찾을 수 없습니다: %s\n' "${ENV_FILE}" >&2
        exit 1
    fi

    set -a
    # shellcheck disable=SC1090
    source "${ENV_FILE}"
    set +a
}

# 사용할 포트를 결정하는 함수
resolve_app_port() {
    if [[ -n "${APP_PORT}" ]]; then
        return
    fi
    if [[ -n "${AAKOREA_SERVER_PORT:-}" ]]; then
        APP_PORT="${AAKOREA_SERVER_PORT}"
        return
    fi
    APP_PORT="8081" # 기본 포트
}

# Nginx가 설치되어 있다면 설정을 다시 불러오는 함수
reload_nginx_if_available() {
    if ! command -v nginx >/dev/null 2>&1; then
        return
    fi
    if ! nginx -t >/dev/null 2>&1; then
        log "Nginx 설정에 오류가 있습니다. 수동으로 확인해 주세요."
        return
    fi
    if nginx -s reload >/dev/null 2>&1; then
        log "Nginx 설정을 리로드했습니다."
        return
    fi
    if nginx >/dev/null 2>&1; then
        log "Nginx를 시작했습니다."
    fi
}

# 백엔드 애플리케이션을 구동하는 핵심 함수
start_backend() {
    if ! command -v java >/dev/null 2>&1; then
        printf 'Java가 설치되어 있지 않습니다.\n' >&2
        exit 1
    fi

    if [[ ! -f "${JAR_PATH}" ]]; then
        printf '백엔드 JAR 파일을 찾을 수 없습니다: %s\n' "${JAR_PATH}" >&2
        exit 1
    fi

    load_env_file
    resolve_app_port
    mkdir -p "${APP_DIR}"

    log "백엔드 시작 (포트: ${APP_PORT}, 프로필: ${SPRING_PROFILE})"
    
    # 주입된 환경 변수가 있다면 JVM 시스템 프로퍼티(-D)로 전달
    if [[ -n "${AAKOREA_CONTENT_ROOT}" ]]; then
        JAVA_OPTS="${JAVA_OPTS} -DAAKOREA_CONTENT_ROOT=${AAKOREA_CONTENT_ROOT}"
    fi
    if [[ -n "${AAKOREA_STORAGE_ROOT}" ]]; then
        JAVA_OPTS="${JAVA_OPTS} -DAAKOREA_STORAGE_ROOT=${AAKOREA_STORAGE_ROOT}"
    fi

    # 백그라운드에서 실행 (nohup)
    SPRING_PROFILES_ACTIVE="${SPRING_PROFILE}" nohup java ${JAVA_OPTS} -jar "${JAR_PATH}" --server.port="${APP_PORT}" > "${LOG_PATH}" 2>&1 &
    echo "$!" > "${PID_FILE}"
    
    # 기동 대기 및 상태 확인
    sleep 3
    if ! kill -0 "$(cat "${PID_FILE}")" 2>/dev/null; then
        log "백엔드가 정상적으로 시작되지 않았습니다. 로그를 확인하세요."
        tail -n 40 "${LOG_PATH}" || true
        exit 1
    fi

    log "백엔드 시작 성공 (PID: $(cat "${PID_FILE}"))"
    reload_nginx_if_available
}

# 현재 실행 상태를 출력하는 함수
print_status() {
    mapfile -t pids < <(find_running_pids)

    if [[ ${#pids[@]} -eq 0 ]]; then
        log "백엔드가 실행 중이 아닙니다."
        return
    fi

    log "백엔드 실행 중 (PID: ${pids[*]})"
    if [[ -f "${PID_FILE}" ]]; then
        log "PID 파일 정보: $(cat "${PID_FILE}")"
    fi
    log "로그 위치: ${LOG_PATH}"
}

# 명령줄 인수에 따른 동작 처리
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
        printf '알 수 없는 명령: %s\n\n' "${COMMAND}" >&2
        usage >&2
        exit 1
        ;;
esac
