<!-- docs/current/API_DRAFT.md -->

# API_DRAFT

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 필요한 **API 계약 초안**을 정의한다.

이 문서가 답하는 질문:

- 어떤 API 엔드포인트가 필요한가?
- 각 API는 어떤 요청을 받고 어떤 응답을 반환하는가?
- 어떤 API가 인증을 요구하는가?
- 어떤 수준의 기본 검증이 필요한가?

이 문서에 포함하지 않는 내용:

- 제품 범위의 상세 판단
- 사용자별 목표와 행동 흐름
- 도메인 개체의 의미와 관계 설명
- 엔티티별 최소 필드의 장문 설명
- 구현 단계별 작업 순서

## API 설계 원칙

### 1. 공개 API와 운영 API를 분리한다

- 공개 조회용 API는 `/api/public/*`
- 인증이 필요한 운영 API는 `/api/admin/*`
- 인증 API는 `/api/auth/*`

### 2. 현재 MVP에 필요한 최소 계약만 둔다

- 조회
- 생성
- 수정
- 활성/게시 상태 변경
- 로그인/로그아웃/세션 확인

### 3. 응답 구조는 단순하게 유지한다

목록 응답과 단건 응답은 가능한 한 일관된 구조를 사용한다.

### 4. 필드 의미의 원본은 `MVP_FIELDS.md`를 따른다

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

현재 MVP에서는 삭제보다 `active` / `published` 전환을 우선한다.
따라서 물리 삭제 API는 필수로 두지 않는다.

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

### Time

- 문자열
- `HH:mm` 형식 사용

예:

```json
"startTime": "19:30"
```

### Phone

- 문자열
- 저장 전 정규화 여부는 구현체에서 결정할 수 있다
- 빈 값 불가

---

## 공개 API

공개 API는 방문자의 정보 탐색을 위한 조회 전용 API다.

---

### 1. ContentPage 조회

## GET `/api/public/content-pages/{key}`

정적 안내성 페이지를 조회한다.

### Path Params

- `key`: 페이지 고정 식별 키

### Response 200

```json
{
  "data": {
    "id": 1,
    "key": "first-visitor-guide",
    "title": "처음 오신 분 안내",
    "body": "페이지 본문"
  }
}
```

### 기본 검증

- `key`는 필수
- 공개 조회에서는 `published=true`인 데이터만 반환
- 없으면 404 반환

---

### 2. Notice 목록 조회

## GET `/api/public/notices`

공개된 공지 목록을 조회한다.

### Query Params

- `page` (optional)
- `size` (optional)

현재 MVP에서는 페이지네이션 없이 단순 목록으로 시작할 수 있다.

### Response 200

```json
{
  "data": [
    {
      "id": 10,
      "title": "공지 제목",
      "publishedAt": "2026-03-30T09:00:00"
    }
  ]
}
```

### 기본 규칙

- `published=true`인 데이터만 반환
- 기본 정렬은 `publishedAt desc`

---

### 3. Notice 단건 조회

## GET `/api/public/notices/{id}`

공개된 공지 상세를 조회한다.

### Path Params

- `id`: Notice 식별자

### Response 200

```json
{
  "data": {
    "id": 10,
    "title": "공지 제목",
    "body": "공지 본문",
    "publishedAt": "2026-03-30T09:00:00"
  }
}
```

### 기본 검증

- `id`는 숫자 형식
- `published=true`인 데이터만 반환
- 없으면 404 반환

---

### 4. Meeting 목록 조회

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
      "placeName": "강남역 인근"
    }
  ]
}
```

### 기본 검증

- `province`는 필수
- `province`는 허용값 내에 있어야 한다
- `dayOfWeek`가 있으면 허용값 내에 있어야 한다
- 공개 조회에서는 `active=true`인 Meeting만 반환
- 연결된 Group이 비활성인 경우의 처리 방식은 구현에서 정하되, 기본적으로 공개 노출 대상이 아니어야 한다

### 비고

현재 MVP에서 공개 탐색의 중심은 `Meeting`이다.
모델 배경은 `DOMAIN_MODEL.md`를 따른다.

---

### 5. Meeting 단건 조회

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
    "placeName": "강남역 인근",
    "contactPhone": "02-1234-5678"
  }
}
```

### 기본 규칙

