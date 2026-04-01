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
- `deploy/scripts/deploy-to-termux.sh`
- `deploy/scripts/restart-backend.sh`
- `backend/aakorea-main/src/main/resources/application-nginx.yml`

백엔드는 `SecurityConfig` 안에 직접 CORS 목록을 쓰는 대신 `AppCorsProperties`와 `app.cors.allowed-origins` 설정을 통해 origin 목록을 읽도록 정리했다.  
다만 `AppCorsProperties`에는 아직 기본 origin 목록이 남아 있으므로, 프로필별 설정으로 덮어쓴다는 관점으로 이해하면 된다.  
`nginx` 앞단 배포에서는 브라우저 기준으로 same-origin 구성이 되므로 CORS 의존도를 줄일 수 있다.

## 로컬 Ubuntu 적용 순서

### 1. 프론트 빌드

```bash
# 프론트엔드 작업 디렉터리로 이동
cd /home/mam2z/apps/aakorea-main/frontend/aakorea-main
# 정적 배포용 dist/ 산출물 생성
npm run build
```

`nginx`는 `dist/` 결과물을 직접 서빙한다.

### 2. `nginx` 설정 연결

기본 샘플 파일:

- `/home/mam2z/apps/aakorea-main/deploy/nginx/aakorea-local.conf`

Ubuntu 예시:

```bash
# 저장소의 nginx 샘플 설정을 시스템 nginx 설정 디렉터리로 복사
sudo cp /home/mam2z/apps/aakorea-main/deploy/nginx/aakorea-local.conf /etc/nginx/sites-available/aakorea-local.conf
# sites-enabled에 심볼릭 링크를 걸어 실제 활성화
sudo ln -sf /etc/nginx/sites-available/aakorea-local.conf /etc/nginx/sites-enabled/aakorea-local.conf
# nginx 설정 문법 검사
sudo nginx -t
# 오류가 없으면 nginx 설정 다시 불러오기
sudo systemctl reload nginx
```

이미 `8080`을 다른 프로세스가 쓰고 있다면 `listen` 포트를 바꾸고, 같은 포트를 문서 전체에서 함께 바꾼다.

### 3. 백엔드 실행

먼저 예시 env 파일을 복사해 값을 채운다.

```bash
# 예시 env 파일을 내 홈 디렉터리로 복사
cp /home/mam2z/apps/aakorea-main/deploy/env/nginx.env.example ~/aakorea-nginx.env
# 비밀번호와 계정 값을 실제 값으로 수정
nano ~/aakorea-nginx.env
```

최소한 아래 값은 실제 값으로 바꾼다.

- `AAKOREA_DB_PASSWORD`
- `AAKOREA_ADMIN_PASSWORD`
- 필요 시 `AAKOREA_ADMIN_USERNAME`

초기 스키마를 처음 만들 때만 `AAKOREA_JPA_DDL_AUTO=update` 로 한 번 실행하고, 이후에는 `validate` 로 다시 돌리는 쪽이 안전하다.

실행은 아래처럼 환경변수를 현재 셸에 로드한 뒤 진행한다.

```bash
# 백엔드 프로젝트 디렉터리로 이동
cd /home/mam2z/apps/aakorea-main/backend/aakorea-main
# env 파일의 값을 현재 셸 환경변수로 export
set -a
source ~/aakorea-nginx.env
set +a
# nginx 배포용 스프링 프로필로 실행
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
# 로컬 개발용 env 예시 파일 복사
cp /home/mam2z/apps/aakorea-main/deploy/env/local-dev.env.example ~/aakorea-local.env
# 로컬 DB/관리자 계정 값 수정
nano ~/aakorea-local.env

# 백엔드 실행
cd /home/mam2z/apps/aakorea-main/backend/aakorea-main
set -a
source ~/aakorea-local.env
set +a
SPRING_PROFILES_ACTIVE=local ./gradlew bootRun

# 프론트 개발 서버 실행
cd /home/mam2z/apps/aakorea-main/frontend/aakorea-main
VITE_PROXY_TARGET=http://localhost:8081 npm run dev
```

이 경우 `5173`에서 핫리로드를 쓰면서도 `/api` 요청은 Spring Boot로 바로 전달된다.  
`nginx` 쪽 결과를 보고 싶을 때만 `8080`을 열어 확인하면 된다.

