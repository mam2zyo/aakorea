<!-- docs/current/domain/Notice.md -->

# Notice

## 이 문서의 역할

이 문서는 `Notice`의 현재 모델 의미와 필드를 정리한다.

이 문서에 포함하지 않는 내용:

- 제품 범위 판단
- 사용자 행동 흐름
- API 요청 / 응답 JSON 상세
- `ContentPage`와의 비교 기준 전체 설명

---

## 현재 모델 의미

`Notice`는 시의성이 있는 공개 공지 모델이다.

현재 MVP에서 `Notice`는 아래 성격을 가진다.

- 공지 또는 업데이트 성격이 강하다
- 최신순 또는 목록 노출이 자연스럽다
- 시간이 지나면 중요도가 낮아질 수 있다
- 누적 게시 이력 자체가 의미를 가진다

---

## 현재 핵심 필드

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `Long` | 고유 식별자 |
| `title` | `String` | 공지 제목 |
| `body` | `String` | 공지 본문 (Rich Text HTML) |
| `attachments` | `List<Attachment>` | 공지 하단 첨부파일 리스트 (선택) |
| `published` | `boolean` | 공개 여부 |
| `publishedAt` | `DateTime` | 게시 일시 |

### 필드 메모

- `title`, `body`는 필수다
- 본문(`body`)은 에디터 통합을 위해 Rich Text HTML 형식을 사용한다.
- 하나의 공지는 여러 개의 첨부파일을 가질 수 있으며, 공개 화면 하단에 순서대로 노출된다.
- 게시 시점(`publishedAt`)은 실제 공지 목록의 정렬 기준이 된다.
- `published=true`이면 `publishedAt`이 필수다
- 목록 정렬은 `publishedAt desc`, `id desc`다

---

## 현재 규칙

- 공개 API는 `published=true`인 공지만 노출한다
- 공지 목록과 공지 상세를 별도 화면으로 사용한다
- 최신 정보 전달 역할이 핵심이다

---

## 공개 흐름에서의 의미

- 홈의 최신 공지 요약과 `/notices` 목록 / 상세 화면의 데이터 소스다

---

## 운영 흐름에서의 의미

- 운영자는 공지 단위로 등록 / 수정 / 삭제 / 게시 상태 관리를 한다
- `ContentPage`보다 시간성과 노출 순서 관리가 더 중요하다

---

## 관계

- `ContentPage`와 함께 공개 콘텐츠를 구성하지만,
  `Notice`는 시의성과 최신순 노출을 담당한다

---

## 제외 / 보류

현재는 아래를 지원하지 않는다.

- 범용 게시판 스레드
- 태그 / 카테고리 기반 공지 구조
- 첨부파일 / 미디어 자산

---

## 관련 API 문서

- API 상세 스펙은 Swagger UI의 Public Content / Admin Content 영역을 참고하십시오.
- `ContentPage`와의 차이는 [README.md](./README.md)를 참고하십시오.
