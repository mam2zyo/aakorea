<!-- docs/current/api/ADMIN_CONTENT.md -->

# API_ADMIN_CONTENT

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 운영 콘텐츠 관리 API 계약을 정의한다.

이 문서가 답하는 질문:

- 운영자는 `ContentPage`, `Notice`를 어떻게 관리하는가?
- 각 생성/수정 API는 어떤 요청과 응답을 갖는가?
- 기본 검증은 무엇인가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 공개 콘텐츠 조회 API
- 콘텐츠 모델 채택 이유
- 구현 단계별 작업 순서

공통 규약은 `COMMON.md`를 따른다.

---

## 운영 API

운영 API는 인증이 필요한 관리용 API다.

### 1. ContentPage 목록 조회

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

### 2. ContentPage 생성

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

### 3. ContentPage 상세 조회

## GET `/api/admin/content-pages/{id}`

편집용 ContentPage 단건 상세를 조회한다.

### Response 200

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

---

### 4. ContentPage 수정

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

### 5. Notice 목록 조회

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

### 6. Notice 상세 조회

## GET `/api/admin/notices/{id}`

편집용 Notice 단건 상세를 조회한다.

### Response 200

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

---

### 7. Notice 생성

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
- 게시 상태가 `true`인 경우 `publishedAt` 필수

---

### 8. Notice 수정

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