## Termux 적용 순서

이 절은 로컬 Ubuntu/WSL에서 아래 두 빌드가 이미 끝났다고 가정한다.

- 프론트 정적 파일: `/home/mam2z/apps/aakorea-main/frontend/aakorea-main/dist/`
- 백엔드 실행 파일: `/home/mam2z/apps/aakorea-main/backend/aakorea-main/build/libs/aakorea-main-0.0.1-SNAPSHOT.jar`

현재 Termux에서 확인한 `PREFIX`는 아래와 같다.

```text
/data/data/com.termux/files/usr
```

이 문서와 배포 스크립트는 아래 경로를 기본 앱 디렉터리로 사용한다.

```text
/data/data/com.termux/files/home/apps/aakorea-main
```

이 문서에서는 `<termux-user>@<termux-host>`를 실제 접속 정보로 바꿔서 사용한다고 가정한다.  
같은 Wi-Fi의 휴대폰 IP를 써도 되고, 이미 구성한 SSH 접속 별칭을 써도 된다.

### 초기 1회성 설정

#### 1. Termux에 배포 디렉터리 준비

```bash
# 앱 산출물을 둘 기본 디렉터리 생성
mkdir -p ~/apps/aakorea-main/frontend/aakorea-main
mkdir -p ~/apps/aakorea-main/backend/aakorea-main
mkdir -p ~/apps/aakorea-main/deploy/nginx
mkdir -p ~/apps/aakorea-main/deploy/env
mkdir -p ~/apps/aakorea-main/deploy/scripts
```

#### 2. 로컬에서 첫 배포 파일 전송

첫 배포 때는 프론트 `dist`, 백엔드 `jar`, Termux용 `nginx` 설정, env 예시 파일, 재시작 스크립트까지 함께 올려 두는 편이 편하다.

가장 간단한 방법은 로컬 배포 스크립트를 쓰는 것이다.

```bash
# Termux 기본 SSH 포트 8022를 사용해 로컬에서 빌드 후 파일 업로드
TERMUX_TARGET=<termux-user>@<termux-host> TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh
```

처음 배포라서 `~/aakorea-nginx.env`가 아직 없다면, 이 스크립트는 파일 업로드까지만 하고 백엔드 자동 재시작은 건너뛴다.
직접 휴대폰 IP로 붙는다면 `22`가 아니라 `8022` 포트를 써야 한다.

직접 파일을 보내고 싶다면 아래 명령을 사용한다.

```bash
# 프론트 dist 디렉터리를 Termux로 동기화
rsync -av --delete -e "ssh -p 8022" /home/mam2z/apps/aakorea-main/frontend/aakorea-main/dist/ <termux-user>@<termux-host>:~/apps/aakorea-main/frontend/aakorea-main/dist/

# 백엔드 실행 jar를 고정된 파일명으로 업로드
scp -P 8022 /home/mam2z/apps/aakorea-main/backend/aakorea-main/build/libs/aakorea-main-0.0.1-SNAPSHOT.jar <termux-user>@<termux-host>:~/apps/aakorea-main/backend/aakorea-main/aakorea-main.jar

# Termux용 nginx server 블록 템플릿 업로드
scp -P 8022 /home/mam2z/apps/aakorea-main/deploy/nginx/aakorea-termux.conf <termux-user>@<termux-host>:~/apps/aakorea-main/deploy/nginx/aakorea-termux.conf

# 배포용 env 예시 파일 업로드
scp -P 8022 /home/mam2z/apps/aakorea-main/deploy/env/nginx.env.example <termux-user>@<termux-host>:~/apps/aakorea-main/deploy/env/nginx.env.example

# 백엔드 재시작 스크립트 업로드
scp -P 8022 /home/mam2z/apps/aakorea-main/deploy/scripts/restart-backend.sh <termux-user>@<termux-host>:~/apps/aakorea-main/deploy/scripts/restart-backend.sh
```

`rsync`를 쓰기 어렵다면 `scp -r`로 `dist/` 전체를 복사해도 된다.

#### 3. 배포용 환경변수 파일 작성

```bash
# env 예시 파일을 실제 실행용 파일로 복사
cp ~/apps/aakorea-main/deploy/env/nginx.env.example ~/aakorea-nginx.env

# DB 비밀번호와 관리자 비밀번호를 실제 값으로 수정
nano ~/aakorea-nginx.env
```

