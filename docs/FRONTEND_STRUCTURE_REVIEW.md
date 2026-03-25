# 프론트엔드 구조 분석 및 도메인 확장 제안

작성일: 2026-03-25

## 1. 문서 목적

이 문서는 현재 프론트엔드 구조가 앞으로의 확장 범위에 적합한지 평가하고, 필요하다면 어떤 방향으로 구조를 바꾸는 것이 좋은지 제안하기 위해 작성했다.

- 분석 기준은 현재 구현된 공개 화면(`basic`)과 관리자 화면 일부(`service`)다.
- 여기서 `store`는 상태관리 store가 아니라 도메인 이름(`store`)을 의미한다.
- 아직 프론트엔드에는 `store`, `heart` 화면이 구현되어 있지 않으므로, 현재 코드와 기존 문서의 도메인 계획을 함께 보고 판단했다.

## 2. 현재 구조 요약

현재 프론트엔드의 핵심 구조는 아래와 같다.

```text
frontend/aakorea/src/
  api/
  components/
    admin/
    common/
    group/
    layout/
    meeting/
  data/
  pages/
    admin/
  utils/
  App.jsx
  main.jsx
```

현재 구조의 특징은 다음과 같다.

- 라우트가 `App.jsx` 한 곳에 모여 있다.
- 최상위 `AppLayout`이 현재 URL을 보고 public/admin 레이아웃을 분기한다.
- 관리자 화면은 `pages/admin`, `components/admin`에 분리되어 있다.
- 공개 콘텐츠는 `data/publicContent.js` 기반으로 비교적 일관된 패턴으로 구성되어 있다.
- 데이터 조회와 변경 로직은 각 페이지의 `useEffect`, `useState`, 이벤트 핸들러 안에 직접 들어가 있다.
- API 호출 함수는 `src/api/*.js`에 평면적으로 놓여 있다.

## 3. 판단

### 결론

현재 구조는 지금 범위에서는 동작 가능한 MVP 구조이지만, 계획된 `service`, `store`, `heart` 확장까지 고려하면 장기 구조로는 적합하지 않다.

조금 더 정확히 말하면 아래와 같다.

- 현재 범위만 놓고 보면: 충분히 유지 가능하다.
- 앞으로 여러 도메인이 각기 다른 화면 구조와 사용자 흐름을 가져가면: 구조적 부담이 빠르게 커진다.
- 특히 `store`, `heart`를 현재 패턴에 그대로 얹기 시작하면 폴더 탐색성, 레이아웃 분리, 상태 관리, 역할 분리가 동시에 무너질 가능성이 높다.

## 4. 왜 현재 구조가 장기적으로 불리한가

### 4.1. 구조의 기준이 도메인보다 기술 분류에 가깝다

지금은 `pages`, `components`, `api`, `utils`처럼 기술 성격별로 코드가 나뉘어 있다. 규모가 작을 때는 단순하지만, 기능이 커질수록 한 기능을 수정하기 위해 여러 폴더를 계속 오가야 한다.

예를 들어 앞으로 `store`에서 상품 목록, 장바구니, 주문, 관리자 주문 처리까지 생기면 다음 문제가 생긴다.

- 화면은 `pages`
- UI 조각은 `components`
- 통신은 `api`
- 포맷은 `utils`
- 임시 데이터나 상수는 `data`

이렇게 흩어지면 기능 단위로 코드를 이해하기 어렵고, 수정 범위 파악도 늦어진다.

### 4.2. 레이아웃 분기 기준이 URL 문자열에 묶여 있다

현재는 `AppLayout`이 `location.pathname.startsWith("/admin")`로 public/admin 레이아웃을 나눈다.

이 방식은 `public`과 `admin` 두 종류만 있을 때는 버틸 수 있지만, 앞으로는 최소한 아래와 같은 레이아웃 축이 생길 가능성이 크다.

- 공개 정보용 화면
- `service` 운영 화면
- `store` 사용자 구매 화면
- `store` 운영 화면
- `heart` 사용자 구독 화면
- `heart` 운영 화면
- 로그인/내정보 화면

이 상태에서 계속 pathname 분기를 늘리면 최상위 레이아웃이 모든 도메인을 다 알아야 하게 된다. 그러면 레이아웃이 공용 껍데기가 아니라 도메인 결정을 담당하는 허브가 되어 버린다.

