<!-- docs/runbooks/NGINX_TERMUX_DEPLOYMENT.md -->

# Nginx / Termux 테스트 서버 배포 가이드

이 문서는 Termux(안드로이드) 환경에서 프론트엔드를 Nginx로 정적 서빙하고, API 요청을 Spring Boot로 프록시하는 테스트 서버 배포 절차를 설명합니다.

---

## 1. 개요 및 목표 구조

로컬 PC에서 빌드된 결과물을 Termux로 전송하여 실제 모바일 기기에서 테스트 서버를 운영하는 것이 목표입니다.

- **Nginx (8080)**: 정적 파일 서빙 및 `/api/*` 프록시
- **Spring Boot API (8081)**: 백엔드 로직 처리
- **Cloudflare Tunnel**: 외부 도메인 연결 (`http://localhost:8080` 바라보기)

---

## 2. 관련 파일 및 디렉토리

- `deploy/nginx/aakorea-termux.conf`: Termux용 Nginx 설정 템플릿
- `deploy/scripts/deploy-to-termux.sh`: 로컬 → Termux 자동 배포 스크립트
- `deploy/scripts/restart-backend.sh`: Termux용 백엔드 재시작 스크립트
- `deploy/env/nginx.env.example`: 환경 변수 설정 템플릿

---

## 3. Termux 배포 절차

이 절차는 로컬 PC(Ubuntu/WSL)에서 빌드가 완료되어 있다는 것을 가정합니다.

### 3.1 파일 전송 (로컬 → Termux)

`deploy-to-termux.sh` 스크립트를 사용하거나 수동으로 파일을 전송합니다.

```bash
# 자동 배포 스크립트 예시
TERMUX_TARGET=user@host TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh
```

**수동 전송 시 필수 파일:**
- 프론트엔드 빌드 결과물 (`dist/`)
- 백엔드 실행 파일 (`aakorea-main.jar`)
- 설정 파일 (`aakorea-termux.conf`, `nginx.env.example`)

---

### 3.2 Termux Nginx 설정 반영

Termux의 Nginx 설정 파일 위치는 보통 `$PREFIX/etc/nginx/nginx.conf`입니다. 매번 서버 블록을 직접 붙여넣는 대신 `include` 지시어를 사용하여 설정을 관리합니다.

```bash
# 기본 설정 백업
cp $PREFIX/etc/nginx/nginx.conf $PREFIX/etc/nginx/nginx.conf.bak

# nginx.conf의 http { ... } 블록 내부에 아래 줄을 추가합니다.
# 주의: 경로는 실제 프로젝트 위치에 맞게 수정하세요.
nano $PREFIX/etc/nginx/nginx.conf
```

**추가할 내용 (nginx.conf 내부):**
```nginx
http {
    ...
    include /data/data/com.termux/files/home/apps/aakorea-main/deploy/nginx/aakorea-termux.conf;
}
```

```bash
# Nginx 설정 검사 및 재시작
nginx -t
nginx -s reload || nginx
```

---

### 3.3 백엔드 실행

재시작 스크립트를 사용하여 백엔드를 안전하게 가동합니다.

```bash
# 환경 변수 설정
cp ~/apps/aakorea-main/deploy/env/nginx.env.example ~/aakorea-nginx.env
nano ~/aakorea-nginx.env # 실제 수치로 수정

# 재시작
chmod +x ~/apps/aakorea-main/deploy/scripts/restart-backend.sh
ENV_FILE=~/aakorea-nginx.env ~/apps/aakorea-main/deploy/scripts/restart-backend.sh restart
```

---

## 4. 점검 및 확인

배포 후 아래 명령어로 상태를 확인합니다.

```bash
# Nginx 상태
nginx -t

# 로컬 접속 테스트
curl http://127.0.0.1:8080

# 백엔드 로그 확인
tail -n 50 ~/apps/aakorea-main/backend/aakorea-main/application.log
```

---

## 5. 주의사항
- **경로 차이**: Termux는 `/home/ubuntu` 같은 일반적인 Linux 경로가 아니라 `/data/data/com.termux/files/home` 경로를 사용합니다. 설정 파일 내 `root` 경로를 확인하세요.
- **SSH 포트**: 기본 포트는 `8022`입니다.
- **Cloudflare Tunnel**: 터널이 `8080` 포트를 바라보고 있다면, 외부 도메인 접속 시 Nginx가 먼저 요청을 받게 됩니다.