최소한 아래 값은 실제 값으로 바꾼다.

- `AAKOREA_DB_PASSWORD`
- `AAKOREA_ADMIN_PASSWORD`
- 필요 시 `AAKOREA_ADMIN_USERNAME`

DB 스키마를 아직 한 번도 만들지 않았다면 첫 실행에만 `AAKOREA_JPA_DDL_AUTO=update` 로 두고, 테이블 생성이 끝나면 다시 `validate` 로 바꾸는 편이 안전하다.

#### 4. Termux `nginx` 설정 반영

샘플 파일:

- `~/apps/aakorea-main/deploy/nginx/aakorea-termux.conf`

`PREFIX=/data/data/com.termux/files/usr` 기준으로 Termux의 `nginx` 메인 설정 파일은 아래 경로다.

```text
$PREFIX/etc/nginx/nginx.conf
```

가장 단순한 방법은 위 파일의 `http {}` 블록 안에 `aakorea-termux.conf`의 `server {}` 내용을 그대로 넣는 것이다.

```bash
# 현재 Termux Prefix 확인
echo $PREFIX

# nginx 메인 설정 파일 백업
cp $PREFIX/etc/nginx/nginx.conf $PREFIX/etc/nginx/nginx.conf.bak

# Termux용 server 블록 내용 확인
cat ~/apps/aakorea-main/deploy/nginx/aakorea-termux.conf

# nginx 메인 설정 파일 수정
nano $PREFIX/etc/nginx/nginx.conf

# 수정 후 nginx 설정 문법 검사
nginx -t

# 문법에 문제가 없으면 설정 다시 불러오기
nginx -s reload || nginx
```

수정할 때는 `http { ... }` 블록 안에 아래 파일의 `server { ... }` 내용을 추가하면 된다.

- `~/apps/aakorea-main/deploy/nginx/aakorea-termux.conf`

만약 현재 `nginx.conf`에 `include` 지시문이 이미 있다면, 그 구조에 맞춰 별도 conf 파일로 두어도 된다.

#### 5. 백엔드 첫 실행

로컬에서 빌드한 `jar`를 그대로 실행하므로, Termux에서는 `gradlew bootRun` 대신 `java -jar` 방식을 쓴다.  
재시작 스크립트를 업로드해 두었다면 아래처럼 실행하면 된다.

```bash
# 업로드된 재시작 스크립트에 실행 권한 부여
chmod +x ~/apps/aakorea-main/deploy/scripts/restart-backend.sh

# env 파일을 읽어 백엔드 시작 또는 재시작
ENV_FILE=~/aakorea-nginx.env ~/apps/aakorea-main/deploy/scripts/restart-backend.sh restart
```

스크립트 없이 수동으로 실행하려면 아래 명령을 사용한다.

```bash
# Java 실행 버전 확인
java -version

# 백엔드 배포 디렉터리로 이동
cd ~/apps/aakorea-main/backend/aakorea-main

# env 파일의 값을 현재 셸 환경변수로 export
set -a
source ~/aakorea-nginx.env
set +a

# nginx 배포용 스프링 프로필로 백엔드 실행
SPRING_PROFILES_ACTIVE=nginx nohup java -jar ./aakorea-main.jar > ./application.log 2>&1 &
```

#### 6. 첫 배포 점검

```bash
# nginx 설정이 정상인지 다시 확인
nginx -t

# 로컬에서 프론트 정적 파일 응답 확인
curl http://127.0.0.1:8080

# /api 프록시가 Spring Boot로 잘 전달되는지 확인
curl http://127.0.0.1:8080/api/public/notices

# 백엔드 상태 확인
~/apps/aakorea-main/deploy/scripts/restart-backend.sh status

# 백엔드 로그 확인
tail -n 50 ~/apps/aakorea-main/backend/aakorea-main/application.log
```

현재 Cloudflare Tunnel은 이미 `maumtalk.win` / `www.maumtalk.win`을 `http://localhost:8080`으로 보내고 있으므로, Termux에서 `nginx`가 `8080`에 정상 기동하면 외부 라우팅은 그대로 유지할 수 있다.

### 이후 배포 때마다 반복되는 순서

#### 1. 로컬에서 새 빌드 생성

