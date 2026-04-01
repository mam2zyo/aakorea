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

### 5. 현재 구현과 다음 구조 조정 방향을 함께 기록한다

이 문서는 코드에 이미 반영된 현재 필드와,  
다음 리팩터링에서 우선 검토할 필드 방향을 함께 기록한다.

따라서 일부 항목은 “현재 구현 기준”, 일부 항목은 “다음 조정 방향”일 수 있다.  
현재 API 계약은 `api/` 문서를 우선 기준으로 본다.

---

## 공통 필드 기준

아래 필드는 여러 개체에서 공통적으로 필요할 수 있다.

- `id`
- `createdAt`
- `updatedAt`

다만 현재 문서에서는 **개체별 최소 필드**를 우선 정의한다.  
공통 감사 필드(`createdAt`, `updatedAt`)는 구현체에서 공통 처리하더라도 무방하다.

상태 필드는 필요한 개체에서만 둔다.

- 운영 데이터 활성/비활성: `Meeting.active`
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

### MeetingType

- `Meeting`의 공개/비공개 성격을 표현하는 enum 값이다
- 허용값은 `OPEN`, `CLOSED`, `NOTFIXED`다
- 현재 MVP에서는 상세 예외 일정 대신 대표 상태를 표현하는 데 사용한다

### MeetingPlaceNote

- `Meeting`의 예외 장소 안내를 표현하는 문자열 필드다
- 현재는 `Meeting` 내부에 포함되며 별도 식별자를 갖지 않는다
- 값이 없으면 `Group` 기본 장소를 그대로 사용한다

---

## 1. District

### 최소 필드

- `id`
- `name`

### 필드 설명

- `id`  
  District 식별자

- `name`  
  운영자가 구분할 수 있는 District 이름

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
- `locationName`
- `locationAddress`
- `introduction`
- `notice`
- `changeSummary`

### 필드 설명

- `id`  
  Group 식별자

- `districtId`  
  소속 District 참조값

- `name`  
  운영 및 공개에서 식별 가능한 그룹명

- `locationName`  
  Group 기본 장소명

- `locationAddress`  
  Group 기본 주소

- `introduction`  
  방문자에게 보여줄 간단 소개 또는 인사말

- `notice`  
  Group 단위 공지 또는 방문 전 안내

- `changeSummary`  
  최근 변경 사항 요약

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
- `mapUrl`
- `heroImage`

---

## 3. GroupContact

### 최소 필드

- `id`
- `groupId`
- `phone`

### 필드 설명

- `id`  
  GroupContact 식별자

- `groupId`  
  소속 Group 참조값

- `phone`  
  공개 연락에 사용하는 전화번호  
  현재 MVP에서 가장 중요한 필드 중 하나다

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

현재 구현 기준 최소 필드는 아래와 같다.

- `id`
- `groupId`
- `province`
- `dayOfWeek`
- `startTime`
- `type`
- `meetingPlaceNote`
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
  `MeetingType` enum 값  
  허용값: `OPEN`, `CLOSED`, `NOTFIXED`

- `meetingPlaceNote`  
  Group 기본 장소와 다른 방/홀/세부 안내가 있을 때 사용하는 예외 메모

- `active`  
  현재 공개/운영 대상 여부

### 중요한 제약

- 현재 공개 탐색의 핵심 기준은 `Meeting.province`다
- 복잡한 일정 구조 대신, 반복 모임의 기본 표현만 우선한다
- 사용자는 `Meeting`을 통해 공개 정보에 접근한다
- `type`은 `MeetingType` enum으로 관리한다
- `NOTFIXED`는 공개/비공개 성격이 회차별로 고정되지 않는 경우에 사용한다
- 예: 기본적으로 `CLOSED`이지만 마지막 주만 `OPEN`인 모임
- 기본 위치 정보는 `Group`이 가진다
- `meetingPlaceNote`는 예외가 있을 때만 사용한다

### 현재 구조 판단

최근 운영 데이터 기준으로는 대부분의 `Group`이 하나의 기본 주소와 기본 장소를 공유하고,  
`Meeting`은 요일과 시간만 달라지는 경우가 압도적으로 많다.

따라서 현재 구현은 아래 방향을 따른다.

- `Meeting`은 `Group`의 하위 일정 단위로 본다
- 기본 위치 정보는 `Meeting`보다 `Group`에 둔다
- `Meeting`에는 `dayOfWeek`, `startTime`, `active`, 필요 시 `type` 정도를 남긴다
- 장소 예외는 `meetingPlaceNote` 같은 얇은 override 필드로 처리한다

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

- `meetingTypeNotes`
- `meetingPlaceNote`
- `notes`
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

- `Group.locationName`
- `Group.locationAddress`
- `Meeting.meetingPlaceNote`

- `GroupContact.phone`

### 운영 기준 유지에 직접 필요한 필드

- `District.name`
- `Group.name`
- `Group.districtId`
- `Meeting.active`
- `ContentPage.published`
- `Notice.published`

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

이 내용은 구현 코드와 `api/COMMON.md`, `api/README.md` 아래 세부 API 문서에서 구체화한다.

---

## 관련 문서

- 제품 범위와 포함/제외 기준: `PRODUCT_SCOPE.md`
- 사용자 행동과 유스케이스: `ACTORS_AND_USE_CASES.md`
- 도메인 구조와 개체 의미: `DOMAIN_MODEL.md`
- 콘텐츠 구분 기준: `CONTENT_MODEL.md`
- API 계약: `api/README.md`
- 구현 순서와 완료 기준: `IMPLEMENTATION_PLAN.md`
