<!-- docs/current/api/ADMIN_GROUPS.md -->

# API_ADMIN_GROUPS

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 운영 `Group`, `GroupContact` API 계약을 정의한다.

이 문서가 답하는 질문:

- 운영자는 `Group`, `GroupContact`를 어떻게 관리하는가?
- 각 조회/생성/수정/삭제 API는 어떤 요청과 응답을 갖는가?
- 기본 검증은 무엇인가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 운영 인증 API
- 운영 `District`, `Meeting` 관리 API
- 도메인 채택 이유

공통 규약은 `COMMON.md`를 따른다.

---

## 운영 API

운영 API는 인증이 필요한 관리용 API다.

### 1. Group 목록 조회

## GET `/api/admin/groups`

Group 목록을 조회한다.

### Query Params

- `districtId` (optional)

### Response 200

```json
{
  "data": [
    {
      "id": 20,
      "districtId": 1,
      "name": "강남그룹",
      "locationName": "번동3단지 종합사회복지관 지하강당",
      "locationAddress": "서울 강북구 오현로 208",
      "introduction": "처음 오신 분도 편하게 문의하실 수 있습니다.",
      "notice": "공휴일 운영 여부는 대표 연락처로 먼저 확인해 주세요.",
      "changeSummary": "최근 장소 변경 없음"
    }
  ]
}
```

---

### 2. Group 생성

## POST `/api/admin/groups`

Group을 생성한다.

### Request Body

```json
{
  "districtId": 1,
  "name": "강남그룹",
  "locationName": "번동3단지 종합사회복지관 지하강당",
  "locationAddress": "서울 강북구 오현로 208",
  "introduction": "처음 오신 분도 편하게 문의하실 수 있습니다.",
  "notice": "공휴일 운영 여부는 대표 연락처로 먼저 확인해 주세요.",
  "changeSummary": "최근 장소 변경 없음"
}
```

### Response 201

```json
{
  "data": {
    "id": 20,
    "districtId": 1,
    "name": "강남그룹",
    "locationName": "번동3단지 종합사회복지관 지하강당",
    "locationAddress": "서울 강북구 오현로 208",
    "introduction": "처음 오신 분도 편하게 문의하실 수 있습니다.",
    "notice": "공휴일 운영 여부는 대표 연락처로 먼저 확인해 주세요.",
    "changeSummary": "최근 장소 변경 없음"
  }
}
```

### 기본 검증

- `districtId` 필수
- `name` 필수
- `locationName`, `locationAddress`는 함께 입력하거나 함께 비워 둔다
- 참조 대상 District가 존재해야 한다

---

### 3. Group 수정

## PUT `/api/admin/groups/{id}`

Group을 수정한다.

### Request Body

```json
{
  "districtId": 1,
  "name": "강남그룹",
  "locationName": "번동3단지 종합사회복지관 지하강당",
  "locationAddress": "서울 강북구 오현로 208",
  "introduction": "처음 오신 분도 편하게 문의하실 수 있습니다.",
  "notice": "공휴일 운영 여부는 대표 연락처로 먼저 확인해 주세요.",
  "changeSummary": "최근 장소 변경 없음"
}
```

### Response 200

```json
{
  "data": {
    "id": 20,
    "districtId": 1,
    "name": "강남그룹",
    "locationName": "번동3단지 종합사회복지관 지하강당",
    "locationAddress": "서울 강북구 오현로 208",
    "introduction": "처음 오신 분도 편하게 문의하실 수 있습니다.",
    "notice": "공휴일 운영 여부는 대표 연락처로 먼저 확인해 주세요.",
    "changeSummary": "최근 장소 변경 없음"
  }
}
```

---

### 4. Group 삭제

## DELETE `/api/admin/groups/{id}`

Group을 삭제한다.

### Response 204

응답 본문 없이 종료한다.

### 기본 규칙

- 연결된 `GroupContact` 또는 `Meeting`이 있으면 409를 반환한다
- 대상이 없으면 404를 반환한다

---

### 5. GroupContact 목록 조회

## GET `/api/admin/group-contacts`

GroupContact 목록을 조회한다.

### Query Params

- `groupId` (optional)

### Response 200

```json
{
  "data": [
    {
      "id": 30,
      "groupId": 20,
      "phone": "02-1234-5678"
    }
  ]
}
```

---

### 6. GroupContact 생성

## POST `/api/admin/group-contacts`

GroupContact를 생성한다.

### Request Body

```json
{
  "groupId": 20,
  "phone": "02-1234-5678"
}
```

### Response 201

```json
{
  "data": {
    "id": 30,
    "groupId": 20,
    "phone": "02-1234-5678"
  }
}
```

### 기본 검증

- `groupId` 필수
- `phone` 필수
- `phone` 공백 불가
- 참조 대상 Group이 존재해야 한다

---

### 7. GroupContact 수정

## PUT `/api/admin/group-contacts/{id}`

GroupContact를 수정한다.

### Request Body

```json
{
  "phone": "02-9876-5432"
}
```

### Response 200

```json
{
  "data": {
    "id": 30,
    "groupId": 20,
    "phone": "02-9876-5432"
  }
}
```

### 기본 규칙

- 현재 구현에는 `GroupContact` 삭제 API가 없다
- 대상이 없으면 404를 반환한다
