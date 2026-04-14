<!-- docs/current/api/ADMIN_CONTENT.md -->

# API_ADMIN_CONTENT

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 운영 콘텐츠 관리 API 계약을 정의한다.

이 문서가 답하는 질문:

- 운영자는 `ContentPage`, `Notice`를 어떻게 관리하는가?
- 각 조회/생성/수정/삭제 API는 어떤 요청과 응답을 갖는가?
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
      "originalFileName": "guide.html",
      "published": true
    }
  ]
}
```

---

### 2. ContentPage 업로드 및 생성

## POST `/api/admin/content-pages/upload`

새로운 ContentPage를 생성하거나 HTML 본문 파일을 업로드한다. (Multipart/FormData 방식)

### Request Parts

- `key`: (String) 페이지 식별 키 (필수)
- `title`: (String) 페이지 제목 (필수)
- `published`: (boolean) 공개 여부 (선택, 기본값 false)
- `file`: (File) HTML 본문 파일 (필수)

### Response 200

```json
{
  "data": {
    "id": 1,
    "key": "first-visitor-guide",
    "title": "처음 오신 분 안내",
    "published": true,
    "originalFileName": "guide.html",
    "attachments": []
  }
}
```

### 기본 검증

- `key`, `title`, `file` 필수
- `key` 중복 불가 (중복 시 CONFLICT 발생)

---

### 3. ContentPage 상세 조회

## GET `/api/admin/content-pages/{id}`

편집용 ContentPage 단건 상세를 조회한다. (본문은 포함되지 않음)

### Response 200

```json
{
  "data": {
    "id": 1,
    "key": "first-visitor-guide",
    "title": "처음 오신 분 안내",
    "originalFileName": "guide.html",
    "published": true
  }
}
```

---

### 4. ContentPage 수정

## POST `/api/admin/content-pages/{id}`

ContentPage의 메타데이터를 수정하거나 파일을 업데이트한다. (Multipart/FormData 방식)

### Request Parts

- `key`: (String) 수정할 키
- `title`: (String) 수정할 제목
- `published`: (boolean) 수정할 공개 여부
- `file`: (File) 교체할 HTML 본문 파일 (선택)

### Response 200

```json
{
  "data": {
    "id": 1,
    "key": "updated-key",
    "title": "수정된 제목",
    "originalFileName": "new-guide.html",
    "published": true
  }
}
```

---

### 5. ContentPage 메타데이터 전용 수정

## PATCH `/api/admin/content-pages/{id}/metadata`

파일 업로드 없이 메타데이터(Key, Title, Published)만 수정할 때 사용한다. (JSON 방식)

### Request Body

```json
{
  "key": "updated-key",
  "title": "수정된 제목",
  "published": true
}
```

---

### 6. ContentPage 삭제

## DELETE `/api/admin/content-pages/{id}`

ContentPage 엔티티와 해당 HTML 파일을 물리적으로 삭제한다.

### Response 204

응답 본문 없이 종료한다.

---

### 7. Notice 목록 조회

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

### 8. Notice 상세 조회

## GET `/api/admin/notices/{id}`

편집용 Notice 단건 상세를 조회한다.

### Response 200

```json
{
  "data": {
    "id": 10,
    "title": "공지 제목",
    "bodyHtml": "공지 본문 HTML",
    "bodyJson": "공지 본문 JSON",
    "published": true,
    "publishedAt": "2026-03-30T09:00:00"
  }
}
```

---

### 9. Notice 생성

## POST `/api/admin/notices`

Notice를 생성한다. (JSON 방식)

### Request Body

```json
{
  "title": "공지 제목",
  "bodyHtml": "공지 본문 HTML",
  "bodyJson": "공지 본문 JSON",
  "attachmentIds": [10, 11],
  "published": true,
  "publishedAt": "2026-03-30T09:00:00"
}
```

---

### 10. Notice 수정

## PUT `/api/admin/notices/{id}`

Notice를 수정한다. (JSON 방식)

---

### 11. Notice 삭제

## DELETE `/api/admin/notices/{id}`

Notice를 삭제한다.