### 4.3. 프론트엔드 용어가 도메인 문서와 어긋난다

기존 문서는 `basic`, `service`, `member`, `store`, `heart`를 기준으로 설계되어 있는데, 프론트엔드는 현재 `admin`이라는 이름으로 운영 화면을 묶고 있다.

이 차이는 사소해 보이지만 확장 단계에서는 꽤 크게 작동한다.

- 백엔드와 프론트엔드가 같은 도메인을 다른 이름으로 부르게 된다.
- `service`가 관리자 전용인지, 봉사자 전용인지, 운영 전반인지 코드에서 바로 드러나지 않는다.
- 향후 `store` 운영 화면을 `admin` 아래에 둘지, `service` 아래에 둘지 판단 기준이 흐려진다.

장기적으로는 프론트엔드도 도메인 문서와 같은 언어를 쓰는 편이 좋다.

### 4.4. 페이지가 화면, 데이터, 폼, 비즈니스 조합을 모두 떠안고 있다

현재 `MeetingSearchPage`, `GroupDetailPage`, `AdminDistrictPage`, `AdminGroupPage`는 페이지 안에서 직접 아래를 모두 처리한다.

- 초기 데이터 로딩
- 에러/로딩 상태
- 폼 상태
- API 호출
- payload 변환
- 후속 목록 갱신
- 성공/실패 메시지

이 구조는 화면이 작을 때는 빠르지만, 기능이 늘면 페이지가 비대해진다. 이미 `AdminGroupPage`는 그룹, GSR, 모임, 공지 관리가 한 파일에 같이 들어간 상태다. 이 패턴이 `store`, `heart`에도 반복되면 유지보수 난도가 급격히 올라간다.

### 4.5. API 계층도 도메인/맥락 분리가 약하다

현재 `src/api/groups.js`는 공개 조회(`fetchGroupDetail`)와 관리자 명령(`fetchAdminGroups`, `createAdminGroup`, `createAdminGroupMeeting`, `updateAdminGroupMeeting` 등)을 같은 파일에 담고 있다.

지금은 파일 수를 줄이는 데 도움이 되지만, 장기적으로는 아래 문제가 생긴다.

- 공개 조회 모델과 운영 명령 모델이 한 파일에서 섞인다.
- 어떤 함수가 어떤 역할과 화면에서 쓰이는지 파일명만 보고 알기 어렵다.
- `store`, `heart`가 추가되면 비슷한 혼합이 더 심해질 수 있다.

조회와 명령, 공개와 운영, 사용자와 관리자 문맥은 앞으로 더 명확히 분리하는 편이 좋다.

### 4.6. 공용 폴더가 잡동사니 폴더가 될 가능성이 높다

지금은 `components/common`, `components/layout`, `utils` 정도가 적당한 규모지만, 확장 단계에서는 아래 위험이 생긴다.

- 재사용이 검증되지 않은 도메인 전용 컴포넌트까지 공용 폴더로 이동
- 특정 도메인만 아는 포맷 함수가 `utils`로 누적
- 실제로는 `service` 전용인 컴포넌트가 shared처럼 보이게 됨

이런 상태가 되면 "공용"은 재사용을 뜻하지 않고 "분류를 못 한 것들의 보관함"이 된다.

## 5. 왜 `member`, `service`, `store`, `heart`는 같은 구조로 보기 어려운가

이 도메인들은 화면 목적과 사용자 흐름이 꽤 다르다.

| 도메인 | 대표 화면 성격 | 구조상 필요한 특성 |
| --- | --- | --- |
| `basic` | 공개 콘텐츠, 검색, 상세 조회 | 읽기 중심, 검색/안내 흐름 |
| `member` | 로그인, 주소록, 멤버 공간 집계 | 인증/세션, 프로필, 마이페이지 조합 |
| `service` | 관리자/봉사자 CRUD, 권한 기반 화면 | 테이블, 폼, 상태 전환, 운영 레이아웃 |
| `store` | 상품 탐색, 장바구니, 주문, 결제 전후 흐름 | 사용자 구매 플로우, 주문 상태, 주소/계정 연동 |
| `heart` | 구독 생성, 발송 이력, 회차 관리 | 장기 상태 추적, 구독 수명주기, 운영/사용자 혼합 화면 |

