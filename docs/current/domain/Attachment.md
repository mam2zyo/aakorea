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
| `filePath` | `String` | 클라이언트에서 접근 가능한 URL 경로 (예: `/api/public/assets/...`) |
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
  - 전용 엔드포인트: `/api/public/attachments/{id}/download`

---

## ContentPage 연동 구조

`ContentPage`는 유연한 컨텐츠 구성을 위해 다음과 같은 **삼중 관리 구조**를 가진다.

1. **메타데이터 (DB Entity)**: 페이지 제목, 키, 공개 상태 등의 관리 속성
2. **본문 (Body - Filesystem)**: `.html` 또는 `.jsx` 파일 형태의 실제 컨텐츠 본문
3. **보조 자산 (Supplementary Attachments - Domain)**: 페이지와 연관된 다운로드용 문서나 이미지들 (브릿지 엔터티 사용)

본문 파일 내의 이미지나 링크는 `Attachment` 도메인을 통해 업로드된 URL을 참조하여 삽입된다.

---

## 운영 제약

- **최대 파일 용량**: 현재 설정 기준 단일 파일 10MB, 요청당 20MB.
- **허용 확장자**: 이미지류, PDF, ZIP 등 일반 문서 자산 위주.
- **보안**: 관리자 인증(`credentials: 'include'`)이 있는 사용자만 업로드 API에 접근할 수 있다.

---

## 브릿지 엔터티(Bridge Entity) 설계 철학

`NoticeAttachment`, `ContentAttachment`와 같은 교차 엔터티를 사용하는 이유는 다음과 같다.

1. **자산의 재사용성 (M:N 관계)**: 동일한 `Attachment` 자산을 여러 공지나 페이지에서 중복 업로드 없이 공유할 수 있다.
2. **관계 전용 메타데이터**: 특정 페이지 내에서의 파일 노출 순서(`orderIndex`) 등 '관계' 자체의 속성을 저장하기 위함이다.
3. **도메인 결합도 분리**: `Attachment` 도메인이 상위 도메인(Notice, ContentPage 등)을 알 필요가 없게 하여 시스템의 확장성을 높인다.
