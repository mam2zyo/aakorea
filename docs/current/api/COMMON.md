<!-- docs/current/api/COMMON.md -->

# API_COMMON

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 모든 API가 공통으로 따르는 규약을 정의한다.

이 문서가 답하는 질문:

- API Base Path와 인증 구분은 어떻게 되는가?
- 공통 응답 형식은 무엇인가?
- 어떤 상태 코드를 기본으로 사용하는가?
- 공통 값 형식은 어떻게 표현하는가?
- 구현 시 어떤 공통 주의사항을 지켜야 하는가?

이 문서에 포함하지 않는 내용:

- 특정 엔드포인트의 요청/응답 계약
- 엔티티별 상세 필드 채택 이유
- 제품 범위 판단
- 구현 단계별 작업 순서

---

## API 설계 원칙

### 1. 공개 API와 운영 API를 분리한다

- 공개 조회용 API는 `/api/public/*`
- 인증이 필요한 운영 API는 `/api/admin/*`
- 인증 API는 `/api/auth/*`

### 2. 현재 MVP에 필요한 최소 계약만 둔다

- 조회
- 생성
- 수정
- 일부 엔티티 삭제
- 활성/게시 상태 변경
- 로그인/로그아웃/세션 확인

### 3. 응답 구조는 단순하게 유지한다

목록 응답과 단건 응답은 가능한 한 일관된 구조를 사용한다.

### 4. 필드 의미의 원본은 `../MVP_FIELDS.md`를 따른다

이 문서에서는 요청/응답에 등장하는 필드만 정의하고,  
필드 채택 이유나 확장 배경은 반복하지 않는다.

---

## 공통 규약

### Base Path

```text
/api
```

### Content Type

```text
application/json
```

### 인증 방식

현재 MVP는 운영자 세션 기반 인증 또는 이에 준하는 단순 인증을 전제로 한다.

이 문서에서는 인증 구현 상세를 고정하지 않는다.  
다만 아래 원칙은 유지한다.

- 공개 API는 인증 없이 접근 가능
- 운영 API는 인증 필요
- 인증 실패 시 401 반환
- 권한 없음 또는 접근 불가 시 403 반환 가능

---

## 공통 응답 형식

현재 MVP에서는 아래와 같은 단순 응답 형식을 사용한다.

### 성공 응답 예시

```json
{
  "data": {}
}
```

### 목록 응답 예시

```json
{
  "data": [{}]
}
```

### 에러 응답 예시

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "province is required"
  }
}
```

필요 시 필드 단위 오류를 아래처럼 포함할 수 있다.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "invalid request",
    "fields": {
      "province": "province is required",
      "phone": "phone is invalid"
    }
  }
}
```

---

## 공통 상태 코드

- `200 OK`: 조회/수정 성공
- `201 Created`: 생성 성공
- `204 No Content`: 삭제 또는 상태 변경 성공 시 선택적으로 사용
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 필요 또는 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 대상 없음
- `409 Conflict`: 중복 또는 충돌
- `500 Internal Server Error`: 서버 오류

현재 MVP에서는 여전히 `Meeting.active` / `published` 전환을 우선한다.  
다만 현재 구현에는 아래와 같은 제한적 삭제 API가 포함되어 있다.

- `District`, `Group`, `Meeting`
- `ContentPage`, `Notice`

반면 `GroupContact`는 현재 수정 중심으로 유지한다.

---

## 값 형식 기준

### Province

- 문자열
- 허용된 지역 값 중 하나여야 한다

예:

```json
"province": "seoul"
```

### DayOfWeek

- 문자열
- 허용된 요일 값 중 하나여야 한다

예:

```json
"dayOfWeek": "MONDAY"
```

### MeetingType

- 문자열 enum
- 허용값: `OPEN`, `CLOSED`, `NOTFIXED`

예:

```json
"type": "OPEN"
```

`NOTFIXED`는 단일한 `OPEN` 또는 `CLOSED`로 표현하기 어려운 경우에 사용한다.  
예를 들어 기본적으로 비공개지만 마지막 주만 공개인 모임처럼,  
현재 MVP의 단순 일정 모델로는 세부 규칙을 충분히 표현할 수 없을 때 사용한다.

### Time

- 문자열
- `HH:mm` 형식 사용

예:

```json
"startTime": "19:30"
```

### Location Fields

현재 구현은 위치 정보를 `Meeting`이 직접 가진다.

```json
"province": "seoul",
"locationDetail": "강남역 인근",
"locationAddress": "서울특별시 강남구 테헤란로 123",
"latitude": 37.4979,
"longitude": 127.0276
```

현재는 아래 항목을 위치 필드로 사용하지 않는다.

- `Group.locationDetail`
- `Group.locationAddress`
- `Meeting.meetingPlaceNote`

### Phone

- 문자열
- 저장 전 정규화 여부는 구현체에서 결정할 수 있다
- 빈 값 불가

---

## 구현 시 유의사항

### 1. 삭제보다 상태 전환을 우선한다

현재 MVP에서는 `Meeting.active` 또는 `published` 갱신을 우선한다.  
다만 현재 운영 화면에서 실제로 쓰는 범위에 한해 제한적 `DELETE` API도 함께 유지한다.

### 2. 공개 응답은 최소 정보만 노출한다

운영 관리에 필요한 내부 정보는 공개 API에 포함하지 않는다.

### 3. 대표 연락처 규칙은 현재 구현 기준으로 본다

현재 구현 기준:

- 관리자 UI는 그룹당 연락처 1건만 허용한다
- 공개 상세의 그룹 대표 번호는 `id` 오름차순 첫 `GroupContact`를 사용한다
- 다만 실제 전화 연결은 `Meeting.contactPhoneOverride ?? GroupContact.phone` 규칙을 따른다

### 4. DTO는 API 계약 기준으로 별도 설계한다

엔티티 구조를 그대로 외부에 노출하지 않는 것을 기본 원칙으로 한다.
