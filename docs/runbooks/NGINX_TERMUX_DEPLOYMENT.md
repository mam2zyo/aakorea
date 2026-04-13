<!-- docs/runbooks/NGINX_TERMUX_DEPLOYMENT.md -->

# Nginx / Termux Deployment

## 이 문서의 역할

로컬 Ubuntu와 Termux 테스트 서버에서 프론트엔드는 `nginx`가 정적으로 서빙하고,
`/api`만 Spring Boot로 프록시하는 배포 구조를 정리한다.

---

## 이 문서에 포함하지 않는 내용

- 제품 범위와 기능 판단은 `docs/current/` 문서를 따른다
- 로컬 개발용 Vite 실행과 env 설정은 `LOCAL_DEVELOPMENT.md`를 따른다
- Cloudflare Tunnel 생성 절차 자체는 포함하지 않는다

---

## 목표 구조

- `nginx`: `8080`
- Spring Boot API: `8081`
- PostgreSQL: `5432`
- Cloudflare Tunnel: `maumtalk.win`, `www.maumtalk.win` -> `http://localhost:8080`

브라우저는 항상 `nginx`에 접속한다.
정적 파일은 `nginx`가 응답하고, `/api/*` 요청만 Spring Boot로 전달한다.

---

## 관련 파일

- `deploy/nginx/aakorea-local.conf`
- `deploy/nginx/aakorea-termux.conf`
- `deploy/env/local-dev.env.example`
- `deploy/env/nginx.env.example`
- `deploy/scripts/deploy-to-termux.sh`
- `deploy/scripts/restart-backend.sh`
- `backend/aakorea-main/src/main/resources/application-nginx.yml`

현재 `application-nginx.yml` 기준으로 API는 `8081`에서 실행된다.

---

## Ubuntu에서 `nginx` 정적 서빙 적용

### 1. 프론트 빌드

```bash
cd /home/mam2z/apps/aakorea-main/frontend/aakorea-main
npm run build
```

`nginx`는 `dist/` 결과물을 직접 서빙한다.

### 2. `nginx` 설정 연결

샘플 설정:

- `/home/mam2z/apps/aakorea-main/deploy/nginx/aakorea-local.conf`

Ubuntu 예시:

```bash
sudo cp /home/mam2z/apps/aakorea-main/deploy/nginx/aakorea-local.conf /etc/nginx/sites-available/aakorea-local.conf
sudo ln -sf /etc/nginx/sites-available/aakorea-local.conf /etc/nginx/sites-enabled/aakorea-local.conf
sudo nginx -t
sudo systemctl reload nginx
```

`8080`을 다른 프로세스가 쓰고 있다면 `listen` 포트와 연관 문서를 함께 바꾼다.

### 3. 백엔드 env 파일 준비

```bash
cp /home/mam2z/apps/aakorea-main/deploy/env/nginx.env.example ~/aakorea-nginx.env
nano ~/aakorea-nginx.env
```

최소한 아래 값은 실제 값으로 바꾼다.

- `AAKOREA_DB_URL`
- `AAKOREA_DB_USERNAME`
- `AAKOREA_DB_PASSWORD`
- `AAKOREA_ADMIN_USERNAME`
- `AAKOREA_ADMIN_PASSWORD`

`AAKOREA_SERVER_PORT`는 기본값이 이미 `8081`이라,
같은 포트를 유지할 때는 예시 값을 그대로 써도 된다.

### 4. 백엔드 실행

```bash
cd /home/mam2z/apps/aakorea-main/backend/aakorea-main
set -a
source ~/aakorea-nginx.env
set +a
SPRING_PROFILES_ACTIVE=nginx ./gradlew bootRun
```

### 5. 확인

- 브라우저: `http://localhost:8080`
- API 직접 확인: `http://localhost:8080/api/public/notices`

정상이라면 브라우저는 `8080`만 바라보고, 백엔드 `8081`은 직접 노출하지 않는다.

---

## Termux 배포

이 절은 로컬 Ubuntu 또는 WSL에서 아래 산출물이 준비되어 있다고 가정한다.

- 프론트 정적 파일: `/home/mam2z/apps/aakorea-main/frontend/aakorea-main/dist/`
- 백엔드 실행 파일: `/home/mam2z/apps/aakorea-main/backend/aakorea-main/build/libs/aakorea-main-0.0.1-SNAPSHOT.jar`

현재 배포 스크립트는 기본적으로 아래 앱 디렉터리를 사용한다.

```text
/data/data/com.termux/files/home/apps/aakorea-main
```

