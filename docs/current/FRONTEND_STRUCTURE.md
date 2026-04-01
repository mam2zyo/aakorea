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

또한 최근 구조 검토에서는 공개 영역도 같은 기준을 더 분명히 따를 필요가 있다는 판단을 유지한다.

- 공개 사용자는 여전히 `Meeting` 목록을 기준으로 모임을 찾는다
- 그러나 상세에서 실제로 확인하는 정보는 `Group`의 연락처, 공지, 안내, 기본 위치 정보와 더 가깝다
- 따라서 프론트 구조도 `Meeting`을 완전히 독립 feature로 분리하기보다  
  `Group` 도메인 아래의 공개 검색/상세 흐름으로 재배치하는 편이 더 자연스럽다

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
  App 셸 조립과 스타일 import만 담당한다

- `src/app/AppScreen.jsx`
  라우트 kind에 따라 공개/운영 레이아웃과 feature page를 조립한다

- `src/app/router.js`
  브라우저 히스토리 구독과 `navigate`만 담당한다

- `src/app/routeDefinitions.js`
  route configuration, path parsing, admin redirect 규칙을 담당한다

- `src/app/viewState.js`
  route와 세션 상태를 받아 public/admin screen 결정을 담당한다

- `src/app/providers/`
  운영 세션과 플래시 메시지 상태를 분리한다

- `src/layouts/`
  공개 셸과 운영 셸 레이아웃을 분리한다

- `src/features/`
  `groups`, `content`, `districts`, `auth` 기준으로 feature entrypoint와 하위 hook / component / api를 둔다

- `src/pages/public/`, `src/pages/admin/`
  기존 경로 호환과 점진 이동을 위한 page wrapper 또는 잔여 화면을 둔다

- `src/components/ui.jsx`
  페이지 섹션, 필드, 리스트, 상태 배지 등 공통 UI를 제공한다

- `src/shared/lib/request.js`
  공통 `request`, `ApiError`, `queryString` 유틸을 담당한다

- `src/features/*/api/*.js`
  인증, 운영 조직, 운영 모임, 운영 콘텐츠, 공개 콘텐츠 API 호출을 도메인별로 분리한다

- `src/lib/api.js`
  기존 import 호환을 위한 얇은 compatibility export로만 유지한다

- `src/lib/options.js`
  `province`, `dayOfWeek`, `meetingType` 선택값을 프론트 기준으로 관리한다

- `src/lib/view.js`
  선택값 보정과 표시용 헬퍼를 관리한다

- `src/shared/styles/`
  디자인 토큰, base reset, shell/forms/responsive 스타일을 관리한다

- `src/features/*/styles.css`
  home, groups/public, groups/admin 등 feature 스타일을 관리한다

- `test/`
  라우팅, admin guard, 공개 fallback 상태 같은 순수 프론트 회귀 테스트를 둔다

---

## 현재 구조에 대한 판단

현재 구조는 **MVP를 빠르게 구현하는 데는 적합했지만**,  
프로젝트를 계속 확장하기에는 이미 몇 가지 병목이 드러난 상태다.

### 현재 구조의 장점

- 공개 영역과 운영 영역이 분리되어 있다
- `Group` 작업공간 안에서 `GroupContact`, `Meeting`을 함께 관리하는 흐름이 도메인과 맞는다
- 파일 수가 적어 초기 진입 장벽이 낮다

### 현재 구조의 한계

- 일부 admin/public page는 아직 `pages/` 래퍼를 통해 유지되고 있어 완전한 feature 이동이 끝난 상태는 아니다
- `src/lib/api.js`는 호환 레이어로 축소됐지만 아직 완전히 제거되지는 않았다
- 현재 프론트 테스트는 순수 로직 회귀 중심이어서, 실제 렌더링까지 보는 컴포넌트 테스트는 아직 없다

즉, 현재 구조는 “동작하는 MVP”로는 충분하지만,  
이후 `Group` 공개 상세, GSR 편집 진입, 그룹 단위 공지/소개/변경 이력 등의 기능이 늘어나면  
**호환 wrapper 정리와 렌더링 테스트 보강이 뒤따르지 않으면 구조가 다시 중앙집중화될 가능성**이 있다.

---

## 계속 진행하기 위한 구조 조정 방향

프론트엔드는 백엔드와 동일한 계층 구조를 그대로 복제하기보다,  
**도메인 경계는 맞추되 화면 책임에 맞게 feature 단위로 재구성**하는 편이 좋다.

