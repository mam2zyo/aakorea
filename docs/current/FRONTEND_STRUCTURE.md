<!-- docs/current/FRONTEND_STRUCTURE.md -->

# FRONTEND_STRUCTURE

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 프론트엔드 구조를 설명하고,  
어떤 부분을 정리한 뒤 백엔드 API와 연결할지의 기준을 정의한다.

이 문서가 답하는 질문:

- 현재 프론트엔드는 어떤 상태인가?
- 어떤 파일과 코드가 실제 MVP와 무관한가?
- 프론트엔드는 어떤 흐름부터 백엔드와 연결하는가?

이 문서에 포함하지 않는 내용:

- 백엔드 API의 상세 요청/응답 계약
- 제품 범위 판단 전체
- 화면별 세부 디자인 시안
- 이후 확장 기능의 우선순위 전체

범위는 `PRODUCT_SCOPE.md`, API 계약은 `api/` 아래 문서를 따른다.

---

## 현재 구현된 최소 화면 구조

현재 프론트엔드는 아래 구조를 최소 기준으로 사용한다.

### 1. 공개 영역

- 공개 홈 화면
- `ContentPage` 공개 조회
- `Notice` 목록/상세 조회
- `Province` 기준 `Meeting` 검색
- 선택 시 `Meeting` 상세 확인
- `GroupContact.phone` 확인 및 전화 연결

### 2. 운영 인증 영역

- 로그인
- 로그아웃
- 현재 세션 확인

### 3. 운영 관리 영역

- `District` 목록/생성/수정
- `Group` 목록 조회 및 생성
- `Group` 편집 화면에서 `GroupContact`, `Meeting` 동시 관리
- `ContentPage` 목록/상세/생성/수정
- `Notice` 목록/상세/생성/수정

즉, 현재 프론트엔드는 운영 화면을 엔티티 개수대로 기계적으로 나누기보다,  
**실제 편집 책임이 모이는 단위인 `Group`을 중심으로 구성**한다.

`Meeting`은 공개 핵심 흐름의 중심 개체이지만,  
운영 편집에서는 `Group` 없이 독립적으로 존재하지 않으므로  
최상위 운영 화면보다 `Group` 작업공간 안에서 함께 다루는 편이 더 자연스럽다.

### 현재 구현된 라우트 구조

현재 프론트엔드는 아래 경로를 실제로 사용한다.

#### 공개 라우트

- `/`
- `/content-pages/:key`
- `/notices`
- `/notices/:id`
- `/meetings`

#### 운영 라우트

- `/admin/login`
- `/admin/districts`
- `/admin/groups`
- `/admin/groups/:id`
- `/admin/content-pages`
- `/admin/notices`

### 현재 파일 기준 구조

- `src/App.jsx`
  세션, 플래시 메시지, 최소 라우팅 분기와 화면 전환을 담당한다

- `src/app/router.js`
  브라우저 히스토리 기반 최소 라우팅과 admin redirect 규칙을 담당한다

- `src/layouts/`
  공개 셸과 운영 셸 레이아웃을 분리한다

- `src/pages/public/`
  공개 홈, 안내 페이지, 공지, 모임 조회 화면을 둔다

- `src/pages/admin/`
  로그인, District 관리, Group 목록, Group 작업공간, 콘텐츠 관리 화면을 둔다

- `src/components/ui.jsx`
  페이지 섹션, 필드, 리스트, 상태 배지 등 공통 UI를 제공한다

- `src/lib/api.js`
  인증, 운영 조직, 운영 모임, 운영 콘텐츠, 공개 콘텐츠 API 호출을 담당한다

- `src/lib/options.js`
  `province`, `dayOfWeek`, `meetingType` 선택값을 프론트 기준으로 관리한다

- `src/lib/view.js`
  선택값 보정과 표시용 헬퍼를 관리한다

- `src/App.css`, `src/index.css`
  MVP 화면 스타일과 공통 토큰을 관리한다

---

## 백엔드 연결 원칙

프론트엔드는 현재 구현된 백엔드 API와 아래 원칙으로 연결한다.

- API 호출 경로는 `/api` 상대 경로를 기본으로 한다
- 로컬 개발에서는 Vite proxy로 백엔드에 전달한다
- 운영 인증은 세션 기반이므로 요청 시 credential을 함께 보낸다
- 미인증 상태에서 `/admin/*` 진입 시 `/admin/login`으로 이동한다
- `GroupContact`, `Meeting`은 `Group` 작업공간 안에서 그룹 단위로 조회/편집한다
- `ContentPage`, `Notice`는 각각 독립 운영 화면에서 목록과 편집을 함께 관리한다
- 공개 공지 화면은 `/notices`를 중심으로 목록과 상세를 함께 연결한다
