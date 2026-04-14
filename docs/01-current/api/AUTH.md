<!-- docs/current/api/AUTH.md -->

# API_AUTH

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 운영 인증 API 계약을 정의한다.

이 문서가 답하는 질문:

- 운영자 로그인 API는 어떤 요청과 응답을 갖는가?
- GSO Staff 등록 API는 어떤 요청과 응답을 갖는가?
- 로그아웃과 현재 세션 확인은 어떻게 동작하는가?
- 인증 실패 시 어떤 응답을 반환하는가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 공개 API와 운영 API 전체 목록
- 인증 구현체의 내부 상세
- 운영 권한 세분화 정책

공통 규약은 `COMMON.md`를 따른다.
운영 권한 규칙과 관리자 메뉴/API permission 매핑은 `ADMIN_AUTHORIZATION.md`를 따른다.

---

## 인증 API

현재 구현은 세션 기반 운영 인증을 사용하며,
`email + password` 로그인과 `GSO Staff 등록 -> Manager 승인` 흐름을 지원한다.
응답에는 화면 제어에 필요한 최소 운영자 메타데이터를 함께 포함한다.

운영 계정의 상태값은 다음 3가지를 사용한다.

- `PENDING_APPROVAL`: 등록은 완료되었지만 아직 승인 전
- `ACTIVE`: 로그인 가능, permission 기준으로 업무 수행 가능
- `SUSPENDED`: 로그인 중지

### 1. 로그인

## POST `/api/auth/login`

운영자 로그인을 수행한다.

### Request Body

```json
{
  "email": "staff@aakorea.org",
  "password": "password"
}
```

### Response 200

```json
{
  "data": {
    "authenticated": true,
    "userId": 1,
    "email": "admin@aakorea.org",
    "username": "admin@aakorea.org",
    "displayName": "System Administrator",
    "role": "SYSTEM_ADMIN",
    "status": "ACTIVE",
    "permissions": [
      "self.preferences.manage",
      "group.manage",
      "content.publish"
    ]
  }
}
```

### 기본 검증

- `email` 필수
- `password` 필수
- 인증 실패 시 401 반환

---

### 2. GSO Staff 등록

## POST `/api/auth/register`

신규 office 운영 계정을 등록한다.

등록 직후 계정은 `STAFF + PENDING_APPROVAL` 상태로 생성되며,
업무 메뉴는 Manager 승인 후 열리게 된다.

### Request Body

```json
{
  "email": "staff@aakorea.org",
  "displayName": "홍길동",
  "password": "password"
}
```

### Response 200

```json
{
  "data": {
    "userId": 10,
    "email": "staff@aakorea.org",
    "displayName": "홍길동",
    "role": "STAFF",
    "status": "PENDING_APPROVAL"
  }
}
```

### 기본 검증

- `email` 필수, 이메일 형식 검증
- `displayName` 필수
- `password` 필수
- 이미 등록된 이메일이면 409 반환

---

### 3. 로그아웃

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

### 4. 현재 세션 확인

## GET `/api/auth/me`

현재 로그인한 운영자 정보를 조회한다.

### Response 200

```json
{
  "data": {
    "authenticated": true,
    "userId": 1,
    "email": "admin@aakorea.org",
    "username": "admin@aakorea.org",
    "displayName": "System Administrator",
    "role": "SYSTEM_ADMIN",
    "status": "ACTIVE",
    "permissions": [
      "self.preferences.manage",
      "group.manage",
      "content.publish"
    ]
  }
}
```

### 현재 규칙

- 응답의 `userId`는 운영자 계정의 내부 식별자다
- `email`은 현재 로그인 식별자다
- `role`은 현재 사용자의 단일 운영 역할이다
- `status`가 `PENDING_APPROVAL`이면 로그인은 가능하지만 업무 메뉴 대신 승인 대기 화면만 표시한다
- `permissions`는 role 기본 권한과 추가 grant를 합친 최종 effective permission 목록이다
- 단, `PENDING_APPROVAL` 또는 `SUSPENDED` 상태에서는 effective permission을 빈 목록으로 반환한다
- 프론트는 이 값을 사용해 메뉴 노출과 버튼 상태를 조정할 수 있다

### 미인증 Response 401

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "authentication required"
  }
}
```
