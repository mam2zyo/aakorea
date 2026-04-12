<!-- docs/current/domain/ContentPage.md -->

# ContentPage

## 이 문서의 역할

이 문서는 `ContentPage`의 현재 모델 의미와 필드를 정리한다.

---

---

## 삼중 관리 구조 (Tripartite Structure)

`ContentPage`는 대용량/장기 컨텐츠의 효율적 관리를 위해 세 가지 레이어로 나뉜 하이브리드 아키텍처를 채택하고 있다.

1. **메타데이터 (Metadata - DB)**: `ContentPage` 엔티티가 페이지 고유 키, 제목, 공개 여부 등 시스템 제어용 속성을 관리한다.
2. **본문 (Content Body - Filesystem)**: 실제 페이지의 HTML 또는 JSX 내용은 서버 파일 시스템에 저장된다. 에디터 의존성을 줄이고 자유로운 레이아웃 구성을 보장하며, `originalFileName`은 이 본문 파일의 원본 명칭을 추적한다.
3. **보조 자산 (Supplementary Attachments - Domain)**: 페이지 하단에 노출되는 다운로드용 문서(PDF, ZIP 등)나 본문에 삽입된 이미지들은 `Attachment` 도메인을 통해 관리되며, `ContentAttachment` 브릿지를 통해 해당 페이지와 연결된다.

---

## 현재 핵심 필드

- `id` (Long): 고유 식별자
- `key` (String): URL 슬러그로 사용되는 페이지 고유 키 (예: `first-visitor-guide`)
- `title` (String): 페이지 제목
- `originalFileName` (String): 업로드된 원본 HTML 파일명 보관용
- `published` (boolean): 공개 여부

> [!IMPORTANT]
> **본문 저장 방식**: 본문 내용은 더 이상 데이터베이스에 저장되지 않으며, 서버의 물리적 경로에 `.html` 파일 형태로 저장되어 관리된다.

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `Long` | 고유 식별자 |
| `key` | `String` | 고유 키 (URL 슬러그) |
| `title` | `String` | 페이지 제목 |
| `originalFileName` | `String` | 업로드된 **본문용** HTML 파일명 |
| `published` | `boolean` | 공개/비공개 상태 |
| `attachments` | `List<Attachment>` | 페이지 하단 **보조 첨부파일** (선택) |

---

## 현재 규칙

- **Source of Truth**: 모든 메타데이터와 권한 조회는 DB를 기준으로 수행한다.
- **파일 직접 관리**: 운영자는 에디터 대신 HTML 파일을 직접 제작하여 업로드하며, 시스템은 이를 정해진 경로에 보관한다.
- **파일 주석 폐기**: 과거 HTML 주석(`<!-- title: ... -->`)을 통해 메타데이터를 파일에 기록하던 방식은 더 이상 사용되지 않는다.

---

## 공개 흐름에서의 의미

- 공개 API 조회 시 DB에서 메타데이터를 읽고, 파일 시스템에서 HTML 본문을 읽어 결합하여 반환한다.
- 캐싱 효율 및 대용량 텍스트 처리 최적화를 위해 본문을 DB에서 분리하였다.

---

## 관련 문서
- `../api/PUBLIC_CONTENT.md`
- `../api/ADMIN_CONTENT.md`
- `../../reference/CONTENT_ARCHITECTURE_STRATEGY.md`
