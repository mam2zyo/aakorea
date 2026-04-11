<!-- docs/current/FRONTEND_STRUCTURE.md -->

# FRONTEND_STRUCTURE

## 이 문서의 역할

이 문서는 AAKorea Main 프론트엔드의 **현재 구현 구조**를 정리한다.

이 문서가 답하는 질문:

- 공개 화면은 어떤 흐름으로 동작하는가?
- 관리자 화면은 어떤 구성으로 나뉘는가?
- theme / route / feature ownership은 어디에 있는가?

---

## 현재 공개 구조

### 핵심 라우트

- `/`
- `/content-pages/:key`
- `/notices`
- `/notices/:id`
- `/meetings`
- `/groups/:id`
- `/__preview/meeting-focus` (dev 전용)

### 모임 찾기 흐름 (상태 머신 기반)

현재 공개 모임 검색은 상태 머신(`useMeetingSearch`)에 의해 명시적으로 관리된다.

#### 검색 상태
- `IDLE`: 초기 상태. 결과 목록이 비어 있고 검색 가이드가 노출된다.
- `LOADING`: 백엔드로부터 데이터를 불러오는 중.
- `REGION_ACTIVE`: 지역 검색 결과가 캐싱된 상태.
- `NEARBY_ACTIVE`: 내 위치 기준 거리 검색 결과가 캐싱된 상태.

#### 동작 방식
1. **데이터 페치**: 사용자가 "지역 검색" 또는 "가까운 모임" 버튼을 클릭할 때만 백엔드 API(`#PUBLIC-MEETINGS`)를 호출한다.
2. **클라이언트 캐싱**: 불러온 대량의 데이터(최대 500건)를 `rawMeetings`에 저장한다.
3. **실시간 필터링**: 이후 상세 조건(요일, 유형, 지역연합, 키워드) 변경 시에는 백엔드 재요청 없이 메모리상의 데이터를 즉시 필터링하여 보여준다.
4. **상태 잠금**: 검색이 완료된 상태(`ACTIVE`)에서는 "검색 초기화"를 하기 전까지 지역 드롭다운 등 메인 파라미터가 비활성화되어 조작 실수를 방지한다.
5. **URL 단순화**: 기존의 복잡한 쿼리 파라미터 기반 검색 대신, 명시적인 사용자 액션과 상태 기반으로 흐름이 변경되었다. URL은 상세 모달 상태(`groupId`, `meetingId`)만 주로 관리한다.

### 디자인 및 인터페이스
- **버튼 피드백**: 검색/초기화 버튼에 그라디언트와 그림자 효과를 적용하고, 로딩 시 스피너 애니메이션을 제공한다.
- **레이아웃**: 섹션 헤더가 비어 있을 경우 자동으로 공간을 제거하여 깔끔한 화면 구성을 유지한다.

### 디자인 시스템 및 CSS 아키텍처

디자인 일관성과 테마 유지보수를 위해 **3계층 디자인 토큰(Design Tokens)** 시스템을 사용한다. 모든 하드코딩된 색상/치수(Literals)는 제거되었으며, 각 레이어는 명확한 역할을 가진다.

1.  **Layer 1: Primitives (기초 팔레트)**
    *   배경이 되는 원색과 단계를 정의한다 (예: `--palette-blue-500`, `--palette-ink-900`).
    *   특정 의미를 담지 않으며, 모든 테마의 재료가 된다.
    *   `:root` 영역에 모든 테마의 Primitives가 합쳐져 관리된다.
2.  **Layer 2: Semantic (의미적 토큰)**
    *   "무엇인가"를 정의한다 (예: `--color-primary`, `--color-bg-subtle`, `--color-text`).
    *   테마에 따라 다른 Primitive를 참조하며, 컴포넌트 개발 시 최우선적으로 참조하는 레이어다.
3.  **Layer 3: Component (컴포넌트 토큰)**
    *   특정 UI 요소의 예외 상황이나 정교한 스타일을 정의한다 (예: `--public-dialog-border`, `--public-focus-list-item-selected-background`).
    *   Semantic 토큰으로 처리가 어려운 복합 스타일(그라데이션 등)을 관리한다.

모든 테마 전환은 `document.documentElement`의 `data-public-theme` 또는 `data-admin-theme` 속성에 따라 해당 변수 셋이 주입되는 방식으로 구현된다.

### 공개 상세 모달 구조

모임 검색 결과를 클릭하면 같은 페이지 위에 모달이 열린다.

현재 모달 정보 구조:

1. 그룹명
2. 지역연합
3. 그룹 공지
4. 같은 그룹의 모임 리스트
5. 선택된 모임의 장소 정보
6. 대화면 지도
7. 연락처 / 전화 걸기 footer

핵심은 **그룹 문맥 안에서, 선택된 모임에 따라 장소와 연락처가 함께 바뀌는 구조**다.