- 공개 조회에서는 `active=true`인 Meeting만 반환
- 연락 가능한 번호는 현재 사용 가능한 GroupContact를 기준으로 반환
- 사용할 대표 연락처 선택 방식은 구현에서 결정한다

### 기본 검증

- `id`는 숫자 형식
- 대상 없으면 404 반환

---

## 인증 API

현재 MVP는 운영자의 최소 인증 흐름만 포함한다.

---

### 6. 로그인

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

### 7. 로그아웃

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

### 8. 현재 세션 확인

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

---

## 운영 API

운영 API는 인증이 필요한 관리용 API다.

---

### 9. District 목록 조회

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

### 10. District 생성

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

### 11. District 수정

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

### 12. Group 목록 조회

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

### 13. Group 생성

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

### 14. Group 수정

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

### 15. GroupContact 목록 조회

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

### 16. GroupContact 생성

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

### 17. GroupContact 수정

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

---

### 18. Meeting 목록 조회

## GET `/api/admin/meetings`

Meeting 목록을 조회한다.

### Query Params

- `groupId` (optional)
- `province` (optional)
- `active` (optional)

### Response 200

```json
{
  "data": [
    {
      "id": 100,
      "groupId": 20,
      "province": "seoul",
      "dayOfWeek": "MONDAY",
      "startTime": "19:30",
      "placeName": "강남역 인근",
      "active": true
    }
  ]
}
```

---

### 19. Meeting 생성

## POST `/api/admin/meetings`

Meeting을 생성한다.

### Request Body

```json
{
  "groupId": 20,
  "province": "seoul",
  "dayOfWeek": "MONDAY",
  "startTime": "19:30",
  "placeName": "강남역 인근",
  "active": true
}
```

### Response 201

```json
{
  "data": {
    "id": 100,
    "groupId": 20,
    "province": "seoul",
    "dayOfWeek": "MONDAY",
    "startTime": "19:30",
    "placeName": "강남역 인근",
    "active": true
  }
}
```

### 기본 검증

- `groupId` 필수
- `province` 필수
- `dayOfWeek` 필수
- `startTime` 필수
- `placeName` 필수
- `province` 허용값 검증
- `dayOfWeek` 허용값 검증
- `startTime` 형식 검증
- 참조 대상 Group이 존재해야 한다

---

### 20. Meeting 수정

## PUT `/api/admin/meetings/{id}`

Meeting을 수정한다.

### Request Body

```json
{
  "groupId": 20,
  "province": "seoul",
  "dayOfWeek": "TUESDAY",
  "startTime": "20:00",
  "placeName": "역삼역 인근",
  "active": true
}
```

### Response 200

```json
{
  "data": {
    "id": 100,
    "groupId": 20,
    "province": "seoul",
    "dayOfWeek": "TUESDAY",
    "startTime": "20:00",
    "placeName": "역삼역 인근",
    "active": true
  }
}
```

---

### 21. ContentPage 목록 조회

## GET `/api/admin/content-pages`

ContentPage 목록을 조회한다.

### Response 200

```json
{
  "data": [
    {
      "id": 1,
      "key": "first-visitor-guide",
      "title": "처음 오신 분 안내",
      "published": true
    }
  ]
}
```

---

### 22. ContentPage 생성

## POST `/api/admin/content-pages`

ContentPage를 생성한다.

### Request Body

```json
{
  "key": "first-visitor-guide",
  "title": "처음 오신 분 안내",
  "body": "페이지 본문",
  "published": true
}
```

### Response 201

```json
{
  "data": {
    "id": 1,
    "key": "first-visitor-guide",
    "title": "처음 오신 분 안내",
    "body": "페이지 본문",
    "published": true
  }
}
```

### 기본 검증

- `key` 필수
- `title` 필수
- `body` 필수
- `key`는 중복 불가

---

### 23. ContentPage 수정

## PUT `/api/admin/content-pages/{id}`

ContentPage를 수정한다.

### Request Body

```json
{
  "key": "first-visitor-guide",
  "title": "처음 오신 분 안내",
  "body": "수정된 본문",
  "published": true
}
```

### Response 200

```json
{
  "data": {
    "id": 1,
    "key": "first-visitor-guide",
    "title": "처음 오신 분 안내",
    "body": "수정된 본문",
    "published": true
  }
}
```

