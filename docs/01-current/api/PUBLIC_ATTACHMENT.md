<!-- docs/current/api/PUBLIC_ATTACHMENT.md -->

# API_PUBLIC_ATTACHMENT

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 공개 방문자용 첨부파일 다운로드 및 자산 서빙 API 계약을 정의한다.

이 문서가 답하는 질문:

- 방문자는 어떻게 공지사항의 파일을 다운로드하는가?
- 에디터 본문의 이미지는 어떻게 서빙되는가?

이 문서에 포함하지 않는 내용:

- 관리자 전용한 업로드 API (이는 `ADMIN_ATTACHMENT.md`에서 다룸)
- 정적 리소스 핸들러의 내부 Java 설정 상세

---

## 공개 API

공개 API는 인증 없이 접근 가능하다.

### 1. 첨부파일 다운로드

## GET `/api/public/attachments/{id}/download`

특정 첨부파일을 원본 파일명으로 다운로드한다.

### Request
- **Path Parameter**: 
    - `id`: 다운로드할 `Attachment`의 ID

### Response 200
- **Content-Type**: 파일의 MIME type에 따름
- **Headers**:
    - `Content-Disposition`: `attachment; filename="원본파일명.ext"`

---

### 2. 정적 자산 서빙 (Inline)

## GET `/api/public/assets/{savedName}`

저장된 자산(주로 본문 삽입 이미지)을 브라우저에 직접 출력한다.

### Request
- **Path Parameter**: 
    - `savedName`: 서버에 저장된 고유 파일명 (예: `uuid.jpg`)

### Response 200
- **Content-Type**: 이미지 등 해당 파일의 MIME type
- **Cache-Control**: 원활한 서빙을 위해 캐싱 정책이 적용될 수 있음

---

## 제약 및 규칙

- **보안**: 공개된 파일이므로 별도의 세션 인증 없이 `id` 또는 `savedName`만으로 접근 가능하다. 
- **프록시**: 프로덕션 환경(Nginx 등)에서는 `/api/public/assets/` 요청을 백엔드 대신 스토리지 디렉토리에서 직접 서빙하도록 설정하는 것이 권장된다.
