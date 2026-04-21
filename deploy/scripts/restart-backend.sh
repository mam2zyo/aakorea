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
WIFI_KEEPALIVE_ENABLED="${WIFI_KEEPALIVE_ENABLED:-0}"     # 공유기 대상 keepalive 활성화 여부
WIFI_KEEPALIVE_TARGET="${WIFI_KEEPALIVE_TARGET:-auto}"    # keepalive 대상 IP 또는 auto
WIFI_KEEPALIVE_INTERVAL="${WIFI_KEEPALIVE_INTERVAL:-30}"  # ping 간격(초)
WIFI_KEEPALIVE_PID_FILE="${WIFI_KEEPALIVE_PID_FILE:-${APP_DIR}/wifi-keepalive.pid}"
WIFI_KEEPALIVE_LOG_PATH="${WIFI_KEEPALIVE_LOG_PATH:-/dev/null}"

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
  WIFI_KEEPALIVE_ENABLED  공유기 keepalive 활성화 여부 (1/true/yes/on)
  WIFI_KEEPALIVE_TARGET   ping 대상 IP 또는 auto(기본 게이트웨이 자동 탐지)
  WIFI_KEEPALIVE_INTERVAL ping 간격(초), 기본값 30
EOF
}

ensure_parent_dir() {
    local target_path="$1"
    if [[ "${target_path}" == "/dev/null" ]]; then
        return
    fi
    mkdir -p "$(dirname "${target_path}")"
}

is_keepalive_enabled() {
    case "${WIFI_KEEPALIVE_ENABLED}" in
        1|true|TRUE|yes|YES|on|ON)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

load_env_file_optional() {
    if [[ ! -f "${ENV_FILE}" ]]; then
        return
    fi

    set -a
    # shellcheck disable=SC1090
    source "${ENV_FILE}"
    set +a
}

