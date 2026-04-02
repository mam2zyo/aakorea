# AAKorea Main Frontend

이 디렉터리는 AAKorea Main 웹앱의 React + Vite 프론트엔드 앱이다.

현재 프론트엔드는 아래 흐름을 포함한다.

- 공개 홈 화면
- 공개 `ContentPage` 조회
- 공개 `Notice` 목록/상세 조회
- 공개 `Meeting` 조회와 상세 확인
- 운영 로그인 / 로그아웃 / 세션 확인
- 운영 `District` 관리
- 운영 `Group` 목록 및 생성
- 운영 `Group` 편집 화면에서 `GroupContact`, `Meeting` 동시 관리
- 운영 `ContentPage`, `Notice` 관리
- 운영 셸의 `운영 현황`, `계정 설정` 라우트 확보

---

## 실행

의존성 설치:

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

빌드:

```bash
npm run build
```

린트:

```bash
npm run lint
```

---

## 백엔드 연결 방식

- 기본 API 경로는 `/api`
- 개발 서버에서는 Vite proxy가 `/api` 요청을 `http://localhost:8080`으로 전달
- 필요 시 `VITE_PROXY_TARGET` 환경 변수로 프록시 대상을 바꿀 수 있음
- 세션 인증 API를 사용하므로 요청은 cookie credential을 포함함

---

## 현재 구조

- `src/App.jsx`
  스타일 import와 세션/플래시 상태 조립을 담당하고 `AppScreen`에 전달

- `src/app/AppScreen.jsx`
  현재 라우트와 세션 상태를 받아 공개/운영 레이아웃, 로그인 가드, 화면 렌더링을 조립

- `src/app/routeDefinitions.js`
  경로 파싱, query 기반 상태, 관리자 기본 경로와 redirect 보정을 담당

- `src/app/router.js`
  브라우저 히스토리 기반 최소 라우터와 `navigate`를 제공

- `src/app/providers/`
  `useAdminSession`, `useFlashState`로 인증/플래시 상태를 분리

- `src/layouts/`
  공개 셸과 운영 셸 레이아웃, 관리자 사이드바 메뉴를 담당

- `src/pages/public/`
  홈, 안내 페이지, 공지, 모임 찾기 화면 entrypoint를 둠

- `src/pages/admin/`
  로그인, District 관리, Group 목록, Group 작업공간, 콘텐츠 관리 화면을 둠

- `src/features/`
  `auth`, `districts`, `groups`, `content`, `home` 기준으로 API/하위 컴포넌트/스타일을 분리

- `src/components/ui.jsx`
  공통 패널, 폼, 리스트 UI

- `src/shared/lib/request.js`
  공통 `request`, `ApiError` 유틸

- `src/lib/api.js`
  기존 import 호환을 위한 compatibility export

- `src/lib/`
  `formErrors`, `options`, `view` 같은 화면 보조 유틸

- `src/index.css`, `src/App.css`
  공통 토큰/base와 shared/feature 스타일 import를 나눔

---

## 현재 라우트

### 공개

- `/`
- `/content-pages/:key`
- `/notices`
- `/notices/:id`
- `/meetings`

### 운영

- `/admin/login`
- `/admin/overview`
- `/admin/account`
- `/admin/districts`
- `/admin/groups`
- `/admin/groups/:id`
- `/admin/content-pages`
- `/admin/notices`

`/admin/overview`, `/admin/account`는 관리자 사이드바 구조를 먼저 고정하기 위해 라우트와 메뉴는 연결되어 있지만,
현재 페이지 본문은 placeholder 상태다.