---

### 24. Notice 목록 조회

## GET `/api/admin/notices`

Notice 목록을 조회한다.

### Response 200

```json
{
  "data": [
    {
      "id": 10,
      "title": "공지 제목",
      "published": true,
      "publishedAt": "2026-03-30T09:00:00"
    }
  ]
}
```

---

### 25. Notice 생성

## POST `/api/admin/notices`

Notice를 생성한다.

### Request Body

```json
{
  "title": "공지 제목",
  "body": "공지 본문",
  "published": true,
  "publishedAt": "2026-03-30T09:00:00"
}
```

### Response 201

```json
{
  "data": {
    "id": 10,
    "title": "공지 제목",
    "body": "공지 본문",
    "published": true,
    "publishedAt": "2026-03-30T09:00:00"
  }
}
```

### 기본 검증

- `title` 필수
- `body` 필수
- `publishedAt`는 게시 시점 정렬에 필요한 값
- 게시 상태가 `true`인 경우 `publishedAt` 필수로 강제할 수 있다

---

### 26. Notice 수정

## PUT `/api/admin/notices/{id}`

Notice를 수정한다.

### Request Body

```json
{
  "title": "수정된 공지 제목",
  "body": "수정된 공지 본문",
  "published": true,
  "publishedAt": "2026-03-31T09:00:00"
}
```

### Response 200

```json
{
  "data": {
    "id": 10,
    "title": "수정된 공지 제목",
    "body": "수정된 공지 본문",
    "published": true,
    "publishedAt": "2026-03-31T09:00:00"
  }
}
```

---

## 최소 운영 화면 기준으로 필요한 API 요약

현재 MVP에서 우선 필요한 API를 요약하면 아래와 같다.

### 공개

- `GET /api/public/content-pages/{key}`
- `GET /api/public/notices`
- `GET /api/public/notices/{id}`
- `GET /api/public/meetings`
- `GET /api/public/meetings/{id}`

### 인증

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### 운영

- `GET /api/admin/districts`

- `POST /api/admin/districts`

- `PUT /api/admin/districts/{id}`

- `GET /api/admin/groups`

- `POST /api/admin/groups`

- `PUT /api/admin/groups/{id}`

- `GET /api/admin/group-contacts`

- `POST /api/admin/group-contacts`

- `PUT /api/admin/group-contacts/{id}`

- `GET /api/admin/meetings`

- `POST /api/admin/meetings`

- `PUT /api/admin/meetings/{id}`

- `GET /api/admin/content-pages`

- `POST /api/admin/content-pages`

- `PUT /api/admin/content-pages/{id}`

- `GET /api/admin/notices`

- `POST /api/admin/notices`

- `PUT /api/admin/notices/{id}`

---

## 현재 보류하는 API

아래 API는 현재 MVP의 직접 범위에 포함하지 않는다.

### 1. 일반 사용자 계정 API

- 회원가입
- 사용자 로그인
- 비밀번호 재설정
- 마이페이지

### 2. 복잡한 권한 관리 API

- 역할별 운영자 권한 관리
- 승인 워크플로우
- 세분 권한 매트릭스

### 3. 범용 게시판 API

- 게시글
- 댓글
- 첨부파일
- 커뮤니티 상호작용

### 4. 고급 탐색 API

- 복합 검색
- 추천
- 즐겨찾기
- 개인화 피드

### 5. 미디어 자산 API

- 이미지 업로드
- 파일 라이브러리
- 첨부 재사용 관리

---

## 구현 시 유의사항

### 1. 삭제보다 상태 전환을 우선한다

현재 MVP에서는 `DELETE` API보다 `active` / `published` 갱신을 우선할 수 있다.

### 2. 공개 응답은 최소 정보만 노출한다

운영 관리에 필요한 내부 정보는 공개 API에 포함하지 않는다.

### 3. 대표 연락처 선택 규칙은 구현에서 명확히 정한다

공개 `Meeting` 상세에서 어떤 `GroupContact`를 노출할지는 서비스 계층에서 일관되게 처리한다.

### 4. DTO는 API 계약 기준으로 별도 설계한다

엔티티 구조를 그대로 외부에 노출하지 않는 것을 기본 원칙으로 한다.
