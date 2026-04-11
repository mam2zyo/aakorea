<!-- docs/current/domain/ContentPage.md -->

# ContentPage

## 이 문서의 역할

이 문서는 `ContentPage`의 현재 모델 의미와 필드를 정리한다.

---

## 현재 모델 의미

`ContentPage`는 비교적 안정적인 설명 / 안내 정보를 담는 콘텐츠 모델이다.
현재 시스템은 **DB(메타데이터) + 파일 시스템(본문)** 하이브리드 아키텍처를 채택하고 있다.

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
| `originalFileName` | `String` | 업로드된 HTML 파일명 |
| `published` | `boolean` | 공개/비공개 상태 |
| `attachments` | `List<Attachment>` | 페이지 하단 첨부파일 (선택) |

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
