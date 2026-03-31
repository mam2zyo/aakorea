# AAKorea Main Frontend

이 디렉터리는 AAKorea Main 웹앱의 React + Vite 프론트엔드 앱이다.

현재 프론트엔드는 아래 흐름을 포함한다.

- 공개 홈 화면
- 공개 `Meeting` 조회와 상세 확인
- 운영 로그인 / 로그아웃 / 세션 확인
- 운영 `District` 관리
- 운영 `Group` 목록 및 생성
- 운영 `Group` 편집 화면에서 `GroupContact`, `Meeting` 동시 관리

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
  세션 상태, 플래시 메시지, 최소 라우팅 분기

- `src/app/router.js`
  브라우저 히스토리 기반 최소 라우터

- `src/layouts/`
  공개 셸과 운영 셸 레이아웃

- `src/pages/public/`
  홈 화면, 모임 찾기 화면

- `src/pages/admin/`
  로그인, District 관리, Group 목록, Group 작업공간

- `src/components/ui.jsx`
  공통 패널, 폼, 리스트 UI

- `src/lib/api.js`
  백엔드 API 호출 래퍼

- `src/lib/options.js`
  `province`, `dayOfWeek`, `meetingType` 선택값

- `src/lib/view.js`
  선택값/표시 보조 헬퍼

- `src/App.css`, `src/index.css`
  앱 스타일과 공통 토큰

---

## 현재 라우트

### 공개

- `/`
- `/meetings`

### 운영

- `/admin/login`
- `/admin/districts`
- `/admin/groups`
- `/admin/groups/:id`

`ContentPage` / `Notice` 화면은 제품상 필요하지만,  
현재는 관련 백엔드 API가 아직 구현되지 않아 프론트에서는 후속 범위로 둔다.