```bash
# 프론트 정적 파일 다시 빌드
cd /home/mam2z/apps/aakorea-main/frontend/aakorea-main
npm run build

# 백엔드 실행 jar 다시 빌드
cd /home/mam2z/apps/aakorea-main/backend/aakorea-main
./gradlew bootJar
```

#### 2. 새 산출물만 Termux로 전송

가장 간단한 방법은 로컬 배포 스크립트를 쓰는 것이다.

```bash
# 프론트와 백엔드를 다시 빌드하고 Termux로 전송
TERMUX_TARGET=<termux-user>@<termux-host> TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh

# 기존 빌드 결과를 그대로 쓰고 다시 전송만 수행
TERMUX_TARGET=<termux-user>@<termux-host> TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh --skip-build

# 프론트만 다시 배포
TERMUX_TARGET=<termux-user>@<termux-host> TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh --frontend-only

# 백엔드만 다시 배포하고 폰에서 자동 재시작
TERMUX_TARGET=<termux-user>@<termux-host> TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh --backend-only
```

스크립트 없이 직접 파일을 보내려면 아래 명령을 사용한다.

```bash
# 프론트 dist만 다시 동기화
rsync -av --delete -e "ssh -p 8022" /home/mam2z/apps/aakorea-main/frontend/aakorea-main/dist/ <termux-user>@<termux-host>:~/apps/aakorea-main/frontend/aakorea-main/dist/

# 새 백엔드 jar만 다시 업로드
scp -P 8022 /home/mam2z/apps/aakorea-main/backend/aakorea-main/build/libs/aakorea-main-0.0.1-SNAPSHOT.jar <termux-user>@<termux-host>:~/apps/aakorea-main/backend/aakorea-main/aakorea-main.jar
```

프론트만 바뀌었다면 `dist/`만 다시 보내면 되고, 백엔드만 바뀌었다면 `jar`만 다시 보내도 된다.

#### 3. Termux에서 새 `jar`로 백엔드 재시작

스크립트를 업로드해 두었다면 아래 한 줄로 충분하다.

```bash
# env 파일을 읽어 백엔드 재시작
ENV_FILE=~/aakorea-nginx.env ~/apps/aakorea-main/deploy/scripts/restart-backend.sh restart
```

스크립트 없이 수동으로 재시작하려면 아래 명령을 사용한다.

```bash
# 현재 실행 중인 백엔드 프로세스 확인
ps -ef | grep aakorea-main.jar | grep -v grep

# 기존 백엔드 프로세스 종료
pkill -f 'aakorea-main.jar'

# 백엔드 배포 디렉터리로 이동
cd ~/apps/aakorea-main/backend/aakorea-main

# env 파일의 값을 현재 셸 환경변수로 export
set -a
source ~/aakorea-nginx.env
set +a

# 새 jar로 백엔드 다시 실행
SPRING_PROFILES_ACTIVE=nginx nohup java -jar ./aakorea-main.jar > ./application.log 2>&1 &
```

#### 4. 필요할 때만 `nginx` 설정 다시 반영

프론트 정적 파일만 바뀌었다면 `nginx` 재시작은 필요 없다.  
다만 `aakorea-termux.conf`를 바꿨다면 아래처럼 문법 검사 후 다시 불러온다.

```bash
# nginx 설정 문법 검사
nginx -t

# 설정 다시 불러오기
nginx -s reload
```

#### 5. 배포 후 점검

```bash
# 프론트 정적 파일 응답 확인
curl http://127.0.0.1:8080

# /api 프록시 확인
curl http://127.0.0.1:8080/api/public/notices

# 현재 백엔드 상태 확인
~/apps/aakorea-main/deploy/scripts/restart-backend.sh status

# 최근 백엔드 로그 확인
tail -n 50 ~/apps/aakorea-main/backend/aakorea-main/application.log
```

## 같이 기억할 점

- 프론트는 이미 `/api` 상대 경로를 사용하므로 Nginx 구조로 바꿔도 프론트 코드 수정은 거의 필요 없다.
- 관리자 계정과 DB 비밀번호는 설정 파일 기본값 대신 환경변수로 넘기는 쪽이 안전하다.
- 현재 저장소 기준 검증은 `npm run lint`, `npm run build`, `./gradlew test` 까지 통과했다.
