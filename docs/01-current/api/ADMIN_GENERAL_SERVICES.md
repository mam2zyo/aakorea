<!-- docs/current/api/ADMIN_GENERAL_SERVICES.md -->

# API_ADMIN_GENERAL_SERVICES

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 운영 `generalservice` 계열 API 계약을 정의한다.  
현재 이 범위에는 `District` API만 포함한다.

이 문서가 답하는 질문:

- 운영자는 `District`를 어떻게 관리하는가?
- 각 조회/생성/수정/삭제 API는 어떤 요청과 응답을 갖는가?
- 기본 검증은 무엇인가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 운영 인증 API
- 운영 `Group`, `GroupContact`, `Meeting` 관리 API
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
      "name": "서울"
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
  "name": "서울"
}
```

### Response 201

```json
{
  "data": {
    "id": 1,
    "name": "서울"
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
  "name": "서울동부"
}
```

### Response 200

```json
{
  "data": {
    "id": 1,
    "name": "서울동부"
  }
}
```

---

### 4. District 삭제

## DELETE `/api/admin/districts/{id}`

District를 삭제한다.

### Response 204

응답 본문 없이 종료한다.

### 기본 규칙

- 연결된 `Group`이 있으면 409를 반환한다
- 대상이 없으면 404를 반환한다
