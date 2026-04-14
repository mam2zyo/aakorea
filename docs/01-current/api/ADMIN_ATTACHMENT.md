<!-- docs/current/api/ADMIN_ATTACHMENT.md -->

# API_ADMIN_ATTACHMENT

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 운영 환경에서 첨부파일 및 자산 업로드 API 계약을 정의한다.

이 문서가 답하는 질문:

- 운영자는 어떻게 파일을 업로드하는가?
- 업로드된 파일의 메타데이터 형시는 무엇인가?

이 문서에 포함하지 않는 내용:

- 공개 다운로드 API 및 정적 자산 서빙 (이는 `PUBLIC_ATTACHMENT.md`에서 다룸)
- 에디터 내 이미지 삽입 가이드

---

## 운영 API

운영 API는 관리자 인증(`credentials: 'include'`)이 필요하다.

### 1. 첨부파일 업로드

## POST `/api/admin/attachments`

개별 파일을 업로드하고 `Attachment` 메타데이터를 생성한다.

### Request
- **Content-Type**: `multipart/form-data`
- **Body**: 
    - `file`: 업로드할 파일 (필수)

### Response 201

```json
{
  "data": {
    "id": 101,
    "originalName": "meeting-guide.pdf",
    "savedName": "550e8400-e29b-41d4-a716-446655440000.pdf",
    "fileSize": 1048576,
    "contentType": "application/pdf"
  }
}
```

---

### 2. 에디터 자산(이미지) 업로드

## POST `/api/admin/assets`

에디터 본문 내 삽입용 이미지를 업로드하고 즉시 접근 가능한 URL을 반환한다.

### Request
- **Content-Type**: `multipart/form-data`
- **Body**: 
    - `file`: 업로드할 이미지 파일 (필수)

### Response 201

```json
{
  "url": "/api/public/assets/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

---

## 제약 및 규칙

- **용량 제한**: 단일 파일 최대 10MB, 전체 요청 최대 20MB.
- **인증**: 모든 요청은 세션 쿠키가 포함되어야 하며, 유효한 운영자 세션이 필요하다.
- **응답 형식**: 일반 첨부파일(`attachments`)은 `ApiResponse`로 감싸진 `data` 객체를 반환하나, 에디터 자산(`assets`)은 현재 에디터 라이브러리 호환을 위해 `url` 직접 반환 형식을 사용할 수 있다.
