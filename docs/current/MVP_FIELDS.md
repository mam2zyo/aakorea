<!-- docs/current/MVP_FIELDS.md -->

# MVP_FIELDS

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 **각 개체에 필요한 최소 필드**를 정의한다.

이 문서가 답하는 질문:

- 현재 MVP 구현에 꼭 필요한 필드는 무엇인가?
- 각 필드의 최소 의미는 무엇인가?
- 어떤 필드는 현재 제외하는가?
- 어떤 필드는 이후 확장 후보인가?

이 문서에 포함하지 않는 내용:

- 제품 범위의 상세 판단
- 사용자별 목표와 행동 흐름
- 도메인 개체의 의미와 관계에 대한 장문 설명
- API 요청/응답 계약
- 구현 단계별 작업 순서

---

## 공통 원칙

### 1. 최소 필드만 둔다

현재 MVP에서 직접 쓰이지 않는 필드는 넣지 않는다.

### 2. 공개 흐름과 운영 흐름을 동시에 지지하는 필드만 우선한다

필드가 있으면 좋은 수준이 아니라,  
공개 탐색 또는 최소 운영 관리에 직접 필요할 때만 포함한다.

### 3. 설명보다 식별과 노출에 필요한 값부터 우선한다

고급 메타데이터보다, 실제 조회/노출/관리 가능한 최소값을 우선한다.

### 4. 확장 가능한 필드는 별도 후보로 남긴다

현재 꼭 필요하지 않으면 본문 필드 목록에 넣지 않고,  
각 개체의 “확장 후보”에 둔다.

---

## 공통 필드 기준

아래 필드는 여러 개체에서 공통적으로 필요할 수 있다.

- `id`
- `active` 또는 `published`
- `createdAt`
- `updatedAt`

다만 현재 문서에서는 **개체별 최소 필드**를 우선 정의한다.  
공통 감사 필드(`createdAt`, `updatedAt`)는 구현체에서 공통 처리하더라도 무방하다.

상태 필드는 성격에 따라 구분한다.

- 운영 데이터 활성/비활성: `active`
- 공개 콘텐츠 게시 여부: `published`

---

## 값 타입으로 다루는 공통 기준값

현재 MVP에서는 아래 항목을 독립 핵심 개체가 아니라 **값 또는 제어된 선택값**으로 다룬다.

### Province

- 공개 모임 탐색의 핵심 기준값이다
- 현재는 독립 핵심 개체가 아니라 `Meeting`의 필드로 다룬다
- 허용값 목록은 코드 또는 설정으로 관리할 수 있다

### DayOfWeek

- `Meeting`의 기본 일정 표현에 필요한 선택값이다
- 현재는 단순 반복 요일 수준으로만 다룬다

---

## 1. District

### 최소 필드

- `id`
- `name`
- `active`

### 필드 설명

- `id`  
  District 식별자

- `name`  
  운영자가 구분할 수 있는 District 이름

- `active`  
  현재 운영 대상 여부

### 현재 제외하는 필드

- 설명 본문
- 주소 상세
- 연락처
- 지역 코드
- 조직 유형
- 상위/하위 District를 위한 트리 구조 필드

### 확장 후보

- `displayOrder`
- `slug`
- `description`

---

## 2. Group

### 최소 필드

- `id`
- `districtId`
- `name`
- `active`

### 필드 설명

- `id`  
  Group 식별자

- `districtId`  
  소속 District 참조값

- `name`  
  운영 및 공개에서 식별 가능한 그룹명

- `active`  
  현재 운영/노출 대상 여부

### 중요한 제약

- `province`는 `Group`에 두지 않는다
- 지역 탐색 기준은 현재 `Meeting`이 가진다
- 이유와 모델 경계는 `DOMAIN_MODEL.md`를 따른다

### 현재 제외하는 필드

- 그룹 소개 본문
- 대표 이미지
- 세부 조직 유형
- 다중 지역 정보
- 복잡한 공개 메타데이터

### 확장 후보

- `slug`
- `description`

---

## 3. GroupContact

### 최소 필드

- `id`
- `groupId`
- `phone`
- `active`

### 필드 설명

- `id`  
  GroupContact 식별자

- `groupId`  
  소속 Group 참조값

- `phone`  
  공개 연락에 사용하는 전화번호  
  현재 MVP에서 가장 중요한 필드 중 하나다

- `active`  
  현재 사용 가능한 연락처 여부

### 중요한 제약

- 현재 MVP에서 `phone`은 사실상 핵심 필수값이다
- 범용 연락 수단 모델로 일반화하지 않는다
- 이메일, 메신저, 다중 채널 구조는 현재 필수 아님

### 현재 제외하는 필드

- 이메일
- 연락 우선순위 정책
- 비공개 내부 메모
- 복수 채널 타입

### 확장 후보

- `mailingAddress`
- `email`

---

## 4. Meeting

### 최소 필드

- `id`
- `groupId`
- `province`
- `dayOfWeek`
- `startTime`
- `type`
- `meetingPlace`
- `active`

### 필드 설명

- `id`  
  Meeting 식별자

- `groupId`  
  소속 Group 참조값

- `province`  
  공개 탐색에 사용하는 지역 기준값

- `dayOfWeek`  
  기본 모임 요일

- `startTime`  
  기본 시작 시간

- `type`
  공개 모임 / 비공개 모임 여부

- `meetingPlace`
  모임 주소 및 상세 위치 정보

