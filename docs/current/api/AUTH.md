<!-- docs/current/api/AUTH.md -->

# API_AUTH

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 운영 인증 API 계약을 정의한다.

이 문서가 답하는 질문:

- 운영자 로그인 API는 어떤 요청과 응답을 갖는가?
- 로그아웃과 현재 세션 확인은 어떻게 동작하는가?
- 인증 실패 시 어떤 응답을 반환하는가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 공개 API와 운영 API 전체 목록
- 인증 구현체의 내부 상세
- 운영 권한 세분화 정책

공통 규약은 `COMMON.md`를 따른다.

---

## 인증 API

현재 MVP는 운영자의 최소 인증 흐름만 포함한다.

### 1. 로그인

## POST `/api/auth/login`

운영자 로그인을 수행한다.

### Request Body

```json
{
  "username": "admin",
  "password": "password"
}
```

### Response 200

```json
{
  "data": {
    "authenticated": true,
    "username": "admin"
  }
}
```

### 기본 검증

- `username` 필수
- `password` 필수
- 인증 실패 시 401 반환

---

### 2. 로그아웃

## POST `/api/auth/logout`

현재 인증 세션을 종료한다.

### Response 200

```json
{
  "data": {
    "success": true
  }
}
```

---

### 3. 현재 세션 확인

## GET `/api/auth/me`

현재 로그인한 운영자 정보를 조회한다.

### Response 200

```json
{
  "data": {
    "authenticated": true,
    "username": "admin"
  }
}
```

### 미인증 Response 401

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "authentication required"
  }
}
```
