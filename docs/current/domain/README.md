<!-- docs/current/domain/README.md -->

# DOMAIN

## 이 문서의 역할

이 디렉토리는 AAKorea Main 웹앱의 **현재 도메인 모델 의미와 필드 기준**을 관리한다.

이 문서가 답하는 질문:

- 어떤 도메인 문서가 있는가?
- 어떤 순서로 읽으면 되는가?
- `ContentPage`와 `Notice`는 어떻게 구분하는가?

이 문서에 포함하지 않는 내용:

- 제품 범위의 포함 / 제외 판단
- 사용자 행동 흐름
- HTTP 요청 / 응답 계약
- 구현 단계별 작업 순서

---

## 현재 도메인 문서 구성

- `SharedTypes.md`
  여러 도메인이 함께 쓰는 값 타입과 공용 값 객체

- `District.md`
  지역연합 모델

- `Group.md`
  운영의 중심 단위인 그룹 모델

- `GroupContact.md`
  그룹 대표 연락처 모델

- `Meeting.md`
  공개 탐색 시작점이자 실제 장소 / 일정 소유자인 모임 모델

- `ContentPage.md`
  안정적인 설명 / 안내 페이지 모델

- `Notice.md`
  시의성이 있는 공지 모델

- `PublicThemeSetting.md`
  공개 사이트 active / draft theme 상태 모델

---

## 권장 읽기 순서

1. `SharedTypes.md`
2. `District.md`
3. `Group.md`
4. `GroupContact.md`
5. `Meeting.md`
6. `ContentPage.md`
7. `Notice.md`
8. `PublicThemeSetting.md`

---

## 현재 핵심 도메인 요약

- `District`
  그룹의 소속 기준이 되는 지역연합

- `Group`
  운영 입력과 공개 상세 문맥의 중심 단위

- `GroupContact`
  그룹당 1건 기준의 대표 연락처

- `Meeting`
  공개 검색 시작점이자 위치 / 일정 / 노출 상태의 소유자

- `ContentPage`
  비교적 안정적인 설명 / 안내 콘텐츠

- `Notice`
  최신순 노출이 중요한 공지 콘텐츠

- `PublicThemeSetting`
  공개 사이트 테마의 active / draft / rollback 상태

---

## `ContentPage`와 `Notice` 구분 기준

현재 MVP에서 콘텐츠 모델의 핵심 구분은 아래 두 가지다.

1. 비교적 안정적인 안내 / 설명 정보
2. 시의성 있는 공지 / 업데이트 정보

즉,

- 안정적이고 설명 중심인 정보는 `ContentPage`
- 시의성이 있고 공지 중심인 정보는 `Notice`

### 판단 질문 1

이 정보는 시간이 지나도 기본적으로 계속 유지되어야 하는가?

- 그렇다면 `ContentPage` 가능성이 높다
- 아니라면 `Notice` 가능성이 높다

### 판단 질문 2

이 정보는 “설명”인가, “공지”인가?

- 설명이면 `ContentPage`
- 공지이면 `Notice`

### 판단 질문 3

이 정보는 단독 페이지로 읽히는 것이 자연스러운가?

- 그렇다면 `ContentPage`
- 아니고 목록 / 최신순 노출이 자연스러우면 `Notice`

### 판단 질문 4

이 정보는 누적 게시 이력이 의미가 있는가?

- 그렇다면 `Notice`
- 아니라면 `ContentPage`

---

## 현재 별도 모델로 두지 않는 것

현재 MVP에서는 아래 개념을 별도 도메인 모델로 두지 않는다.

- 범용 `Board` / `Post`
- FAQ 전용 모델
- 카테고리형 CMS 구조
- `Attachment` / `MediaAsset`
- `Event` / `Campaign`
- 그룹 소개 / 그룹 변경 이력
- 운영자 서버 저장 개인 설정

---

## 문서 운영 원칙

이 디렉토리에서는 아래 규칙을 따른다.

### 1. 의미와 필드를 같은 문서에 둔다

각 도메인 문서는 “이 개체가 무엇인가”와
“현재 어떤 필드를 유지하는가”를 함께 가진다.

### 2. 공용 값 타입은 `SharedTypes.md`에 둔다

`Province`, `MeetingType`, `Location`처럼
여러 도메인이 함께 쓰는 타입은 개별 문서에 반복하지 않는다.

### 3. 교차 비교는 허브 문서에 둔다

`ContentPage`와 `Notice`의 경계처럼
도메인 간 비교가 필요한 내용은 이 문서에서 관리한다.

### 4. API 세부 형식은 `current/api/`로 넘긴다

도메인 문서에서는 API 이름 정도만 언급하고,
요청 / 응답 JSON 상세는 반복하지 않는다.