- `active`  
  현재 공개/운영 대상 여부

### 중요한 제약

- 현재 공개 탐색의 핵심 기준은 `Meeting.province`다
- 복잡한 일정 구조 대신, 반복 모임의 기본 표현만 우선한다
- 사용자는 `Meeting`을 통해 공개 정보에 접근한다

### 현재 제외하는 필드

- 복잡한 반복 규칙
- 예외 일정
- 종료 시간
- 상세 위치 좌표
- 온라인/오프라인 혼합 세부 모델
- 참가 인원 제한
- 신청 상태
- 별도 발표/안내 모델 연결

### 확장 후보

- `notes`
- `mapUrl`
- `isOnline`

---

## 5. ContentPage

### 최소 필드

- `id`
- `key`
- `title`
- `body`
- `published`

### 필드 설명

- `id`  
  ContentPage 식별자

- `key`  
  페이지를 안정적으로 식별하기 위한 고정 키  
  예: 소개, 처음 방문 안내 등

- `title`  
  공개 페이지 제목

- `body`  
  본문 내용

- `published`  
  공개 게시 여부

### 중요한 제약

- `ContentPage`는 비교적 안정적인 안내/설명 콘텐츠에 사용한다
- 공지성 정보는 `Notice`로 분리한다
- 구분 기준은 `CONTENT_MODEL.md`를 따른다

### 현재 제외하는 필드

- 카테고리
- 태그
- 첨부파일
- SEO 메타데이터 전체 세트
- 다국어 구조
- 복잡한 레이아웃 블록 시스템

### 확장 후보

- `summary`
- `slug`
- `displayOrder`
- `seoTitle`
- `seoDescription`

---

## 6. Notice

### 최소 필드

- `id`
- `title`
- `body`
- `published`
- `publishedAt`

### 필드 설명

- `id`  
  Notice 식별자

- `title`  
  공지 제목

- `body`  
  공지 본문

- `published`  
  공개 게시 여부

- `publishedAt`  
  공개 정렬 및 노출 판단에 사용할 게시 시점

### 중요한 제약

- `Notice`는 시의성 있는 공지/업데이트 정보에 사용한다
- 정적 안내 콘텐츠는 `ContentPage`로 다룬다
- 구분 기준은 `CONTENT_MODEL.md`를 따른다

### 현재 제외하는 필드

- 카테고리
- 태그
- 첨부파일
- 중요도 점수 체계
- 예약 게시/종료 게시 고급 정책
- 게시판형 댓글 구조

### 확장 후보

- `summary`
- `isPinned`
- `expiresAt`
- `authorDisplayName`

---

## 현재 MVP에서의 필수도 요약

### 공개 탐색 흐름에 직접 필요한 필드

- `Meeting.province`
- `Meeting.dayOfWeek`
- `Meeting.startTime`
- `Meeting.placeName`
- `GroupContact.phone`

### 운영 기준 유지에 직접 필요한 필드

- `District.name`
- `Group.name`
- `Group.districtId`
- 각 개체의 `active` 또는 `published`

### 안내/공지 제공에 직접 필요한 필드

- `ContentPage.key`
- `ContentPage.title`
- `ContentPage.body`
- `Notice.title`
- `Notice.body`
- `Notice.publishedAt`

---

## 현재 보류하는 필드 성격

아래 성격의 필드는 현재 MVP에서 기본적으로 보류한다.

- 개인화에 필요한 필드
- 복잡한 권한 제어용 필드
- 고급 검색/정렬을 위한 부가 필드
- 미디어 자산 관리용 필드
- SEO 고도화용 필드
- 복잡한 일정/행사 운영용 필드
- 게시판/커뮤니티용 필드

이런 필드가 필요해질 때는 먼저 현재 핵심 흐름에 직접 필요한지 검토한다.

---

## 필드 추가 판단 기준

새 필드를 추가할 때는 아래 질문으로 판단한다.

### 추가하는 경우

- 공개 사용자가 모임을 찾는 데 직접 필요하다
- 공개 사용자가 연락 가능한 지점에 도달하는 데 직접 필요하다
- 운영자가 핵심 정보를 유지하는 데 직접 필요하다
- 안내/공지 노출의 최소 기능에 직접 필요하다

### 보류하는 경우

- 없어도 현재 핵심 흐름이 성립한다
- 운영 편의만 높이고 공개 가치에 직접 연결되지 않는다
- 모델 복잡도를 크게 높인다
- 이후 확장 단계에서 분리 가능한 요구다

---

## 구현 시 주의

이 문서는 필드의 **존재 여부와 최소 의미**를 정의한다.  
다음 항목은 이 문서의 직접 범위가 아니다.

- DB 타입 상세
- 길이 제한 상세
- 유효성 검증 규칙 상세
- 인덱스 설계
- API 직렬화 형식
- 화면 표시 포맷

이 내용은 구현 코드와 `API_DRAFT.md`에서 구체화한다.

---

## 관련 문서

- 제품 범위와 포함/제외 기준: `PRODUCT_SCOPE.md`
- 사용자 행동과 유스케이스: `ACTORS_AND_USE_CASES.md`
- 도메인 구조와 개체 의미: `DOMAIN_MODEL.md`
- 콘텐츠 구분 기준: `CONTENT_MODEL.md`
- API 계약 초안: `API_DRAFT.md`
- 구현 순서와 완료 기준: `IMPLEMENTATION_PLAN.md`
