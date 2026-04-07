<!-- docs/current/api/README.md -->

# API

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP API 문서 구조를 안내하는 허브다.

이 문서가 답하는 질문:

- 현재 API 계약은 어디서 확인하는가?
- 어떤 API 문서를 어떤 기준으로 나누었는가?
- 어떤 순서로 API 문서를 읽으면 되는가?
- 현재 MVP에서 우선 필요한 API는 무엇인가?

---

## 현재 API 문서 구조

현재 MVP의 API 계약 기준 문서는 `current/api/` 아래에 둔다.

- `COMMON.md`
  공통 규약, 응답 형식, 상태 코드, 값 형식, 공통 주의사항

- `AUTH.md`
  운영 인증 API 계약

- `ADMIN_AUTHORIZATION.md`
  운영 권한 규칙, 관리자 메뉴/API permission 매핑, 운영자 승인 관리 API 계약

- `PUBLIC_THEME.md`
  공개 사이트 theme 조회와 운영 theme 관리 API 계약

- `PUBLIC_CONTENT.md`
  공개 `ContentPage`, `Notice` 조회 API 계약

- `PUBLIC_MEETINGS.md`
  공개 `Meeting` 검색과 그룹 상세 모달용 API 계약

- `ADMIN_GENERAL_SERVICES.md`
  운영 `generalservice` 계열 API 계약. 현재는 `District` API를 포함한다

- `ADMIN_GROUPS.md`
  운영 `Group`, `GroupContact` API 계약. 현재 연락처 1:1 규칙 포함

- `ADMIN_MEETINGS.md`
  운영 `Meeting` API 계약

- `ADMIN_MEETING_IMPORTS.md`
  운영 테스트 도구용 HTML normalize + 정제 JSON import API 계약

- `ADMIN_CONTENT.md`
  운영 `ContentPage`, `Notice` API 계약

즉, 공통 규칙은 한 문서에 두고,
엔드포인트 계약은 책임별 문서로 분리한다.

---

## 권장 읽기 순서

처음 API 문서를 읽을 때는 아래 순서를 권장한다.

1. `COMMON.md`
2. `AUTH.md`
3. `ADMIN_AUTHORIZATION.md`
4. `PUBLIC_THEME.md`
5. `PUBLIC_CONTENT.md`
6. `PUBLIC_MEETINGS.md`
7. `ADMIN_GENERAL_SERVICES.md`
8. `ADMIN_GROUPS.md`
9. `ADMIN_MEETINGS.md`
10. `ADMIN_MEETING_IMPORTS.md`
11. `ADMIN_CONTENT.md`

이 순서는 다음 흐름을 따른다.

- 공통 규약을 먼저 이해하고
- 인증 구조를 확인한 뒤
- 공개 조회 API를 보고
- 운영 입력 API를 본다

---

## 최소 운영 화면 기준으로 필요한 API 요약

현재 MVP에서 우선 필요한 API를 요약하면 아래와 같다.

### 공개

- `GET /api/public/theme`
- `GET /api/public/content-pages/{key}`
- `GET /api/public/notices`
- `GET /api/public/notices/{id}`
- `GET /api/public/meetings`
- `GET /api/public/meetings/{id}`
- `GET /api/public/groups/{id}`

### 인증

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### 운영

- `GET /api/admin/districts`
- `POST /api/admin/districts`
- `PUT /api/admin/districts/{id}`
- `DELETE /api/admin/districts/{id}`
- `GET /api/admin/groups`
- `POST /api/admin/groups`
- `PUT /api/admin/groups/{id}`
- `DELETE /api/admin/groups/{id}`
- `GET /api/admin/group-contacts`
- `POST /api/admin/group-contacts`
- `PUT /api/admin/group-contacts/{id}`
- `GET /api/admin/meetings`
- `POST /api/admin/meetings`
- `PUT /api/admin/meetings/{id}`
- `DELETE /api/admin/meetings/{id}`
- `POST /api/admin/meetings/backfill-coordinates`
- `POST /api/admin/meeting-imports/normalize`
- `POST /api/admin/meeting-imports/preview`
- `POST /api/admin/meeting-imports/apply`
- `POST /api/admin/meeting-imports/reset`
- `GET /api/admin/public-theme`
- `PUT /api/admin/public-theme/draft`
- `POST /api/admin/public-theme/publish`
- `POST /api/admin/public-theme/rollback`
- `GET /api/admin/admin-users`
- `POST /api/admin/admin-users`
- `PUT /api/admin/admin-users/{id}`
- `GET /api/admin/content-pages`
- `GET /api/admin/content-pages/{id}`
- `POST /api/admin/content-pages`
- `PUT /api/admin/content-pages/{id}`
- `DELETE /api/admin/content-pages/{id}`
- `GET /api/admin/notices`
- `GET /api/admin/notices/{id}`
- `POST /api/admin/notices`
- `PUT /api/admin/notices/{id}`
- `DELETE /api/admin/notices/{id}`

---

## 사용 원칙

API 문서를 사용할 때는 아래 방식으로 본다.

- 공통 규약을 확인할 때: `COMMON.md`
- 인증 API를 확인할 때: `AUTH.md`
- 운영 권한과 관리자 승인 API를 확인할 때: `ADMIN_AUTHORIZATION.md`
- 공개 사이트 theme API를 확인할 때: `PUBLIC_THEME.md`
- 공개 콘텐츠 API를 확인할 때: `PUBLIC_CONTENT.md`
- 공개 모임 API를 확인할 때: `PUBLIC_MEETINGS.md`
- 운영 `District` API를 확인할 때: `ADMIN_GENERAL_SERVICES.md`
- 운영 `Group`, `GroupContact` API를 확인할 때: `ADMIN_GROUPS.md`
- 운영 모임 API를 확인할 때: `ADMIN_MEETINGS.md`
- 운영 테스트 도구용 import API를 확인할 때: `ADMIN_MEETING_IMPORTS.md`
- 운영 콘텐츠 API를 확인할 때: `ADMIN_CONTENT.md`

범위 포함 / 제외 판단은 `../PRODUCT_SCOPE.md`를 따른다.
도메인 의미와 필드 정의의 원본은 `../domain/README.md`와 해당 세부 문서를 따른다.
