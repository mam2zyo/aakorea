<!-- docs/runbooks/LOCAL_DEVELOPMENT.md -->

# Local Development

## 이 문서의 역할

로컬 개발 환경에서 백엔드, 프론트엔드, 데이터베이스를 실행하는 기준과
필요한 환경 변수를 정리한다.

---

## 이 문서에 포함하지 않는 내용

`nginx` 정적 서빙, Termux 배포, 외부 라우팅 절차는
`NGINX_TERMUX_DEPLOYMENT.md`에서 다룬다.

---

## 목표 포트 구조

- Vite dev server: `5173`
- Spring Boot API: `8081`
- PostgreSQL: `5432`

로컬 개발 중 브라우저는 보통 `http://localhost:5173`을 사용하고,
`/api` 요청은 Vite proxy를 통해 `http://localhost:8081`로 전달된다.

---

## 준비물

- Java 21
- Node.js 20 이상
- npm
- PostgreSQL

기본 로컬 DB 예시는 아래와 같다.

- URL: `jdbc:postgresql://localhost:5432/aakorea_main`
- Username: `aakorea_admin`

---

## 백엔드 환경 변수

예시 파일:

- `deploy/env/local-dev.env.example`

권장 위치:

- `~/aakorea-local.env`

현재 예시 파일이 포함하는 값은 아래와 같다.

- `AAKOREA_DB_URL`
- `AAKOREA_DB_USERNAME`
- `AAKOREA_DB_PASSWORD`
- `AAKOREA_ADMIN_USERNAME`
- `AAKOREA_ADMIN_PASSWORD`
- `AAKOREA_KAKAO_REST_API_KEY`

`AAKOREA_KAKAO_REST_API_KEY`는 `Meeting` 저장 시 주소 기반 좌표 계산을 사용할 때 필요하다.

---

## 프론트 환경 변수

대화면 공개 모달에서 카카오 지도를 렌더링하려면 아래 값이 필요하다.

- `VITE_KAKAO_MAP_JAVASCRIPT_KEY`

Vite proxy 대상은 기본적으로 `http://localhost:8081`이다.
다른 백엔드 주소를 테스트할 때만 `VITE_PROXY_TARGET`을 덮어쓴다.

---

## 백엔드 실행

```bash
cp /home/mam2z/apps/aakorea-main/deploy/env/local-dev.env.example ~/aakorea-local.env
nano ~/aakorea-local.env

cd /home/mam2z/apps/aakorea-main/backend/aakorea-main
set -a
source ~/aakorea-local.env
set +a
SPRING_PROFILES_ACTIVE=local ./gradlew bootRun
```

현재 `application-local.yml` 기준으로 백엔드는 `8081`에서 뜬다.

---

## 프론트 실행

```bash
cd /home/mam2z/apps/aakorea-main/frontend/aakorea-main
npm install
npm run dev
```

카카오 지도가 필요하면 아래처럼 실행한다.

```bash
cd /home/mam2z/apps/aakorea-main/frontend/aakorea-main
VITE_KAKAO_MAP_JAVASCRIPT_KEY=your-kakao-javascript-key npm run dev
```

프록시 대상을 바꿔야 할 때만 아래처럼 덮어쓴다.

```bash
cd /home/mam2z/apps/aakorea-main/frontend/aakorea-main
VITE_PROXY_TARGET=http://localhost:8081 npm run dev
```

---

## 확인

- 브라우저에서 `http://localhost:5173`이 열려야 한다
- `http://localhost:8081/api/public/notices`가 응답해야 한다
- 대화면 공개 모임 상세에서 지도까지 보려면 프론트 env key가 필요하다

정적 빌드 결과를 `nginx`로 미리보기 해야 하면
`NGINX_TERMUX_DEPLOYMENT.md`의 Ubuntu 절차를 따른다.