### 공개 상세의 현재 지도 / CTA 규칙

- 모바일에서는 본문 지도 영역을 숨긴다
- 태블릿 / 데스크톱에서는 `latitude`, `longitude`가 있을 때 카카오 지도를 표시한다
- 장소 블록 아래에는 `카카오맵 위치 보기`, `T map 길안내` 링크를 함께 둔다
- 모바일 하단 액션은 `전화하기` CTA를 우선한다
- 현재 위치 nearby search는 `searchMode=nearby`와 좌표 query를 기준으로 유지한다

### 공개 테마 런타임

- active public theme는 `GET /api/public/theme`로 불러온다
- 공개 preset theme id는 `classic`, `harbor`, `breeze`다
- `themePreview` query param으로 게시 전 theme를 미리 볼 수 있다
- 공개 레이아웃의 네비게이션 링크는 preview query를 유지한다

---

## 현재 관리자 구조

### 핵심 라우트

- `/admin/login`
- `/admin/register`
- `/admin/pending`
- `/admin/overview`
- `/admin/account`
- `/admin/admin-users`
- `/admin/public-theme`
- `/admin/districts`
- `/admin/groups`
- `/admin/groups/:id`
- `/admin/content-pages`
- `/admin/notices`

### 관리자 셸

관리자 사이드바 기준 표기는 `그룹 관리`로 통일했다.

향후 확장 슬롯:

- 온라인 모임 관리
- 제12단계 운동 관리

둘 다 현재는 placeholder다.

현재 운영 보조 화면은 아래처럼 나뉜다.

- `/admin/admin-users`
  운영자 계정 승인 및 역할/권한 관리

- `/admin/account`
  브라우저 로컬 admin theme preference 관리 및 내 계정 정보

- `/admin/public-theme`
  공개 사이트 theme의 draft / publish / rollback

- `/admin/overview`
  HTML normalize + 정제 JSON import와 모임 좌표 일괄 보정 도구

---

## 관리자 그룹 화면

그룹 관리는 **목록 중심 + 대형 모달** 구조로 정리되어 있다.

현재 Group 관련 프론트 ownership:

- route wrapper: `pages/admin/GroupListPage.jsx`
- 실제 feature page: `features/groups/admin/GroupManagementPage.jsx`
- 생성 / 편집 UI: `features/groups/admin/components/*`

### 목록 화면

메인 진입점은 `/admin/groups`다.

현재 목록 컬럼 순서:

1. 번호
2. 그룹
3. 지역연합
4. 관리

각 행 액션:

- `수정`
- `삭제`

그룹 삭제는 목록에서 수행하며, 삭제 시 연결된 연락처와 모임도 함께 제거된다.

### 그룹 생성

그룹 생성은 2단계 큰 모달이다.

#### 1단계

- 그룹 이름
- 지역연합
- 그룹 공지
- 연락처
- 이메일
- 우편수신 정보

#### 2단계

- 요일
- 시작 시간
- 모임 유형
- 주소
- 상세 위치

새 모임 생성 기본값은 `active=true`이며,
생성 단계에서는 상태 토글을 노출하지 않는다.

### 그룹 수정

그룹 수정은 **읽기 중심 시트 + 섹션별 서브 모달** 구조다.

섹션:

- 기본 정보
- 연락처
- 모임 정보

각 섹션은 메인 시트 안에서는 요약만 보여 주고,
실제 입력은 별도 서브 모달에서 처리한다.

모임 수정 서브 모달 필드 순서:

1. 요일 / 시작 시간 / 모임 유형
2. 주소
3. 상세 위치
4. 모임 상태 토글

상태 표기는 `공개 중 / 비공개`다.

---

## 현재 소스 구조 판단

현재 프론트는 예전의 “단일 App + 전역 스타일”보다 아래 방향에 가깝다.

- 공개: 목록 + 같은 페이지 모달 + 공개 테마 preview 유지
- 관리자: 목록 + 읽기 중심 편집 시트 + 서브 모달 + 별도 보조 관리 화면

현재 ownership은 아래처럼 나뉜다.

- `AppScreen`
  공통 route / session / navigation bridge

- `public/app/*`, `admin/app/*`
  surface별 app screen과 document theme sync

- `pages/*`
  route 진입점

- `features/*`
  실제 화면 로직, API client, 하위 컴포넌트

- `shared/lib/request.js`, `src/lib/api.js`
  공통 request와 compatibility export

---

## 현재 남아 있는 프론트 메모

- 공개 사이트 theme는 아직 code-backed preset만 지원하며 원격 theme editor는 없다
- `admin/account`의 theme preference는 현재 localStorage만 사용하고 서버 저장은 없다
- `GET /api/public/meetings/{id}` 단건 상세 API는 남아 있지만, 메인 공개 UI는 `/meetings` / `/groups/:id`의 그룹 상세 흐름을 우선 사용한다
