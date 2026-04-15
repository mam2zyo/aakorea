#!/usr/bin/env bash
set -euo pipefail

TERMUX_USER="${TERMUX_USER:-u0_a312}"
TERMUX_HOST="${TERMUX_HOST:-192.168.50.211}"
TERMUX_TARGET="${TERMUX_TARGET:-}"
TERMUX_SSH_PORT="${TERMUX_SSH_PORT:-8022}"
REMOTE_ENV_FILE="${REMOTE_ENV_FILE:-/data/data/com.termux/files/home/aakorea/config/aakorea-termux.env}"
DB_SCHEMA="${DB_SCHEMA:-public}"
LIST_ONLY=0
CONFIRMED=0
DROP_SCHEMA=0
INTERACTIVE=0
ACTION_FLAGS_SPECIFIED=0
SELECTED_TABLES=()

SSH_CMD=(ssh)

usage() {
    cat <<'EOF'
Usage:
  ./deploy/scripts/drop-tables-over-ssh.sh <termux-user>@<termux-host> [options]

Required:
  TERMUX_TARGET or the first positional argument can be set.
  If omitted, the script uses TERMUX_USER/TERMUX_HOST defaults for the current A34 test server.

Options:
  --interactive       Open an interactive menu
  --list              Show what would be deleted, but do not delete anything
  --schema NAME       Target schema. Defaults to public
  --drop-schema       Drop and recreate the entire schema
  --table NAME        Drop only one table in the target schema (repeatable)
  --tables N1,N2      Drop only the listed tables in the target schema
  --yes               Actually run the destructive action
  --help              Show this help

Behavior:
  No action flags + TTY:
    Open an interactive menu automatically.

  Default behavior without --drop-schema/--table/--tables:
    Drop all tables inside the target schema.

  With --drop-schema:
    DROP SCHEMA ... CASCADE and then recreate the schema.

  With --table/--tables:
    Drop only the selected tables inside the target schema.

Environment variables:
  TERMUX_USER       Termux username. Defaults to u0_a312
  TERMUX_HOST       Termux host/IP. Defaults to 192.168.50.211
  TERMUX_TARGET     SSH target for the phone server. Overrides TERMUX_USER/HOST
  TERMUX_SSH_PORT   SSH port for direct Termux access. Defaults to 8022
  REMOTE_ENV_FILE   Remote env file containing DB credentials
  DB_SCHEMA         Target schema name. Defaults to public

Examples:
  ./deploy/scripts/drop-tables-over-ssh.sh
  ./deploy/scripts/drop-tables-over-ssh.sh --table notices --list
  ./deploy/scripts/drop-tables-over-ssh.sh --tables notices,content_pages --yes
  ./deploy/scripts/drop-tables-over-ssh.sh --schema public --drop-schema --yes
EOF
}

log() {
    printf '[drop-tables-over-ssh] %s\n' "$*"
}

