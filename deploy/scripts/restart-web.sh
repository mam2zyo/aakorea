#!/usr/bin/env bash

# AAKorea Web(SvelteKit) 재시작 스크립트
APP_ROOT="/home/ubuntu/aakorea"
WEB_DIR="${APP_ROOT}/web"
LOG_FILE="${APP_ROOT}/log/web.log"

echo "--- Web Server (SvelteKit) Restarting ---"

# 1. 기존 프로세스 종료
PID=$(pgrep -f "node build/index.js")
if [ -n "$PID" ]; then
    echo "Stopping existing Web server (PID: $PID)..."
    kill $PID
    sleep 2
fi

# 2. 새 프로세스 백그라운드 실행
echo "Starting Web server..."
cd "${WEB_DIR}"
# nohup으로 실행하여 터미널이 끊겨도 유지되도록 함
nohup node build/index.js > "${LOG_FILE}" 2>&1 &

echo "Web server started in background."
echo "Logs: tail -f ${LOG_FILE}"
