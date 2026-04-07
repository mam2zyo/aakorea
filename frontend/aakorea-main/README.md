# AAKorea Main Frontend

이 디렉터리는 AAKorea Main 웹앱의 React + Vite 프론트엔드 앱이다.

현재 프론트엔드는 아래 흐름을 포함한다.

- 공개 홈 화면
- 공개 `ContentPage` 조회
- 공개 `Notice` 목록/상세 조회
- 공개 `Meeting` 조회, 현재 위치 기준 nearby search, 상세 확인
- 운영 로그인 / 로그아웃 / 세션 확인
- 운영 `District` 관리
- 운영 `Group` 목록 및 생성
- 운영 `Group` 편집 화면에서 `GroupContact`, `Meeting` 동시 관리
- 운영 `ContentPage`, `Notice` 관리
- 운영 셸의 `테스트 도구`, `계정 설정`, `공개 사이트 테마` 라우트 제공

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

대화면 카카오 지도를 확인하려면 프론트 env에 아래 값을 넣는다.

```env
VITE_KAKAO_MAP_JAVASCRIPT_KEY=your-kakao-javascript-key
```

`T map 길안내` 링크까지 쓰려면 아래 값도 추가할 수 있다.

```env
VITE_TMAP_APP_KEY=your-tmap-app-key
```

로컬 env와 프록시 기준은
[`../../docs/runbooks/LOCAL_DEVELOPMENT.md`](../../docs/runbooks/LOCAL_DEVELOPMENT.md)를 따른다.

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
- 개발 서버에서는 Vite proxy가 `/api` 요청을 기본적으로 `http://localhost:8081`로 전달
- 필요 시 `VITE_PROXY_TARGET` 환경 변수로 프록시 대상을 바꿀 수 있음
- 세션 인증 API를 사용하므로 요청은 cookie credential을 포함함

백엔드 local profile과 주소 기반 좌표 계산용 env는
[`../../docs/runbooks/LOCAL_DEVELOPMENT.md`](../../docs/runbooks/LOCAL_DEVELOPMENT.md)에서 함께 관리한다.

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

- `src/public/`, `src/admin/`
  surface별 app screen, layout, UI entry, theme token을 나눠 관리

- `src/public/app/publicTheme.js`
  공개 사이트 active theme, `themePreview` 미리보기 query, preset theme registry를 담당

- `src/pages/public/`
  홈, 안내 페이지, 공지, 모임 찾기 화면 entrypoint를 둠

- `src/pages/admin/`
  로그인, District 관리, Group 목록/편집, 콘텐츠 관리, 계정 설정, 공개 사이트 테마 화면을 둠

- `src/pages/admin/AdminOverviewPage.jsx`
  테스트 도구 화면 entrypoint를 두고 정제 JSON import와 좌표 보정 패널을 조합

- `src/features/`
  `auth`, `districts`, `groups`, `content`, `home` 기준으로 API/하위 컴포넌트/스타일을 분리

- `src/shared/lib/request.js`
  공통 `request`, `ApiError` 유틸

- `src/lib/api.js`
  기존 import 호환을 위한 compatibility export

- `src/lib/`
  `formErrors`, `options`, `view` 같은 화면 보조 유틸

- `src/index.css`, `src/public/styles/`, `src/admin/styles/`
  전역 reset/base와 surface별 token/shell/forms/responsive import를 담당

---

## 현재 라우트

### 공개

- `/`
- `/content-pages/:key`
- `/notices`
- `/notices/:id`
- `/meetings`
- `/groups/:id`

### 운영

- `/admin/login`
- `/admin/overview`
- `/admin/account`
- `/admin/public-theme`
- `/admin/districts`
- `/admin/groups`
- `/admin/groups/:id`
- `/admin/content-pages`
- `/admin/notices`

`/admin/overview`는 현재 테스트 도구 화면으로 사용하며,
정제 JSON import와 좌표 일괄 보정 기능을 함께 제공한다.
