<!-- docs/current/api/ADMIN_ORG.md -->

# API_ADMIN_ORG

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 운영 조직 관련 API 계약을 정의한다.

이 문서가 답하는 질문:

- 운영자는 `District`, `Group`, `GroupContact`를 어떻게 관리하는가?
- 각 생성/수정 API는 어떤 요청과 응답을 갖는가?
- 기본 검증은 무엇인가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 운영 인증 API
- 운영 `Meeting` 관리 API
- 도메인 채택 이유

공통 규약은 `COMMON.md`를 따른다.

---

## 운영 API

운영 API는 인증이 필요한 관리용 API다.

### 1. District 목록 조회

## GET `/api/admin/districts`

District 목록을 조회한다.

### Response 200

```json
{
  "data": [
    {
      "id": 1,
      "name": "서울",
      "active": true
    }
  ]
}
```

---

### 2. District 생성

## POST `/api/admin/districts`

District를 생성한다.

### Request Body

```json
{
  "name": "서울",
  "active": true
}
```

### Response 201

```json
{
  "data": {
    "id": 1,
    "name": "서울",
    "active": true
  }
}
```

### 기본 검증

- `name` 필수
- `name` 공백 불가

---

### 3. District 수정

## PUT `/api/admin/districts/{id}`

District를 수정한다.

### Request Body

```json
{
  "name": "서울동부",
  "active": true
}
```

### Response 200

```json
{
  "data": {
    "id": 1,
    "name": "서울동부",
    "active": true
  }
}
```

---

### 4. Group 목록 조회

## GET `/api/admin/groups`

Group 목록을 조회한다.

### Query Params

- `districtId` (optional)
- `active` (optional)

### Response 200

```json
{
  "data": [
    {
      "id": 20,
      "districtId": 1,
      "name": "강남그룹",
      "active": true
    }
  ]
}
```

---

### 5. Group 생성

## POST `/api/admin/groups`

Group을 생성한다.

### Request Body

```json
{
  "districtId": 1,
  "name": "강남그룹",
  "active": true
}
```

### Response 201

```json
{
  "data": {
    "id": 20,
    "districtId": 1,
    "name": "강남그룹",
    "active": true
  }
}
```

### 기본 검증

- `districtId` 필수
- `name` 필수
- 참조 대상 District가 존재해야 한다

---

### 6. Group 수정

## PUT `/api/admin/groups/{id}`

Group을 수정한다.

### Request Body

```json
{
  "districtId": 1,
  "name": "강남그룹",
  "active": false
}
```

### Response 200

```json
{
  "data": {
    "id": 20,
    "districtId": 1,
    "name": "강남그룹",
    "active": false
  }
}
```

---

### 7. GroupContact 목록 조회

## GET `/api/admin/group-contacts`

GroupContact 목록을 조회한다.

### Query Params

- `groupId` (optional)
- `active` (optional)

### Response 200

```json
{
  "data": [
    {
      "id": 30,
      "groupId": 20,
      "phone": "02-1234-5678",
      "active": true
    }
  ]
}
```

---

### 8. GroupContact 생성

## POST `/api/admin/group-contacts`

GroupContact를 생성한다.

### Request Body

```json
{
  "groupId": 20,
  "phone": "02-1234-5678",
  "active": true
}
```

### Response 201

```json
{
  "data": {
    "id": 30,
    "groupId": 20,
    "phone": "02-1234-5678",
    "active": true
  }
}
```

### 기본 검증

- `groupId` 필수
- `phone` 필수
- `phone` 공백 불가
- 참조 대상 Group이 존재해야 한다

---

### 9. GroupContact 수정

## PUT `/api/admin/group-contacts/{id}`

GroupContact를 수정한다.

### Request Body

```json
{
  "phone": "02-9876-5432",
  "active": true
}
```

### Response 200

```json
{
  "data": {
    "id": 30,
    "groupId": 20,
    "phone": "02-9876-5432",
    "active": true
  }
}
```
