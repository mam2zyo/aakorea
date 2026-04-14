#!/usr/bin/env bash
set -euo pipefail

TERMUX_TARGET="${TERMUX_TARGET:-}"
TERMUX_SSH_PORT="${TERMUX_SSH_PORT:-}"
REMOTE_ENV_FILE="${REMOTE_ENV_FILE:-/data/data/com.termux/files/home/aakorea/config/aakorea-termux.env}"
DB_SCHEMA="${DB_SCHEMA:-public}"
LIST_ONLY=0
CONFIRMED=0

SSH_CMD=(ssh)

usage() {
    cat <<'EOF'
Usage:
  ./deploy/scripts/drop-all-tables-over-ssh.sh <termux-user>@<termux-host> [options]

Required:
  TERMUX_TARGET or the first positional argument must be set.

Options:
  --list          Show which tables would be dropped, but do not delete anything
  --schema NAME   Target schema to clear. Defaults to public
  --yes           Actually drop all tables in the target schema
  --help          Show this help

Environment variables:
  TERMUX_TARGET    SSH target for the phone server
  TERMUX_SSH_PORT  SSH port for direct Termux access, e.g. 8022
  REMOTE_ENV_FILE  Remote env file containing DB credentials
  DB_SCHEMA        Target schema name. Defaults to public

Examples:
  TERMUX_TARGET=u0_a312@172.30.1.16 TERMUX_SSH_PORT=8022 ./deploy/scripts/drop-all-tables-over-ssh.sh --list
  TERMUX_TARGET=u0_a312@172.30.1.16 TERMUX_SSH_PORT=8022 ./deploy/scripts/drop-all-tables-over-ssh.sh --yes
EOF
}

log() {
    printf '[drop-all-tables-over-ssh] %s\n' "$*"
}

while (($# > 0)); do
    case "$1" in
        --list)
            LIST_ONLY=1
            ;;
        --schema)
            shift
            if (($# == 0)); then
                printf '--schema requires a value.\n\n' >&2
                usage >&2
                exit 1
            fi
            DB_SCHEMA="$1"
            ;;
        --yes)
            CONFIRMED=1
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

if [[ ! "${DB_SCHEMA}" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
    printf 'Invalid schema name: %s\n' "${DB_SCHEMA}" >&2
    exit 1
fi

if [[ ${LIST_ONLY} -eq 0 && ${CONFIRMED} -eq 0 ]]; then
    printf 'This command is destructive. Re-run with --yes to actually drop tables.\n\n' >&2
    usage >&2
    exit 1
fi

if [[ -n "${TERMUX_SSH_PORT}" ]]; then
    SSH_CMD+=(-p "${TERMUX_SSH_PORT}")
fi

REMOTE_MODE="drop"
if [[ ${LIST_ONLY} -eq 1 ]]; then
    REMOTE_MODE="list"
fi

log "Connecting to ${TERMUX_TARGET}"

"${SSH_CMD[@]}" "${TERMUX_TARGET}" bash -s -- "${REMOTE_ENV_FILE}" "${DB_SCHEMA}" "${REMOTE_MODE}" <<'REMOTE_SCRIPT'
set -euo pipefail

ENV_FILE="$1"
DB_SCHEMA="$2"
MODE="$3"

if [[ ! -f "${ENV_FILE}" ]]; then
    printf 'Missing env file: %s\n' "${ENV_FILE}" >&2
    exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
    printf 'psql command is required on the remote host.\n' >&2
    exit 1
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

list_sql="SELECT tablename FROM pg_tables WHERE schemaname = '${DB_SCHEMA}' ORDER BY tablename;"
drop_sql="SELECT format('DROP TABLE IF EXISTS %I.%I CASCADE;', schemaname, tablename) FROM pg_tables WHERE schemaname = '${DB_SCHEMA}' ORDER BY tablename;"

if [[ "${MODE}" == "list" ]]; then
    printf 'Schema: %s\n' "${DB_SCHEMA}"
    printf 'Database: %s\n' "${DB_NAME}"
    printf 'Tables to drop:\n'
    psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -At -c "${list_sql}"
    exit 0
fi

drop_commands="$(psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -At -c "${drop_sql}")"

if [[ -z "${drop_commands}" ]]; then
    printf 'No tables found in schema %s.\n' "${DB_SCHEMA}"
    exit 0
fi

printf 'Dropping tables in schema %s of database %s...\n' "${DB_SCHEMA}" "${DB_NAME}"
printf '%s\n' "${drop_commands}" | psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}"
printf 'Done.\n'
REMOTE_SCRIPT