즉 `member`, `store`, `heart`는 단순히 "공개 화면에 페이지 몇 개 추가"로 끝나는 도메인이 아니다.

오히려 아래처럼 보는 편이 맞다.

- `basic`: 공개 조회 앱
- `member`: 공통 로그인 + 멤버 공간 조합 앱
- `service`: 조직/콘텐츠 운영 도메인
- `store`: 사용자 구매 도메인
- `heart`: 사용자 구독 도메인
- 별도로 관리자 포털은 하나일 수 있지만, 내부에서는 `service`, `store`, `heart` 운영 화면을 분리해 담는 진입 shell로 보는 편이 맞다.

이렇게 성격이 다르면 폴더 구조도 "하나의 공용 pages/components/api 체계"보다는 "도메인별 독립 구획"이 더 잘 맞는다.

## 6. 권장 방향

핵심 제안은 단순하다.

### 6.1. 최상위 기준을 도메인으로 바꾼다

앞으로는 기술 분류보다 도메인 기준이 먼저 보이도록 구조를 잡는 것이 좋다.

추천 방향:

```text
frontend/aakorea/src/
  app/
    router/
    providers/
  shared/
    ui/
    lib/
    api/
    constants/
  domains/
    basic/
    service/
    store/
    heart/
    member/
```

이 구조의 의미는 아래와 같다.

- `app`: 앱 전체 조립 지점
- `shared`: 정말 여러 도메인에서 공통으로 쓰는 것만 보관
- `domains`: 실제 비즈니스 도메인별 코드 보관

### 6.2. 레이아웃은 라우터 트리에서 나눈다

`AppLayout`이 pathname을 해석하는 방식 대신, 라우터가 각 도메인의 shell을 직접 결정하도록 바꾸는 편이 좋다.

예시 구조:

```text
app/router/
  public-routes.jsx
  member-routes.jsx
  admin-routes.jsx
  store-routes.jsx
  heart-routes.jsx
```

개념적으로는 아래처럼 나누면 된다.

- 공개용 `PublicShell`
- 멤버용 `MemberShell`
- 운영 포털용 `AdminPortalShell`
- 구매용 `StoreShell`
- 구독용 `HeartShell`

중요한 점은 `store`, `heart`가 필요하면 자신만의 shell을 가질 수 있어야 하고, `member`와 `admin`은 여러 도메인 데이터를 조합해 보여줄 수 있어야 한다는 것이다. 다만 조합 화면이 곧 도메인 소유권을 뜻하지는 않는다. 현재처럼 최상위 레이아웃이 경로 문자열로 분기하는 방식은 이 확장을 어렵게 만든다.

### 6.3. 도메인 안에서는 기능 단위로 더 쪼갠다

각 도메인 아래에서도 다시 기능별로 나누는 편이 좋다.

예시:

```text
domains/
  basic/
    content/
    home/
    meeting-search/
    group-detail/
    gso/
  member/
    auth/
    profile/
    addresses/
    my-page/
  service/
    dashboard/
    districts/
    groups/
    meetings/
    notices/
    gsrs/
  store/
    catalog/
    cart/
    checkout/
    orders/
  heart/
    subscriptions/
    issues/
    deliveries/
```

이렇게 두 단계로 나누면 장점이 분명하다.

- 도메인 경계가 먼저 보인다.
- 기능 수정 시 관련 파일이 한곳에 모인다.
- `store`, `heart`가 기존 `basic` 스타일을 억지로 따라갈 필요가 없다.

여기서 `member/my-page`는 `store`, `heart`, `service` 데이터를 조회 조합할 수 있지만, 주문/구독/운영 로직 자체를 흡수하는 위치가 되어서는 안 된다.

### 6.4. shared에는 정말 공통인 것만 둔다

아래처럼 기준을 엄격히 두는 것이 좋다.

- `shared/ui`: 버튼, 모달, 공통 배지처럼 여러 도메인에서 실제로 재사용되는 UI
- `shared/lib`: 날짜 포맷, URL 유틸, 공통 검증 등 도메인 지식이 거의 없는 유틸
- `shared/api`: 공통 fetch client 정도

반대로 아래는 shared로 올리지 않는 편이 좋다.

- 특정 도메인의 용어를 아는 컴포넌트
- 특정 도메인의 DTO를 전제로 하는 포맷 함수
- `service`에서만 쓰는 운영 화면 위젯
- `store`에서만 쓰는 주문/결제 UI

