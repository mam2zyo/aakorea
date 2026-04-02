<!-- docs/current/FRONTEND_STRUCTURE.md -->

# FRONTEND_STRUCTURE

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 프론트엔드 구조와 실제 API 연결 상태를 설명하고,  
앞으로 어떤 부분을 더 정리할지의 기준을 정의한다.

이 문서가 답하는 질문:

- 현재 프론트엔드는 어떤 상태인가?
- 현재 구조에서 어떤 정리 포인트가 남아 있는가?
- 프론트엔드의 어떤 흐름이 이미 백엔드와 연결되어 있는가?

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

- `District` 목록/생성/수정/삭제
- `Group` 목록 조회 및 생성/수정/삭제
- `Group` 편집 화면에서 `GroupContact`, `Meeting` 동시 관리
- `ContentPage` 목록/상세/생성/수정/삭제
- `Notice` 목록/상세/생성/수정/삭제
- 운영 셸용 `운영 현황`, `계정 설정` 라우트 확보

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
- `/admin/overview`
- `/admin/account`
- `/admin/districts`
- `/admin/groups`
- `/admin/groups/:id`
- `/admin/content-pages`
- `/admin/notices`

`/admin/overview`, `/admin/account`는 현재 사이드바 구조와 이동 규칙을 먼저 고정하기 위해 추가된 경로다.  
현재 페이지 본문은 placeholder 상태이며, 실제 운영 데이터 화면은 아직 연결하지 않았다.

### 향후 운영 메뉴 확장 예정

현재 구현에는 아직 포함하지 않지만, 운영 정보 구조를 다시 흔들지 않도록  
향후 아래 두 메뉴가 상위 운영 메뉴에 추가될 가능성을 전제로 둔다.

- 온라인 모임 관리
- 제12단계 운동 관리

이 둘은 현재 MVP의 필수 범위는 아니지만,  
운영 메뉴와 레이아웃을 설계할 때 **나중에 자연스럽게 한 칸씩 추가할 수 있는 정보구조**를 유지해야 한다.

### 운영 관리자 레이아웃 방향

현재 운영 화면은 설명형 카드와 개별 작업공간 비중이 큰 편이지만,  
향후 운영 빈도가 높아질수록 **목록 중심 콘솔형 레이아웃**으로 옮기는 편이 더 적합하다.

핵심 방향은 아래와 같다.

- 로그인 직후 기본 정렬이 적용된 관리 목록이 바로 보이게 한다
- 운영자는 긴 소개문보다 정렬된 목록과 빠른 편집 진입을 먼저 보게 한다
- `Group` 관리 화면은 목록 중심의 인덱스를 운영 메인 진입점으로 유지한다
- 기본 컬럼은 최소화하고, 연락처/회원수/등록일/상태 같은 보조 컬럼은 초기 목록에서 제외한다
- 넓은 화면에서는 목록과 편집 영역이 함께 보이는 master-detail 구성을 우선 검토한다
- 좁은 화면에서는 테이블을 억지로 축소하지 않고 목록 → 상세 진입 흐름으로 전환한다

### 운영 목록의 기본 정렬과 페이징 판단

운영 목록은 로그인 시점부터 사전 정렬된 상태로 보이는 것이 중요하다.

- 기본 정렬은 프론트 임시 정렬보다 서버 기준 정렬을 우선한다
- 운영자는 새로 고침이나 재로그인 후에도 같은 순서를 기대할 수 있어야 한다
- 데이터가 아직 많지 않다면 첫 단계에서는 페이징 없이도 시작할 수 있다
- 다만 운영 데이터가 커질 가능성을 고려해 API와 화면 구조는 이후 페이징, 검색, 정렬 옵션을 붙이기 쉬운 형태로 유지한다

### 좁은 화면 대응 원칙

좁은 화면에서는 데스크톱용 다열 테이블을 그대로 줄이는 방식보다  
모바일 전용 흐름으로 재배치하는 편이 더 자연스럽다.

- 목록 화면에서는 `Group 이름`, `District`, 기본 장소명 정도만 짧게 노출한다
- 정렬/필터 조작은 상단 툴바 또는 별도 시트로 분리한다
- 편집은 같은 화면 내부 분할보다 별도 상세 화면 또는 전체 폭 편집 화면으로 연다
- 즉, 데스크톱은 master-detail, 좁은 화면은 drill-down 흐름을 기본 원칙으로 둔다

### 현재 파일 기준 구조

- `src/App.jsx`
  스타일 import와 세션/플래시 상태 조립을 담당하고 `AppScreen`에 전달한다

- `src/app/AppScreen.jsx`
  현재 라우트와 세션 상태를 받아 공개/운영 레이아웃, 로그인 가드, 화면 렌더링을 조립한다

- `src/app/router.js`
  브라우저 히스토리 구독, `navigate`, route helper re-export를 담당한다

- `src/app/routeDefinitions.js`
  path parsing, query 반영, admin redirect 규칙, 기본 관리자 경로를 담당한다