detect_default_gateway() {
    local gateway

    # 1. ip route get (가장 정확한 방법: 외부 대상 경로 질의)
    # 특정 외부 IP로 가는 경로를 질의하여 사용 중인 게이트웨이를 직접 추출
    gateway="$(ip route get 8.8.8.8 2>/dev/null | awk '/via/ {for(i=1;i<NF;i++) if($i=="via") {print $(i+1); exit}}')"
    if [[ -n "${gateway}" && "${gateway}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        printf '%s\n' "${gateway}"
        return 0
    fi

    # 2. ip route (기본 게이트웨이 탐지용)
    # 'default via 192.168.1.1 dev wlan0 proto static' 형식 대응
    gateway="$(ip route show default 2>/dev/null | awk '/default/ { for(i=1;i<NF;i++) if($i=="via") {print $(i+1); exit} }')"
    if [[ -n "${gateway}" ]]; then
        printf '%s\n' "${gateway}"
        return 0
    fi

    # 3. route -n (고전적인 net-tools 방식)
    # Destination 0.0.0.0의 Gateway 컬럼 탐지
    gateway="$(route -n 2>/dev/null | awk '$1 == "0.0.0.0" { for(i=2;i<=NF;i++) if($i != "0.0.0.0" && $i ~ /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/) {print $i; exit} }')"
    if [[ -n "${gateway}" ]]; then
        printf '%s\n' "${gateway}"
        return 0
    fi

    # 4. getprop (Android/Termux 전용 방식)
    # WiFi가 활성화된 경우 DHCP 정보를 직접 조회
    if command -v getprop >/dev/null 2>&1; then
        gateway="$(getprop dhcp.wlan0.gateway 2>/dev/null)"
        if [[ -n "${gateway}" && "${gateway}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            printf '%s\n' "${gateway}"
            return 0
        fi
        # eth0 등 다른 인터페이스도 시도
        gateway="$(getprop dhcp.eth0.gateway 2>/dev/null)"
        if [[ -n "${gateway}" && "${gateway}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            printf '%s\n' "${gateway}"
            return 0
        fi
    fi

    # 5. dumpsys connectivity (Android 시스템 서비스 활용)
    if command -v dumpsys >/dev/null 2>&1; then
        # 'Gateway: /192.168.1.1' 형식 추출
        gateway="$(dumpsys connectivity 2>/dev/null | grep -i "Gateway:" | head -n 1 | awk -F'/' '{print $2}' | grep -oE '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+')"
        if [[ -n "${gateway}" ]]; then
            printf '%s\n' "${gateway}"
            return 0
        fi
    fi

    # 6. /proc/net/route (리눅스 커널 인터페이스 직접 조회)
    # Gateway 필드가 리틀 엔디안 16진수임에 유의 (예: 01901DAC -> 172.29.144.1)
    # Dest(2번째)가 00000000인 행의 Gateway(3번째) 추출 후 점진법 IP로 변환
    if [[ -f /proc/net/route ]]; then
        local hex_gateway
        hex_gateway="$(awk '$2 == "00000000" { print $3; exit }' /proc/net/route 2>/dev/null)"
        if [[ -n "${hex_gateway}" && "${hex_gateway}" != "00000000" ]]; then
            # 16진수를 IP로 변환 (8자리 hex를 2자리씩 끊어서 역순으로 10진수 변환)
            local g1 g2 g3 g4
            g4=$((16#${hex_gateway:0:2}))
            g3=$((16#${hex_gateway:2:2}))
            g2=$((16#${hex_gateway:4:2}))
            g1=$((16#${hex_gateway:6:2}))
            printf '%d.%d.%d.%d\n' "${g1}" "${g2}" "${g3}" "${g4}"
            return 0
        fi
    fi

    return 1
}

resolve_wifi_keepalive_target() {
    if [[ -n "${WIFI_KEEPALIVE_TARGET}" && "${WIFI_KEEPALIVE_TARGET}" != "auto" ]]; then
        printf '%s\n' "${WIFI_KEEPALIVE_TARGET}"
        return 0
    fi

    detect_default_gateway
}

resolve_wifi_keepalive_interval() {
    if [[ "${WIFI_KEEPALIVE_INTERVAL}" =~ ^[0-9]+$ ]] && (( WIFI_KEEPALIVE_INTERVAL > 0 )); then
        printf '%s\n' "${WIFI_KEEPALIVE_INTERVAL}"
        return 0
    fi

    printf '30\n'
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

    stop_wifi_keepalive

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

stop_wifi_keepalive() {
    local keepalive_pid=""

    if [[ ! -f "${WIFI_KEEPALIVE_PID_FILE}" ]]; then
        return
    fi

    keepalive_pid="$(cat "${WIFI_KEEPALIVE_PID_FILE}")"
    if [[ -z "${keepalive_pid}" ]] || ! kill -0 "${keepalive_pid}" 2>/dev/null; then
        rm -f "${WIFI_KEEPALIVE_PID_FILE}"
        return
    fi

    log "Wi-Fi keepalive 종료 시도 (PID: ${keepalive_pid})"
    kill "${keepalive_pid}" 2>/dev/null || true
    sleep 1

    if kill -0 "${keepalive_pid}" 2>/dev/null; then
        log "남아있는 Wi-Fi keepalive 강제 종료 시도: ${keepalive_pid}"
        kill -9 "${keepalive_pid}" 2>/dev/null || true
    fi

    rm -f "${WIFI_KEEPALIVE_PID_FILE}"
}

start_wifi_keepalive() {
    local keepalive_target=""
    local keepalive_interval=""

    load_env_file_optional # 환경 변수 파일(.env) 로드 (수동 설정 확인용)

    if ! is_keepalive_enabled; then
        return
    fi

    if ! command -v ping >/dev/null 2>&1; then
        log "ping 명령을 찾지 못해 Wi-Fi keepalive를 시작하지 않습니다."
        return
    fi

    keepalive_target="$(resolve_wifi_keepalive_target || true)"
    if [[ -z "${keepalive_target}" ]]; then
        log "기본 게이트웨이를 자동 탐지하지 못했습니다."
        log "해결 방법:"
        log "1. ${ENV_FILE:-.env} 파일에 WIFI_KEEPALIVE_TARGET=192.168.50.1 처럼 대상 IP를 추가하세요."
        log "2. 또는 실행 시 직접 환경 변수를 주입하세요: WIFI_KEEPALIVE_TARGET=192.168.50.1 ./restart-backend.sh"
        return
    fi

    keepalive_interval="$(resolve_wifi_keepalive_interval)"

    if [[ -f "${WIFI_KEEPALIVE_PID_FILE}" ]]; then
        local existing_pid
        existing_pid="$(cat "${WIFI_KEEPALIVE_PID_FILE}")"
        if [[ -n "${existing_pid}" ]] && kill -0 "${existing_pid}" 2>/dev/null; then
            log "Wi-Fi keepalive가 이미 실행 중입니다 (PID: ${existing_pid})."
            return
        fi
        rm -f "${WIFI_KEEPALIVE_PID_FILE}"
    fi

    ensure_parent_dir "${WIFI_KEEPALIVE_PID_FILE}"
    ensure_parent_dir "${WIFI_KEEPALIVE_LOG_PATH}"

    nohup ping -i "${keepalive_interval}" "${keepalive_target}" >> "${WIFI_KEEPALIVE_LOG_PATH}" 2>&1 &
    echo "$!" > "${WIFI_KEEPALIVE_PID_FILE}"
    sleep 1

    if ! kill -0 "$(cat "${WIFI_KEEPALIVE_PID_FILE}")" 2>/dev/null; then
        log "Wi-Fi keepalive가 정상적으로 시작되지 않았습니다."
        rm -f "${WIFI_KEEPALIVE_PID_FILE}"
        return
    fi

    log "Wi-Fi keepalive 시작 성공 (PID: $(cat "${WIFI_KEEPALIVE_PID_FILE}"), 대상: ${keepalive_target}, 간격: ${keepalive_interval}s)"
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
    ensure_parent_dir "${LOG_PATH}"

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
    start_wifi_keepalive
    reload_nginx_if_available
}

# 현재 실행 상태를 출력하는 함수
print_status() {
    mapfile -t pids < <(find_running_pids)

    if [[ ${#pids[@]} -eq 0 ]]; then
        log "백엔드가 실행 중이 아닙니다."
    else
        log "백엔드 실행 중 (PID: ${pids[*]})"
        if [[ -f "${PID_FILE}" ]]; then
            log "PID 파일 정보: $(cat "${PID_FILE}")"
        fi
        log "로그 위치: ${LOG_PATH}"
    fi

    if is_keepalive_enabled; then
        if [[ -f "${WIFI_KEEPALIVE_PID_FILE}" ]]; then
            local keepalive_pid
            keepalive_pid="$(cat "${WIFI_KEEPALIVE_PID_FILE}")"
            if [[ -n "${keepalive_pid}" ]] && kill -0 "${keepalive_pid}" 2>/dev/null; then
                log "Wi-Fi keepalive 실행 중 (PID: ${keepalive_pid})"
            else
                log "Wi-Fi keepalive PID 파일이 있지만 프로세스는 실행 중이 아닙니다."
            fi
        else
            log "Wi-Fi keepalive가 활성화되어 있지만 현재 실행 중이지 않습니다."
        fi
    else
        log "Wi-Fi keepalive 비활성화 상태입니다."
    fi
}

# 명령줄 인수에 따른 동작 처리
case "${COMMAND}" in
    start)
        start_backend
        ;;
    stop)
        load_env_file_optional
        stop_running_processes
        ;;
    restart)
        load_env_file_optional
        stop_running_processes
        start_backend
        ;;
    status)
        load_env_file_optional
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