## 7. 현재 코드 기준으로 권장 재배치 예시

현재 코드를 바로 바꾸지는 않더라도, 목표 구조는 아래처럼 상상하는 것이 좋다.

### 7.1. `basic`

- `pages/PublicHomePage.jsx` -> `domains/basic/home/HomePage.jsx`
- `pages/PublicContentPage.jsx` + `data/publicContent.js` -> `domains/basic/content/*`
- `pages/MeetingSearchPage.jsx` + `components/meeting/*` -> `domains/basic/meeting-search/*`
- `pages/GroupDetailPage.jsx` + `components/group/*` -> `domains/basic/group-detail/*`
- `pages/GsoPage.jsx` -> `domains/basic/gso/GsoPage.jsx`

### 7.2. `service`

- `components/admin/AdminLayout.jsx` -> `app/admin/AdminPortalShell.jsx`
- `components/admin/AdminOverviewPage.jsx` -> `app/admin/AdminPortalHomePage.jsx`
- `pages/admin/AdminDistrictPage.jsx` -> `domains/service/districts/*`
- `pages/admin/AdminGroupPage.jsx` -> 아래 기능으로 분해

관리자 진입면은 하나일 수 있지만, 실제 기능 코드는 `domains/service`, `domains/store`, `domains/heart`로 나눠 두는 편이 최근 문서 방향과 더 잘 맞는다.

권장 분해 단위:

- `domains/service/groups/GroupList`
- `domains/service/groups/GroupForm`
- `domains/service/groups/useGroupActions`
- `domains/service/meetings/MeetingManagementPanel`
- `domains/service/notices/NoticeManagementPanel`
- `domains/service/gsrs/GsrManagementPanel`

현재 `AdminGroupPage`는 화면 구조상 "한 페이지"일 수는 있지만, 코드 구조상 "한 파일"일 필요는 없다.

### 7.3. API 계층

현재처럼 `src/api/groups.js` 하나에 공개 조회와 관리자 명령을 같이 두기보다, 아래처럼 문맥을 나누는 편이 좋다.

```text
domains/basic/group-detail/api.js
domains/basic/meeting-search/api.js
domains/member/profile/api.js
domains/member/addresses/api.js
domains/member/my-page/queries.js
domains/service/groups/api.js
domains/service/meetings/api.js
domains/service/notices/api.js
domains/service/gsrs/api.js
```

이렇게 하면 어떤 요청이 어느 화면 문맥에 속하는지 더 분명해진다. 특히 `member/my-page`는 `store`, `heart` 데이터를 집계하더라도 주문/구독 API를 자기 소유처럼 끌어오지 않고 조회 조합 계층으로 남기는 편이 좋다.

## 8. 상태 관리 기준 제안

현재는 별도의 전역 상태 라이브러리가 없고, 대부분 페이지 로컬 상태로 처리하고 있다. 지금은 가능하지만, 확장 단계에서는 상태의 층위를 분명히 나누는 편이 좋다.

권장 기준:

- 앱 전역 상태: 인증 정보, 현재 사용자, 최소 멤버 세션 정보, 공통 설정
- 도메인 상태: 특정 도메인에서 반복 사용하는 조회 결과, 필터, 편집 대상
- 기능 상태: 폼 입력, 탭, 모달, 정렬 상태
- 로컬 UI 상태: 열림/닫힘, hover, 선택 여부

중요한 점은 "모든 것을 전역으로 올리지 않는 것"이다.

특히 앞으로의 `store`, `heart` 때문에 성급하게 거대한 전역 store를 만드는 것은 추천하지 않는다. 먼저 도메인/기능 단위로 상태를 가두고, 진짜 여러 화면에서 공유되는 것만 상위 계층으로 올리는 편이 더 안전하다. 주문 목록, 구독 이력, GSR 편집 상태를 하나의 공용 전역 store에 몰아넣기보다, 멤버 공간이나 관리자 포털에서 필요한 요약만 조합하는 편이 최근 문서 방향과도 맞다.

## 9. 라우팅과 URL에 대한 제안

현재 운영 화면 URL은 `/admin/*`인데, 최근 문서 기준으로는 이를 하나의 관리자 포털 진입점으로 보고 내부를 도메인별 route group으로 나누는 편이 더 자연스럽다.