validate_identifier() {
    local value="$1"
    [[ "${value}" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]
}

is_tty_session() {
    [[ -t 0 && -t 1 ]]
}

pause_for_enter() {
    local _
    read -r -p 'Press Enter to continue... ' _
}

confirm_prompt() {
    local prompt="$1"
    local answer

    read -r -p "${prompt} [y/N]: " answer
    case "${answer}" in
        y|Y|yes|YES)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

add_selected_table() {
    local table_name="$1"

    if [[ -z "${table_name}" ]]; then
        return
    fi

    if ! validate_identifier "${table_name}"; then
        printf 'Invalid table name: %s\n' "${table_name}" >&2
        exit 1
    fi

    SELECTED_TABLES+=("${table_name}")
}

normalize_selected_tables() {
    if (( ${#SELECTED_TABLES[@]} == 0 )); then
        return
    fi

    mapfile -t SELECTED_TABLES < <(printf '%s\n' "${SELECTED_TABLES[@]}" | sort -u)
}

tables_to_csv() {
    local tables=("$@")
    if (( ${#tables[@]} == 0 )); then
        printf ''
        return
    fi

    local csv
    csv="$(IFS=,; printf '%s' "${tables[*]}")"
    printf '%s' "${csv}"
}

setup_target_and_ssh() {
    if [[ -z "${TERMUX_TARGET}" && -n "${TERMUX_USER}" && -n "${TERMUX_HOST}" ]]; then
        TERMUX_TARGET="${TERMUX_USER}@${TERMUX_HOST}"
    fi

    if [[ -z "${TERMUX_TARGET}" ]]; then
        printf 'TERMUX_TARGET is required.\n\n' >&2
        usage >&2
        exit 1
    fi

    if ! validate_identifier "${DB_SCHEMA}"; then
        printf 'Invalid schema name: %s\n' "${DB_SCHEMA}" >&2
        exit 1
    fi

    if (( DROP_SCHEMA == 1 && ${#SELECTED_TABLES[@]} > 0 )); then
        printf '%s\n' '--drop-schema cannot be combined with --table/--tables.' >&2
        exit 1
    fi

    if [[ -n "${TERMUX_SSH_PORT}" ]]; then
        SSH_CMD+=(-p "${TERMUX_SSH_PORT}")
    fi
}

run_remote_action() {
    local mode="$1"
    local action="$2"
    local tables_csv="${3:-}"
    local announce="${4:-1}"

    if [[ "${announce}" == "1" ]]; then
        log "Connecting to ${TERMUX_TARGET}"
    fi

    "${SSH_CMD[@]}" "${TERMUX_TARGET}" bash -s -- "${REMOTE_ENV_FILE}" "${DB_SCHEMA}" "${mode}" "${action}" "${tables_csv}" <<'REMOTE_SCRIPT'
set -euo pipefail

ENV_FILE="$1"
DB_SCHEMA="$2"
MODE="$3"
ACTION="$4"
TABLES_CSV="${5:-}"

validate_identifier() {
    local value="$1"
    [[ "${value}" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]
}

if [[ ! -f "${ENV_FILE}" ]]; then
    printf 'Missing env file: %s\n' "${ENV_FILE}" >&2
    exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
    printf 'psql command is required on the remote host.\n' >&2
    exit 1
fi

if ! validate_identifier "${DB_SCHEMA}"; then
    printf 'Invalid schema name: %s\n' "${DB_SCHEMA}" >&2
    exit 1
fi

SELECTED_TABLES=()
if [[ -n "${TABLES_CSV}" ]]; then
    IFS=',' read -r -a SELECTED_TABLES <<< "${TABLES_CSV}"
    for table_name in "${SELECTED_TABLES[@]}"; do
        if ! validate_identifier "${table_name}"; then
            printf 'Invalid table name: %s\n' "${table_name}" >&2
            exit 1
        fi
    done
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

DB_URL="${AAKOREA_DB_URL:-jdbc:postgresql://localhost:5432/aakorea_main}"
DB_USER="${AAKOREA_DB_USERNAME:-aakorea_admin}"
DB_PASSWORD="${AAKOREA_DB_PASSWORD:-}"

if [[ "${DB_URL}" =~ ^jdbc:postgresql://([^/:]+)(:([0-9]+))?/([^?]+)$ ]]; then
    DB_HOST="${BASH_REMATCH[1]}"
    DB_PORT="${BASH_REMATCH[3]:-5432}"
    DB_NAME="${BASH_REMATCH[4]}"
else
    printf 'Unsupported JDBC URL format: %s\n' "${DB_URL}" >&2
    exit 1
fi

export PGPASSWORD="${DB_PASSWORD}"
PSQL_CMD=(psql -v ON_ERROR_STOP=1 -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}")

mapfile -t EXISTING_TABLES < <("${PSQL_CMD[@]}" -At -c "SELECT tablename FROM pg_tables WHERE schemaname = '${DB_SCHEMA}' ORDER BY tablename;")

print_existing_tables() {
    if (( ${#EXISTING_TABLES[@]} == 0 )); then
        printf '  (none)\n'
        return
    fi

    printf '%s\n' "${EXISTING_TABLES[@]}" | sed 's/^/  - /'
}

if [[ "${MODE}" == "list_raw" ]]; then
    printf '%s\n' "${EXISTING_TABLES[@]}"
    exit 0
fi

if [[ "${ACTION}" == "drop_schema" ]]; then
    if [[ "${MODE}" == "list" ]]; then
        printf 'Database: %s\n' "${DB_NAME}"
        printf 'Action: drop and recreate schema\n'
        printf 'Schema: %s\n' "${DB_SCHEMA}"
        printf 'Objects currently visible as tables in schema:\n'
        print_existing_tables
        exit 0
    fi

    printf 'Dropping and recreating schema %s in database %s...\n' "${DB_SCHEMA}" "${DB_NAME}"
    "${PSQL_CMD[@]}" -c "DROP SCHEMA IF EXISTS \"${DB_SCHEMA}\" CASCADE;"
    "${PSQL_CMD[@]}" -c "CREATE SCHEMA \"${DB_SCHEMA}\";"
    printf 'Done.\n'
    exit 0
fi

TARGET_TABLES=()
MISSING_TABLES=()

if [[ "${ACTION}" == "selected_tables" ]]; then
    for requested_table in "${SELECTED_TABLES[@]}"; do
        found=0
        for existing_table in "${EXISTING_TABLES[@]}"; do
            if [[ "${requested_table}" == "${existing_table}" ]]; then
                TARGET_TABLES+=("${requested_table}")
                found=1
                break
            fi
        done

        if [[ ${found} -eq 0 ]]; then
            MISSING_TABLES+=("${requested_table}")
        fi
    done
else
    TARGET_TABLES=("${EXISTING_TABLES[@]}")
fi

if [[ "${MODE}" == "list" ]]; then
    printf 'Database: %s\n' "${DB_NAME}"
    printf 'Schema: %s\n' "${DB_SCHEMA}"
    if [[ "${ACTION}" == "selected_tables" ]]; then
        printf 'Action: drop selected tables\n'
        printf 'Tables selected for drop:\n'
    else
        printf 'Action: drop all tables in schema\n'
        printf 'Tables selected for drop:\n'
    fi

    if (( ${#TARGET_TABLES[@]} == 0 )); then
        printf '  (none)\n'
    else
        printf '%s\n' "${TARGET_TABLES[@]}" | sed 's/^/  - /'
    fi

    if (( ${#MISSING_TABLES[@]} > 0 )); then
        printf 'Requested tables not found:\n'
        printf '%s\n' "${MISSING_TABLES[@]}" | sed 's/^/  - /'
    fi
    exit 0
fi

if (( ${#TARGET_TABLES[@]} == 0 )); then
    if [[ "${ACTION}" == "selected_tables" ]]; then
        printf 'No matching tables found in schema %s.\n' "${DB_SCHEMA}"
    else
        printf 'No tables found in schema %s.\n' "${DB_SCHEMA}"
    fi
    exit 0
fi

if (( ${#MISSING_TABLES[@]} > 0 )); then
    printf 'Requested tables not found and will be skipped:\n'
    printf '%s\n' "${MISSING_TABLES[@]}" | sed 's/^/  - /'
fi

printf 'Dropping tables in schema %s of database %s...\n' "${DB_SCHEMA}" "${DB_NAME}"
{
    for table_name in "${TARGET_TABLES[@]}"; do
        printf 'DROP TABLE IF EXISTS "%s"."%s" CASCADE;\n' "${DB_SCHEMA}" "${table_name}"
    done
} | "${PSQL_CMD[@]}"
printf 'Done.\n'
REMOTE_SCRIPT
}

fetch_remote_tables() {
    run_remote_action "list_raw" "all_tables" "" 0
}

parse_table_selection() {
    local selection="$1"
    shift
    local available_tables=("$@")
    local normalized_selection
    local token
    local index
    local selected_tables=()

    normalized_selection="${selection//,/ }"
    for token in ${normalized_selection}; do
        if [[ ! "${token}" =~ ^[0-9]+$ ]]; then
            printf 'Invalid selection: %s\n' "${token}" >&2
            return 1
        fi

        index=$((token - 1))
        if (( index < 0 || index >= ${#available_tables[@]} )); then
            printf 'Selection out of range: %s\n' "${token}" >&2
            return 1
        fi

        selected_tables+=("${available_tables[${index}]}")
    done

    if (( ${#selected_tables[@]} == 0 )); then
        printf 'No table selected.\n' >&2
        return 1
    fi

    printf '%s\n' "${selected_tables[@]}" | sort -u
}

run_drop_schema_menu() {
    printf '\n'
    run_remote_action "list" "drop_schema"
    printf '\n'

    if ! confirm_prompt "Drop and recreate schema '${DB_SCHEMA}'?"; then
        log "Cancelled."
        return
    fi

    run_remote_action "drop" "drop_schema"
}

run_drop_tables_menu() {
    local selection
    local selected_output
    local tables_csv
    local display_index=1
    local table_name
    local selected_tables=()

    mapfile -t available_tables < <(fetch_remote_tables)

    printf '\n'
    if (( ${#available_tables[@]} == 0 )); then
        log "Schema '${DB_SCHEMA}' 에 테이블이 없습니다."
        return
    fi

    printf 'Available tables in schema %s:\n' "${DB_SCHEMA}"
    for table_name in "${available_tables[@]}"; do
        printf '  %2d. %s\n' "${display_index}" "${table_name}"
        display_index=$((display_index + 1))
    done

    while true; do
        printf '\n'
        read -r -p "Enter table numbers to drop (comma/space separated, a=all, x=cancel): " selection
        case "${selection}" in
            x|X)
                log "Cancelled."
                return
                ;;
            a|A)
                selected_tables=("${available_tables[@]}")
                ;;
            *)
                if ! selected_output="$(parse_table_selection "${selection}" "${available_tables[@]}")"; then
                    printf 'Please enter valid table numbers, "a", or "x".\n'
                    continue
                fi
                mapfile -t selected_tables < <(printf '%s\n' "${selected_output}")
                ;;
        esac

        printf '\nSelected tables:\n'
        printf '%s\n' "${selected_tables[@]}" | sed 's/^/  - /'
        printf '\n'

        if ! confirm_prompt "Drop the selected tables from schema '${DB_SCHEMA}'?"; then
            printf 'Selection reset.\n'
            continue
        fi

        tables_csv="$(tables_to_csv "${selected_tables[@]}")"
        run_remote_action "drop" "selected_tables" "${tables_csv}"
        return
    done
}

run_interactive_menu() {
    local choice

    if ! is_tty_session; then
        printf 'Interactive mode requires a TTY session.\n' >&2
        exit 1
    fi

    while true; do
        printf '\n'
        printf 'Remote target: %s\n' "${TERMUX_TARGET}"
        printf 'Schema: %s\n' "${DB_SCHEMA}"
        printf 'Choose an action:\n'
        printf '  1. Drop and recreate schema\n'
        printf '  2. Drop selected tables\n'
        printf '  x. Exit\n'
        read -r -p '> ' choice

        case "${choice}" in
            1)
                run_drop_schema_menu
                pause_for_enter
                ;;
            2)
                run_drop_tables_menu
                pause_for_enter
                ;;
            x|X|q|Q)
                log "Exited without further changes."
                exit 0
                ;;
            *)
                printf 'Please enter 1, 2, or x.\n'
                ;;
        esac
    done
}

while (($# > 0)); do
    case "$1" in
        --interactive)
            INTERACTIVE=1
            ;;
        --list)
            LIST_ONLY=1
            ACTION_FLAGS_SPECIFIED=1
            ;;
        --schema)
            shift
            if (($# == 0)); then
                printf '%s\n\n' '--schema requires a value.' >&2
                usage >&2
                exit 1
            fi
            DB_SCHEMA="$1"
            ;;
        --drop-schema)
            DROP_SCHEMA=1
            ACTION_FLAGS_SPECIFIED=1
            ;;
        --table)
            shift
            if (($# == 0)); then
                printf '%s\n\n' '--table requires a value.' >&2
                usage >&2
                exit 1
            fi
            add_selected_table "$1"
            ACTION_FLAGS_SPECIFIED=1
            ;;
        --tables)
            shift
            if (($# == 0)); then
                printf '%s\n\n' '--tables requires a value.' >&2
                usage >&2
                exit 1
            fi
            IFS=',' read -r -a parsed_tables <<< "$1"
            for table_name in "${parsed_tables[@]}"; do
                add_selected_table "${table_name}"
            done
            ACTION_FLAGS_SPECIFIED=1
            ;;
        --yes)
            CONFIRMED=1
            ACTION_FLAGS_SPECIFIED=1
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

normalize_selected_tables
setup_target_and_ssh

if (( INTERACTIVE == 1 )) || { (( ACTION_FLAGS_SPECIFIED == 0 )) && is_tty_session; }; then
    run_interactive_menu
fi

if [[ ${LIST_ONLY} -eq 0 && ${CONFIRMED} -eq 0 ]]; then
    printf 'This command is destructive. Re-run with --yes to actually perform the deletion.\n\n' >&2
    usage >&2
    exit 1
fi

REMOTE_MODE="drop"
if [[ ${LIST_ONLY} -eq 1 ]]; then
    REMOTE_MODE="list"
fi

REMOTE_ACTION="all_tables"
if [[ ${DROP_SCHEMA} -eq 1 ]]; then
    REMOTE_ACTION="drop_schema"
elif (( ${#SELECTED_TABLES[@]} > 0 )); then
    REMOTE_ACTION="selected_tables"
fi

TABLES_CSV="$(tables_to_csv "${SELECTED_TABLES[@]}")"
run_remote_action "${REMOTE_MODE}" "${REMOTE_ACTION}" "${TABLES_CSV}"
