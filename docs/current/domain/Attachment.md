<!-- docs/current/domain/Attachment.md -->

# Attachment

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱 프로젝트의 범용 첨부파일과 미디어 자산을 정의한다.

이 문서가 답하는 질문:

- 어떤 파일 메타데이터를 저장하는가?
- 파일은 어디에 어떤 규칙으로 저장되는가?
- 공지사항이나 콘텐츠 페이지와는 어떤 관계를 갖는가?

이 문서에 포함하지 않는 내용:

- 업로드/다운로드 API의 상세 HTTP 계약
- 파일 서버 인프라 구성 절차
- S3 등 외부 스토리지 마이그레이션 계획

---

## 도메인 개념

`Attachment`는 시스템에서 관리하는 단일 물리적 파일의 메타데이터를 나타낸다. 파일 자체가 비즈니스 로직을 갖기보다, 다른 도메인 개체(공지, 콘텐츠 등)에 종속된 자산 역할을 한다.

---

## 필드 정의

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `Long` | PK |
| `originalName` | `String` | 사용자가 업로드할 때의 원본 파일명 |
| `savedName` | `String` | 서버에 저장된 고유 파일명 (UUID 기반) |
| `filePath` | `String` | 저장소 내의 실제 경로 |
| `fileSize` | `long` | 파일 용량 (bytes) |
| `contentType` | `String` | MIME type (예: `image/jpeg`, `application/pdf`) |
| `createdAt` | `LocalDateTime` | 업로드 일시 |

---

## 저장 정책

### 1. 로컬 스토리지 기준
- 현재는 프로젝트 내부의 `uploads/` 디렉토리에 저장한다.
- 파일명 충돌을 방지하기 위해 `UUID.extension` 형식으로 저장한다.

### 2. 정적 자산 서빙 (Inline)
- 에디터 본문에 삽입된 이미지 등 직접 브라우저에 표시되어야 하는 파일들이다.
- `/api/public/assets/**` 경로를 통해 서비스된다.

### 3. 첨부파일 다운로드
- 공지사항 하단 등에 리스팅되는 "다운로드용" 파일들이다.
- 원본 파일명(`originalName`)을 복구하여 다운로드할 수 있도록 전용 엔드포인트를 사용한다.

---

## 관계 정의

### Notice / ContentPage 연동
- 공지(`Notice`)와 콘텐츠(`ContentPage`)는 여러 개의 첨부파일을 가질 수 있다.
- 순서를 보장해야 하는 경우 브릿지 엔터티(`NoticeAttachment`, `ContentAttachment`)를 통해 관리한다.
- 에디터(TipTap) 본문 내의 이미지는 별도의 하드 링크가 아닌 URL 참조 방식으로 동작하며, 해당 이미지는 `Attachment` 도메인을 통해 업로드된 자산이다.

---

## 운영 제약

- **최대 파일 용량**: 현재 설정 기준 단일 파일 10MB, 요청당 20MB.
- **허용 확장자**: 이미지류, PDF, ZIP 등 일반 문서 자산 위주.
- **보안**: 관리자 인증(`credentials: 'include'`)이 있는 사용자만 업로드 API에 접근할 수 있다.