### 핵심 원칙

- `Meeting`은 독립 feature라기보다 `Group` 도메인에 속한 공개 탐색 단위로 본다
- 공개 검색은 `Meeting` 목록으로 시작하되, 공개 상세 정보의 중심은 `Group`으로 옮길 수 있게 준비한다
- 운영 화면은 계속 `Group` 작업공간 중심을 유지한다
- 공통 UI, 공통 네트워크, 공통 스타일은 `shared`로 분리한다

### 현재 적용된 목표 구조

```text
src/
  app/
    layouts/
    providers/
  pages/
    public/
    admin/
  features/
    auth/
    districts/
      admin/
    groups/
      admin/
      public/
      api/
      hooks/
      components/
    content/
      admin/
      public/
      api/
      hooks/
      components/
  shared/
    lib/
    styles/
```

### `Group` 도메인 기준 프론트 배치 원칙

`groups` feature 안에 아래 책임을 같이 두는 구성이 가장 자연스럽다.

- 운영 `Group` 목록
- 운영 `Group` 작업공간
- 공개 `Meeting` 검색
- 공개 `Group`/`Meeting` 접근 상세
- `GroupContact` 관련 API와 표시 로직

예를 들어 아래와 같은 구조가 적절하다.

```text
features/groups/
  api/
    admin.js
    public.js
  admin/
    GroupListPage.jsx
    GroupEditorPage.jsx
    hooks/
      useGroupWorkspace.js
    components/
      GroupForm.jsx
      GroupContactPanel.jsx
      MeetingSchedulePanel.jsx
  public/
    MeetingSearchPage.jsx
    hooks/
      usePublicMeetingSearch.js
    components/
      MeetingSearchForm.jsx
      MeetingResultList.jsx
      MeetingAccessPanel.jsx
```

여기서 `MeetingAccessPanel`은 순수 `MeetingDetail`이 아니라,  
선택한 모임 일정과 그 모임이 속한 `Group`의 연락/안내 정보를 함께 보여주는 패널을 뜻한다.

### 바꾸지 않는 것

- 운영 메인 진입점을 `Group` 중심으로 유지하는 판단
- 콘텐츠(`ContentPage`, `Notice`)를 `Group` 도메인과 별도 feature로 두는 판단
- 공개 검색 시작점을 `Province` 기준 `Meeting` 목록으로 유지하는 판단

---

## 권장 리팩터링 순서

구조 조정은 전면 재작성이 아니라 아래 순서의 점진 리팩터링이 적합하다.

1. `src/App.jsx`의 세션/플래시/레이아웃 선택 책임을 분리한다
2. `src/app/router.js`의 수동 라우팅을 라우터 구성 단위로 정리한다
3. `src/lib/api.js`를 `groups`, `content`, `auth` 기준으로 분리한다
4. `GroupEditorPage`와 공개 `MeetingSearchPage`를 hook + 하위 컴포넌트로 분리한다
5. `src/App.css` 중심 전역 스타일을 `shared/styles`와 feature 스타일로 나눈다

현재 구현에서 이미 1, 2, 3, 4, 5 단계는 반영되었다.  
다음 집중 항목은 `pages/` wrapper 축소와 렌더링 기반 프론트 테스트 확장이다.

실제 작업 단위와 우선순위는 `FRONTEND_REFACTOR_BACKLOG.md`를 따른다.

---

## 백엔드 연결 원칙

프론트엔드는 현재 구현된 백엔드 API와 아래 원칙으로 연결한다.

- API 호출 경로는 `/api` 상대 경로를 기본으로 한다
- 로컬 개발에서는 Vite proxy로 백엔드에 전달한다
- 운영 인증은 세션 기반이므로 요청 시 credential을 함께 보낸다
- 미인증 상태에서 `/admin/*` 진입 시 `/admin/login`으로 이동한다
- `GroupContact`, `Meeting`은 `Group` 작업공간 안에서 그룹 단위로 조회/편집한다
- 공개 `Meeting` 검색 역시 장기적으로는 `Group` 도메인 feature 아래에서 관리하는 편이 자연스럽다
- `ContentPage`, `Notice`는 각각 독립 운영 화면에서 목록과 편집을 함께 관리한다
- 공개 공지 화면은 `/notices`를 중심으로 목록과 상세를 함께 연결한다
