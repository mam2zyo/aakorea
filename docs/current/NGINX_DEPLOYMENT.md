# Nginx 배포 정리

이 문서의 역할:
로컬 Ubuntu와 Termux 테스트 서버에서 프론트엔드는 `nginx`가 정적으로 서빙하고, `/api`만 Spring Boot로 프록시하는 실행 구조를 정리한다.

이 문서에 포함하지 않는 내용:
도메인 정책 전반, Cloudflare Tunnel 생성 절차, 앱 기능 범위 판단은 포함하지 않는다.

## 목표 구조

구성은 아래처럼 맞춘다.

- `nginx`: `8080`
- Spring Boot API: `8081`
- PostgreSQL: `5432`
- Cloudflare Tunnel: `maumtalk.win` / `www.maumtalk.win` -> `http://localhost:8080`

브라우저는 항상 `nginx`에만 접속한다.  
프론트 정적 파일은 `nginx`가 응답하고, `/api/*` 요청만 Spring Boot로 전달한다.

## 저장소에 추가한 파일

- `deploy/nginx/aakorea-local.conf`
- `deploy/nginx/aakorea-termux.conf`
- `deploy/env/local-dev.env.example`
- `deploy/env/nginx.env.example`
- `backend/aakorea-main/src/main/resources/application-nginx.yml`

백엔드는 기존 하드코딩 CORS 목록 대신 `app.cors.allowed-origins` 설정을 읽도록 바꿨다.  
`nginx` 앞단 배포에서는 브라우저 기준으로 same-origin 구성이 되므로 CORS 의존도를 줄일 수 있다.

## 로컬 Ubuntu 적용 순서

### 1. 프론트 빌드

```bash
cd /home/mam2z/apps/aakorea-main/frontend/aakorea-main
npm run build
```

`nginx`는 `dist/` 결과물을 직접 서빙한다.

### 2. `nginx` 설정 연결

기본 샘플 파일:

- `/home/mam2z/apps/aakorea-main/deploy/nginx/aakorea-local.conf`

Ubuntu 예시:

```bash
sudo cp /home/mam2z/apps/aakorea-main/deploy/nginx/aakorea-local.conf /etc/nginx/sites-available/aakorea-local.conf
sudo ln -sf /etc/nginx/sites-available/aakorea-local.conf /etc/nginx/sites-enabled/aakorea-local.conf
sudo nginx -t
sudo systemctl reload nginx
```

이미 `8080`을 다른 프로세스가 쓰고 있다면 `listen` 포트를 바꾸고, 같은 포트를 문서 전체에서 함께 바꾼다.

### 3. 백엔드 실행

먼저 예시 env 파일을 복사해 값을 채운다.

```bash
cp /home/mam2z/apps/aakorea-main/deploy/env/nginx.env.example ~/aakorea-nginx.env
nano ~/aakorea-nginx.env
```

최소한 아래 값은 실제 값으로 바꾼다.

- `AAKOREA_DB_PASSWORD`
- `AAKOREA_ADMIN_PASSWORD`
- 필요 시 `AAKOREA_ADMIN_USERNAME`

초기 스키마를 처음 만들 때만 `AAKOREA_JPA_DDL_AUTO=update` 로 한 번 실행하고, 이후에는 `validate` 로 다시 돌리는 쪽이 안전하다.

실행은 아래처럼 환경변수를 현재 셸에 로드한 뒤 진행한다.

```bash
cd /home/mam2z/apps/aakorea-main/backend/aakorea-main
set -a
source ~/aakorea-nginx.env
set +a
SPRING_PROFILES_ACTIVE=nginx \
./gradlew bootRun
```

`application-nginx.yml`이 활성화되면 API는 `8081`에서 뜬다.

### 4. 확인

- 브라우저: `http://localhost:8080`
- API 직접 확인: `http://localhost:8080/api/public/...`

정상이라면 브라우저는 항상 `8080`만 바라보고, 백엔드 `8081`은 직접 노출하지 않는다.

### 5. 로컬 개발 중 `vite dev` 같이 쓰기

가능하다. `nginx`를 내리지 않아도 된다.

- `nginx` 미리보기: `http://localhost:8080`
- `vite dev` 개발 서버: `http://localhost:5173`
- Spring Boot API: `http://localhost:8081`

개발 중에는 아래처럼 `vite` 프록시만 백엔드 `8081`로 맞춰 두면 된다.

```bash
cp /home/mam2z/apps/aakorea-main/deploy/env/local-dev.env.example ~/aakorea-local.env
nano ~/aakorea-local.env

cd /home/mam2z/apps/aakorea-main/backend/aakorea-main
set -a
source ~/aakorea-local.env
set +a
SPRING_PROFILES_ACTIVE=local ./gradlew bootRun

cd /home/mam2z/apps/aakorea-main/frontend/aakorea-main
VITE_PROXY_TARGET=http://localhost:8081 npm run dev
```

이 경우 `5173`에서 핫리로드를 쓰면서도 `/api` 요청은 Spring Boot로 바로 전달된다.  
`nginx` 쪽 결과를 보고 싶을 때만 `8080`을 열어 확인하면 된다.

## Termux 적용 순서

### 1. 프론트 빌드 결과 준비

폰에서 직접 빌드하거나, 로컬에서 빌드한 `dist/`를 서버 경로로 복사한다.

기준 경로는 아래처럼 가정했다.

```text
/data/data/com.termux/files/home/apps/aakorea-main
```

저장소 위치가 다르면 `deploy/nginx/aakorea-termux.conf`의 `root` 경로를 같이 수정한다.

### 2. `nginx` 설정 반영

샘플 파일:

- `/home/mam2z/apps/aakorea-main/deploy/nginx/aakorea-termux.conf`

Termux에서는 설치된 `nginx`의 실제 메인 설정 파일 안 `http {}` 블록에 위 `server {}` 내용을 넣거나, 현재 설치 방식이 include를 지원하면 별도 conf로 포함시킨다.

### 3. 백엔드 실행

```bash
cp ~/apps/aakorea-main/deploy/env/nginx.env.example ~/aakorea-nginx.env
nano ~/aakorea-nginx.env

cd ~/apps/aakorea-main/backend/aakorea-main
set -a
source ~/aakorea-nginx.env
set +a
SPRING_PROFILES_ACTIVE=nginx \
./gradlew bootRun
```

### 4. Cloudflare Tunnel 확인

현재 구성은 이미 `maumtalk.win` / `www.maumtalk.win`을 `http://localhost:8080`으로 보내고 있으므로, `nginx`가 `8080`에서 뜨면 앞단 라우팅은 그대로 유지할 수 있다.

## 같이 기억할 점

- 프론트는 이미 `/api` 상대 경로를 사용하므로 Nginx 구조로 바꿔도 프론트 코드 수정은 거의 필요 없다.
- 관리자 계정과 DB 비밀번호는 설정 파일 기본값 대신 환경변수로 넘기는 쪽이 안전하다.
- 현재 저장소 기준 검증은 `npm run lint`, `npm run build`, `./gradlew test` 까지 통과했다.
