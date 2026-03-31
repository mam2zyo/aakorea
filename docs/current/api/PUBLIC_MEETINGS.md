<!-- docs/current/api/PUBLIC_MEETINGS.md -->

# API_PUBLIC_MEETINGS

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 공개 `Meeting` 조회 API 계약을 정의한다.

이 문서가 답하는 질문:

- 방문자는 지역 기준으로 어떻게 모임을 조회하는가?
- 공개 모임 상세는 어떤 정보를 반환하는가?
- 공개 조회에서 어떤 기본 검증과 노출 규칙을 적용하는가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 운영용 `Meeting` 관리 API
- `Meeting` 도메인 채택 이유
- 복잡한 일정 모델

공통 규약은 `COMMON.md`를 따른다.

---

## 공개 API

공개 API는 방문자의 정보 탐색을 위한 조회 전용 API다.

### 1. Meeting 목록 조회

## GET `/api/public/meetings`

지역 기준으로 모임 목록을 조회한다.

### Query Params

- `province` (required)
- `dayOfWeek` (optional)

### Response 200

```json
{
  "data": [
    {
      "id": 100,
      "groupId": 20,
      "groupName": "강남그룹",
      "province": "seoul",
      "dayOfWeek": "MONDAY",
      "startTime": "19:30",
      "type": "OPEN",
      "location": {
        "name": "강남역 인근",
        "address": "서울특별시 강남구 테헤란로 123"
      }
    }
  ]
}
```

### 기본 검증

- `province`는 필수
- `province`는 허용값 내에 있어야 한다
- `dayOfWeek`가 있으면 허용값 내에 있어야 한다
- 공개 조회에서는 `active=true`인 Meeting만 반환

### 비고

현재 MVP에서 공개 탐색의 중심은 `Meeting`이다.  
모델 배경은 `../DOMAIN_MODEL.md`를 따른다.

---

### 2. Meeting 단건 조회

## GET `/api/public/meetings/{id}`

모임 상세를 조회한다.

### Path Params

- `id`: Meeting 식별자

### Response 200

```json
{
  "data": {
    "id": 100,
    "groupId": 20,
    "groupName": "강남그룹",
    "province": "seoul",
    "dayOfWeek": "MONDAY",
    "startTime": "19:30",
    "type": "OPEN",
    "location": {
      "name": "강남역 인근",
      "address": "서울특별시 강남구 테헤란로 123"
    },
    "contactPhone": "02-1234-5678"
  }
}
```

### 기본 규칙

- 공개 조회에서는 `active=true`인 Meeting만 반환
- 연락 가능한 번호는 현재 등록된 GroupContact를 기준으로 반환
- 사용할 대표 연락처 선택 방식은 구현에서 결정한다

### 기본 검증

- `id`는 숫자 형식
- 대상 없으면 404 반환
