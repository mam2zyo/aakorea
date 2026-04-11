<!-- docs/current/api/PUBLIC_CONTENT.md -->

# API_PUBLIC_CONTENT

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 공개 콘텐츠 조회 API 계약을 정의한다.

이 문서가 답하는 질문:

- 공개 `ContentPage`는 어떻게 조회하는가?
- 공개 `Notice` 목록과 상세는 어떻게 조회하는가?
- 공개 콘텐츠는 어떤 조건으로 노출되는가?

---

## 공개 API

공개 API는 방문자의 정보 탐색을 위한 조회 전용 API다.

### 1. ContentPage 조회

## GET `/api/public/content-pages/{key}`

정적 안내성 페이지를 조회한다. 본문 내용은 서버의 파일 시스템에서 로드된다.

### Path Params

- `key`: 페이지 고정 식별 키 (URL 슬러그)

### Response 200

```json
{
  "data": {
    "id": 1,
    "key": "first-visitor-guide",
    "title": "처음 오신 분 안내",
    "bodyHtml": "<h1>페이지 본문 HTML</h1>",
    "attachments": []
  }
}
```

> [!NOTE]
> `bodyHtml` 필드는 DB가 아닌 서버의 물리적 파일 시스템(`.html`)에서 읽어온 문자열입니다.

### 기본 검증

- `key`는 필수
- 공개 조회에서는 `published=true`인 데이터만 반환
- 해당하는 키의 파일이나 DB 레코드가 없으면 404 반환

---

### 2. Notice 목록 조회

## GET `/api/public/notices`

공개된 공지 목록을 조회한다.

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

---

### 3. Notice 단건 조회

## GET `/api/public/notices/{id}`

공개된 공지 상세를 조회한다.

### Response 200

```json
{
  "data": {
    "id": 10,
    "title": "공지 제목",
    "bodyHtml": "공지 본문 HTML",
    "publishedAt": "2026-03-30T09:00:00",
    "attachments": []
  }
}
```
