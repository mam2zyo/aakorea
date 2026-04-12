<!-- README.md -->

# AAKorea Main 웹앱 프로젝트

> AAKorea Main 웹앱 프로젝트는 기존 `www.aakorea.org`의 파편화된 정보 구조와 직관적이지 않은 인터페이스를 개선하고, 사용자 중심의 웹앱으로 재구축하는 것을 목표로 합니다. 세부적으로는

> 1. 도움을 필요로 하는 알코올중독자가 AA 에 관한 정보를 빠르게 찾을 수 있도록 돕고,
> 2. AA 멤버들에게 모임 생활에 필요한 정보에 효율적으로 접근할 수 있도록 돕고,
> 3. 알코올중독자의 가족이나 이해관계 당사자들에게도 유용한 정보를 제공하며
> 4. GSO 관리자나 봉사자들이 업무를 효율적으로 볼 수 있는 환경을 제공하는 것입니다.

현재 프로젝트는 **초기 구현 단계**이며, 먼저 아래 핵심 사용자 가치를 빠르게 검증하는 방향으로 진행합니다.

- 사용자가 전국(`All`) 또는 지역(`Province`) 기준으로 `Meeting`을 검색하고, 상세 조건(연합, 요일, 유형, 키워드)으로 필터링할 수 있어야 한다
- 현재 위치 기준 100km 이내의 가까운 모임을 실시간으로 찾을 수 있어야 한다
- 모임 조회 후 `GroupContact.phone`으로 바로 전화할 수 있어야 한다

---

## 기술 스택

### Backend

- Java 21
- Spring Boot 3.5
- Spring Data JPA
- Spring Security

### Database

- PostgreSQL

### Frontend

- React
- Vite

프론트엔드 앱은 `frontend/aakorea-main` 아래에 있으며,  
공개 홈/안내 페이지/공지/모임 조회와 운영 `District`/`Group`/콘텐츠 관리, 공개 사이트 테마 관리 화면을 React + Vite로 구성한다.

최근 추가된 주요 흐름:

- 운영 `Meeting` 저장 시 주소만으로 카카오 REST API 지오코딩을 수행할 수 있다
- 공개 모임 검색은 상태 머신 기반의 고성능 클라이언트 캐싱 필터링을 제공한다 (상세 키워드 및 지역연합 필터 포함)
- 공개 모임 상세 모달은 모바일에서는 텍스트 중심, 대화면에서는 카카오 지도를 함께 표시한다
- 관리자 `/admin/overview`는 `테스트 도구` 화면으로 사용하며, HTML normalize 기반 import와 좌표 일괄 보정 도구를 함께 제공한다
- 관리자 `/admin/public-theme`는 공개 사이트 테마를 `classic` / `harbor` / `breeze` preset 기준으로 draft / publish / rollback 한다

---

## 저장소 구성

```text
backend/
  aakorea-main/
frontend/
  aakorea-main/
docs/
```

- `backend/aakorea-main`: Spring Boot 기반 백엔드 애플리케이션
- `frontend/`: 프론트엔드 작업 영역
- `docs/`: 프로젝트 문서

---

## 문서 안내

현재 프로젝트 문서는 `docs/` 아래에서 관리합니다.

문서 허브:

- [docs/README.md](./docs/README.md)
- [docs/runbooks/README.md](./docs/runbooks/README.md)

---

## 빠른 시작

## 1. 백엔드 실행

작업 디렉터리:

```powershell
cd backend\aakorea-main
```

애플리케이션 실행:

```bash
cp /home/mam2z/apps/aakorea-main/deploy/env/local-dev.env.example ~/aakorea-local.env
nano ~/aakorea-local.env

cd /home/mam2z/apps/aakorea-main/backend/aakorea-main
set -a
source ~/aakorea-local.env
set +a
SPRING_PROFILES_ACTIVE=local ./gradlew bootRun
```

백엔드 로컬 실행 시 카카오 주소 지오코딩을 쓰려면 아래 환경 변수가 필요하다.

- `AAKOREA_KAKAO_REST_API_KEY`

자세한 로컬 env 설정과 포트 기준은
[docs/runbooks/LOCAL_DEVELOPMENT.md](./docs/runbooks/LOCAL_DEVELOPMENT.md)를 따른다.

테스트 실행:

```powershell
.\gradlew test
```

---

## 2. 프론트엔드 실행

작업 디렉터리:

```bash
cd frontend/aakorea-main
```

개발 서버 실행:

```bash
npm run dev
```

프론트에서 대화면 카카오 지도를 표시하려면 아래 환경 변수가 필요하다.

- `VITE_KAKAO_MAP_JAVASCRIPT_KEY`

빌드:

```bash
npm run build
```

프론트엔드는 기본적으로 `/api` 상대 경로를 사용하고,  
로컬 개발에서는 Vite proxy가 기본적으로 `http://localhost:8081` 로 `/api` 요청을 전달한다.
현재 저장소의 `local`, `nginx` 프로필은 모두 백엔드를 `8081`에 띄우므로
대부분의 경우 `npm run dev`만으로 바로 동작한다.
프록시 대상을 바꿔야 할 때만 `VITE_PROXY_TARGET=http://localhost:8081 npm run dev` 같은 방식으로 덮어쓴다.

자세한 프론트 env와 로컬 실행 절차는
[docs/runbooks/LOCAL_DEVELOPMENT.md](./docs/runbooks/LOCAL_DEVELOPMENT.md)를 따른다.

---

## 로컬 개발 환경

권장 환경:

- Java 21
- Node.js 20 이상
- npm
- PostgreSQL

상세 DB 설정, env 파일, Vite proxy 기준은
[docs/runbooks/LOCAL_DEVELOPMENT.md](./docs/runbooks/LOCAL_DEVELOPMENT.md)에 정리한다.

---

## 개발 메모

- 프론트엔드는 API 호출을 상대 경로 기반으로 구성합니다
- 로컬 개발 시 프론트엔드는 Vite proxy로 `/api` 요청을 기본적으로 `http://localhost:8081` 백엔드로 전달합니다
- 현재는 최소 필드 기준으로 빠르게 CRUD와 조회 흐름을 검증하는 것이 우선입니다
- 현재 프론트엔드는 공개 홈과 안내 페이지, 공지, 모임 찾기, 운영 로그인, `District` 관리, `Group` 관리, 콘텐츠 관리, 테스트 도구 화면, 공개 사이트 테마 화면을 제공합니다

현재 가장 먼저 검증할 핵심 흐름:

1. 운영자가 `District`를 생성한다
2. 운영자가 `Group`과 `GroupContact.phone`을 생성한다
3. 운영자가 `Meeting`을 생성한다
4. 운영자가 `ContentPage`와 `Notice`를 게시한다
5. 공개 사용자가 안내 페이지와 공지를 확인한다
6. 공개 사용자가 전국 또는 지역 기준으로 모임을 조회하고 상세 조건으로 실시간 필터링한다
7. 공개 사용자가 내 주변 100km 이내 모임을 거리순으로 확인한다
8. 모임 조회 후 전화번호로 바로 연결한다
9. 운영자가 필요하면 테스트 도구에서 좌표 일괄 보정을 수행한다

---

## 운영 참고

- 로컬 실행 / env 설정: [docs/runbooks/LOCAL_DEVELOPMENT.md](./docs/runbooks/LOCAL_DEVELOPMENT.md)
- `nginx` 정적 서빙 / Termux 배포: [docs/runbooks/NGINX_TERMUX_DEPLOYMENT.md](./docs/runbooks/NGINX_TERMUX_DEPLOYMENT.md)