직접 휴대폰 IP로 접속하면 기본 SSH 포트는 `22`가 아니라 `8022`다.

### 1. 로컬 배포 스크립트 사용

가장 간단한 방법은 `deploy-to-termux.sh`를 쓰는 것이다.
이 스크립트는 기본적으로 프론트 `build`와 백엔드 `bootJar`까지 수행한 뒤 파일을 업로드한다.

```bash
TERMUX_TARGET=<termux-user>@<termux-host> TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh
```

자주 쓰는 옵션:

- `--skip-build`
- `--frontend-only`
- `--backend-only`
- `--no-restart`

`~/aakorea-nginx.env`가 아직 없다면 업로드만 수행하고 자동 재시작은 건너뛴다.

### 2. 수동 업로드

스크립트를 쓰지 않을 때는 아래 파일을 직접 올린다.

```bash
rsync -av --delete -e "ssh -p 8022" /home/mam2z/apps/aakorea-main/frontend/aakorea-main/dist/ <termux-user>@<termux-host>:~/apps/aakorea-main/frontend/aakorea-main/dist/

scp -P 8022 /home/mam2z/apps/aakorea-main/backend/aakorea-main/build/libs/aakorea-main-0.0.1-SNAPSHOT.jar <termux-user>@<termux-host>:~/apps/aakorea-main/backend/aakorea-main/aakorea-main.jar

scp -P 8022 /home/mam2z/apps/aakorea-main/deploy/nginx/aakorea-termux.conf <termux-user>@<termux-host>:~/apps/aakorea-main/deploy/nginx/aakorea-termux.conf

scp -P 8022 /home/mam2z/apps/aakorea-main/deploy/env/nginx.env.example <termux-user>@<termux-host>:~/apps/aakorea-main/deploy/env/nginx.env.example

scp -P 8022 /home/mam2z/apps/aakorea-main/deploy/scripts/restart-backend.sh <termux-user>@<termux-host>:~/apps/aakorea-main/deploy/scripts/restart-backend.sh
```

`rsync`를 쓰기 어렵다면 `scp -r`로 `dist/` 전체를 복사해도 된다.

### 3. Termux env 파일 작성

```bash
cp ~/apps/aakorea-main/deploy/env/nginx.env.example ~/aakorea-nginx.env
nano ~/aakorea-nginx.env
```

최소한 아래 값을 실제 값으로 바꾼다.

- `AAKOREA_DB_URL`
- `AAKOREA_DB_USERNAME`
- `AAKOREA_DB_PASSWORD`
- `AAKOREA_ADMIN_USERNAME`
- `AAKOREA_ADMIN_PASSWORD`

### 4. Termux `nginx` 설정 반영

Termux `PREFIX` 예시는 아래와 같다.

```text
/data/data/com.termux/files/usr
```

메인 설정 파일 경로:

```text
$PREFIX/etc/nginx/nginx.conf
```

가장 단순한 방법은 `aakorea-termux.conf`의 `server {}` 내용을
`nginx.conf`의 `http {}` 블록 안에 넣는 것이다.

```bash
echo $PREFIX
cp $PREFIX/etc/nginx/nginx.conf $PREFIX/etc/nginx/nginx.conf.bak
cat ~/apps/aakorea-main/deploy/nginx/aakorea-termux.conf
nano $PREFIX/etc/nginx/nginx.conf
nginx -t
nginx -s reload || nginx
```

### 5. 백엔드 시작 또는 재시작

재시작 스크립트 업로드 후:

```bash
chmod +x ~/apps/aakorea-main/deploy/scripts/restart-backend.sh
ENV_FILE=~/aakorea-nginx.env ~/apps/aakorea-main/deploy/scripts/restart-backend.sh restart
```

수동 실행 예시:

```bash
cd ~/apps/aakorea-main/backend/aakorea-main
set -a
source ~/aakorea-nginx.env
set +a
SPRING_PROFILES_ACTIVE=nginx nohup java -jar ./aakorea-main.jar > ./application.log 2>&1 &
```

### 6. 점검

```bash
nginx -t
curl http://127.0.0.1:8080
curl http://127.0.0.1:8080/api/public/notices
~/apps/aakorea-main/deploy/scripts/restart-backend.sh status
tail -n 50 ~/apps/aakorea-main/backend/aakorea-main/application.log
```

Cloudflare Tunnel이 이미 `http://localhost:8080`을 바라보고 있다면,
Termux에서 `nginx`가 `8080`에 정상 기동하는지만 확인하면 된다.
