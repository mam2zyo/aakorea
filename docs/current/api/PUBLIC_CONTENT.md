<!-- docs/current/api/PUBLIC_CONTENT.md -->

# API_PUBLIC_CONTENT

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 공개 콘텐츠 조회 API 계약을 정의한다.

이 문서가 답하는 질문:

- 공개 `ContentPage`는 어떻게 조회하는가?
- 공개 `Notice` 목록과 상세는 어떻게 조회하는가?
- 공개 콘텐츠는 어떤 조건으로 노출되는가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 운영용 콘텐츠 관리 API
- 콘텐츠 모델 채택 이유
- 구현 단계별 작업 순서

공통 규약은 `COMMON.md`를 따른다.

---

## 공개 API

공개 API는 방문자의 정보 탐색을 위한 조회 전용 API다.

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