권장 예시는 아래와 같다.

- 사용자 노출 URL: `/admin/service/*`, `/admin/store/*`, `/admin/heart/*`
- 코드 구조: `domains/service`, `domains/store`, `domains/heart`
- 멤버 공간 URL: `/me/*` 또는 `/member/*`

즉 `/admin`은 포털 namespace로 남길 수 있지만, 코드 구조까지 generic `admin` 폴더 중심으로 유지하지는 않는 편이 좋다.

그 이유는 아래와 같다.

- 백엔드와 프론트엔드 협업 용어가 맞아진다.
- `store`, `heart`를 추가할 때도 "어느 도메인 소속인가"가 분명하다.
- 통합 관리자 포털을 유지하면서도 도메인 소유권은 분리할 수 있다.

## 10. 단계적 전환안

한 번에 전부 바꾸기보다 아래 순서로 가는 것이 현실적이다.

### 1단계. 라우트와 레이아웃 분리

- 최상위 라우터에서 public/member/admin shell을 먼저 나누고, admin 내부에서 `service`, `store`, `heart` route group을 준비한다.
- 이 단계에서는 UI를 거의 바꾸지 않아도 된다.

### 2단계. 폴더를 도메인 기준으로 이동

- `basic`과 `service`부터 먼저 옮긴다.
- 파일 이동만 하고, 내부 로직 변경은 최소화한다.

### 3단계. 비대한 페이지를 기능 단위로 쪼갠다

- 우선순위는 `AdminGroupPage`다.
- 그룹, GSR, 모임, 공지 기능을 화면 조각과 데이터 조각으로 나눈다.

### 4단계. 도메인별 API/상태 조합을 정리한다

- 페이지 안의 직접 API 호출 로직을 기능 단위 훅 또는 기능 서비스로 이동한다.
- 로딩/에러/성공 처리 패턴을 기능별로 정리한다.

### 5단계. `store`, `heart`는 처음부터 독립 도메인으로 시작한다

- 새 도메인을 기존 `admin` 또는 `pages` 밑에 임시로 넣지 않는다.
- 추가되는 순간부터 독립 route group, 독립 shell, 독립 기능 폴더를 가진 구조로 시작하는 편이 낫다.
- 관리자 화면이 필요하면 `AdminPortalShell` 아래에 붙이되, 구현 코드는 각각 `domains/store`, `domains/heart` 아래에 둔다.

## 11. 지금 당장 꼭 바꿔야 하는 것과 아닌 것

### 지금 당장 바꾸는 것을 추천하는 것

- 레이아웃 분기를 pathname 조건문에서 라우터 구조로 옮기기
- `admin` 포털과 `service` 도메인의 용어/구조 분리
- `AdminGroupPage`의 기능 분리 준비
- 도메인 기준 폴더 구조 설계

### 당장 서두르지 않아도 되는 것

- 전역 상태 라이브러리 도입
- 모든 공통 컴포넌트의 재정리
- 디자인 시스템 전면 개편

지금 필요한 것은 "대규모 추상화"가 아니라 "확장 가능한 경계 정리"다.

## 12. 최종 제안

한 줄로 정리하면 다음과 같다.

현재 구조는 현재 범위에는 충분하지만, 앞으로의 `service`, `store`, `heart` 확장을 견디는 목표 구조로는 부족하다. 따라서 다음 단계부터는 `pages/components/api` 중심 구조를 더 키우기보다, 라우트 shell과 도메인 경계를 먼저 세우는 방향으로 전환하는 것이 좋다.

특히 아래 원칙을 추천한다.

- 최상위 구조는 도메인 기준으로 잡는다.
- 레이아웃은 라우터 트리에서 결정한다.
- `member`와 `admin`은 조합 shell로 둘 수 있지만, 비즈니스 소유권은 각 도메인에 남긴다.
- 도메인 안에서는 기능 단위로 코드를 모은다.
- shared는 정말 공통인 것만 둔다.
- `store`, `heart`는 기존 public/admin 구조에 억지로 맞추지 않는다.

이 방향으로 가면 앞으로 `basic`, `service`, `store`, `heart`, `member`가 서로 다른 화면 구조를 가져도 프론트엔드 전체가 한 덩어리로 엉키지 않고 확장될 가능성이 훨씬 높다.