- `src/app/providers/`
  `useAdminSession`, `useFlashState`로 운영 세션과 플래시 메시지 상태를 분리한다

- `src/layouts/`
  공개 셸과 운영 셸 레이아웃, 관리자 사이드바 메뉴를 분리한다

- `src/features/`
  `groups`, `content`, `districts`, `auth`, `home` 기준으로 feature 단위 API / hook / component / style을 둔다

- `src/pages/public/`, `src/pages/admin/`
  실제 라우트에서 사용하는 page entrypoint를 두고, 일부 화면은 feature 컴포넌트를 재-export한다

- `src/components/ui.jsx`
  페이지 섹션, 필드, 리스트, 상태 배지 등 공통 UI를 제공한다

- `src/shared/lib/request.js`
  공통 `request`, `ApiError` 유틸을 담당한다

- `src/features/*/api/*.js`
  인증, 운영 조직, 운영 모임, 운영 콘텐츠, 공개 콘텐츠 API 호출을 도메인별로 분리한다

- `src/lib/api.js`
  기존 import 호환을 위한 얇은 compatibility export로만 유지한다

- `src/lib/formErrors.js`
  API field error를 화면 폼 상태와 연결하는 헬퍼를 담당한다

- `src/lib/options.js`
  `province`, `dayOfWeek`, `meetingType` 선택값을 프론트 기준으로 관리한다

- `src/lib/view.js`
  선택값 보정과 표시용 헬퍼를 관리한다

- `src/index.css`, `src/App.css`
  공통 토큰/base와 shared/feature 스타일 import를 나눠서 관리한다

- `src/shared/styles/`
  디자인 토큰, base reset, shell/forms/responsive 스타일을 관리한다

- `src/features/*/styles.css`
  home, groups/public, groups/admin 등 feature 스타일을 관리한다

- 현재 전용 프론트 테스트 디렉터리는 없다
  현재 프론트 회귀 검증은 수동 확인과 백엔드/API 테스트에 크게 의존한다

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
- `/admin/overview`, `/admin/account`는 라우트와 메뉴만 연결된 placeholder 상태다
- 현재 전용 프론트 테스트 파일이 없어, 실제 렌더링까지 보는 회귀 테스트는 아직 없다

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
- 운영 관리자 레이아웃은 점차 설명형 카드보다 정렬된 목록 중심 콘솔 구조로 옮긴다
- 공통 UI, 공통 네트워크, 공통 스타일은 `shared`로 분리한다

### 현재 적용된 목표 구조

```text
src/
  app/
    providers/
    AppScreen.jsx
    routeDefinitions.js
    router.js
  layouts/
  pages/
    public/
    admin/
  features/
    auth/
      api/
    districts/
      api/
        admin/
    groups/
      api/
        admin/
        public/
      admin/
        hooks/
        components/
      public/
    content/
      api/
        admin/
        public/
    home/
  shared/
    lib/
    styles/
  components/
  lib/
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
    admin/
      index.js
    public/
      index.js
  admin/
    components/
      GroupBasicsCard.jsx
      GroupContactsCard.jsx
      GroupMeetingsCard.jsx
    hooks/
      useGroupWorkspace.js
    styles.css
  public/
    MeetingSearchPage.jsx
    styles.css
```

현재 공개 `MeetingSearchPage`는 목록과 상세 패널을 같은 화면에서 함께 관리한다.  
상세 패널은 순수 `MeetingDetail`이 아니라, 선택한 모임 일정과 그 모임이 속한 `Group`의 연락/안내 정보를 함께 보여주는 패널 역할을 맡는다.

### 바꾸지 않는 것

- 운영 메인 진입점을 `Group` 중심으로 유지하는 판단
- 콘텐츠(`ContentPage`, `Notice`)를 `Group` 도메인과 별도 feature로 두는 판단
- 공개 검색 시작점을 `Province` 기준 `Meeting` 목록으로 유지하는 판단

---

## 현재 남은 정리 포인트

현재 구조 조정은 전면 재작성이 아니라 아래 순서의 점진 정리가 적합하다.

1. `pages/`에 남아 있는 thin wrapper와 직접 구현 화면의 경계를 더 분명히 정리한다
2. `/admin/overview`, `/admin/account`를 실제 운영 화면으로 채우거나, placeholder라면 메뉴 노출 수준을 다시 판단한다
3. 공개 `Notice`, `ContentPage`, `MeetingSearch` 화면의 공통 패턴을 hook / 하위 컴포넌트 단위로 더 분리한다
4. 전용 프론트 테스트 환경을 추가해 라우팅, 인증 가드, 주요 렌더링 흐름 회귀를 자동화한다
5. import migration이 끝나는 시점에 `src/lib/api.js` compatibility export를 더 축소하거나 제거한다

즉, 현재 프론트는 1차 구조 분리는 끝났고,  
다음 단계는 placeholder 정리, wrapper 축소, 렌더링 테스트 보강이다.

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
