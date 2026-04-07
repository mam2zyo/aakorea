<!-- docs/current/api/ADMIN_AUTHORIZATION.md -->

# API_ADMIN_AUTHORIZATION

## 이 문서의 역할

이 문서는 `office.aakorea.org` 운영 콘솔의 현재 권한 규칙과
관리자 메뉴/API permission 매핑을 현재 구현 기준으로 정리한다.

이 문서가 답하는 질문:

- 현재 관리자 메뉴는 어떤 permission으로 열리는가?
- 각 운영 API는 어떤 permission 또는 역할로 보호되는가?
- 운영자 승인/권한 관리 API는 어떤 규칙으로 동작하는가?

이 문서에 포함하지 않는 내용:

- 로그인/등록/로그아웃 요청과 응답 상세
- 추후 확장 scope 권한 모델
- 권한 모델 검토 초안과 장기 roadmap

인증 API 계약은 `AUTH.md`를 따르고,
장기 초안은 `../../deferred/OFFICE_AUTHORIZATION_DRAFT.md`를 참고한다.

---

## 현재 권한 카탈로그

현재 구현에서 사용하는 운영 permission은 아래와 같다.

| permission | 현재 의미 | 기본 역할 |
| --- | --- | --- |
| `self.preferences.manage` | 본인 계정 설정 화면 접근 | `SYSTEM_ADMIN`, `MANAGER`, `STAFF` |
| `district.manage` | 지역연합 목록/생성/수정/삭제 | `SYSTEM_ADMIN`, `MANAGER` |
| `group.manage` | 그룹, 그룹 연락처, 모임 CRUD | `SYSTEM_ADMIN`, `MANAGER` |
| `notice.manage` | 공지 초안 생성/수정/삭제 | `SYSTEM_ADMIN`, `MANAGER` |
| `content_page.manage` | 안내 페이지 초안 생성/수정/삭제 | `SYSTEM_ADMIN`, `MANAGER` |
| `content.publish` | 공지/안내 게시 상태 변경, 게시 중 문서 수정 | `SYSTEM_ADMIN`, `MANAGER` |
| `public_theme.manage` | 공개 사이트 테마 화면 접근 및 draft 저장 | `SYSTEM_ADMIN` |
| `public_theme.publish` | 공개 사이트 테마 publish / rollback | `SYSTEM_ADMIN` |
| `operations.import.manage` | 테스트 도구의 import 기능 | `SYSTEM_ADMIN` |
| `operations.coordinate_backfill.manage` | 테스트 도구의 좌표 보정 기능 | `SYSTEM_ADMIN` |
| `audit.view` | 감사 로그 조회용 예약 permission | `SYSTEM_ADMIN`, `MANAGER` |
| `staff.manage` | Staff 조회/승인/권한 부여/중지 | `SYSTEM_ADMIN`, `MANAGER` |
| `manager.manage` | Manager 조회/수정/승격 | `SYSTEM_ADMIN` |
| `stats.view` | 통계 화면용 예약 permission | `SYSTEM_ADMIN` |
| `menu.manage` | 공개 사이트 메뉴 편집용 예약 permission | `SYSTEM_ADMIN`, `MANAGER` |

현재 `Staff` 기본 권한은 `self.preferences.manage` 하나뿐이며,
추가 grant는 아래 집합 안에서만 허용한다.

- `district.manage`
- `group.manage`
- `notice.manage`
- `content_page.manage`
- `content.publish`

---

## 관리자 메뉴 기준 매핑

현재 운영 콘솔 화면은 아래 규칙으로 노출/차단된다.

| 메뉴 | 경로 | 화면 접근 규칙 | 비고 |
| --- | --- | --- | --- |
| 계정 설정 | `/admin/account` | `self.preferences.manage` | 현재는 로컬 테마 설정만 제공 |
| 그룹 관리 | `/admin/groups` | `group.manage` | 그룹 연락처/모임 편집 포함 |
| 지역연합 관리 | `/admin/districts` | `district.manage` | |
| 공지 관리 | `/admin/notices` | `notice.manage` | 게시는 `content.publish` 추가 필요 |
| 안내 페이지 | `/admin/content-pages` | `content_page.manage` | 게시는 `content.publish` 추가 필요 |
| 운영자 관리 | `/admin/admin-users` | `staff.manage` 또는 `manager.manage` | Manager는 Staff만 관리, SystemAdmin은 Manager/Staff 관리 |
| 공개 사이트 테마 | `/admin/public-theme` | `public_theme.manage` | 현재 `SYSTEM_ADMIN`만 보유 |
| 테스트 도구 | `/admin/overview` | `operations.import.manage` 또는 `operations.coordinate_backfill.manage` | 현재 `SYSTEM_ADMIN`만 보유 |

프론트는 위 permission 기준으로 메뉴를 숨기고,
백엔드는 동일 기준 또는 더 엄격한 정책으로 API를 차단한다.

---

## 운영 API 기준 매핑

### 1. 운영자 승인/권한 관리

| API | 규칙 | 추가 정책 |
| --- | --- | --- |
| `GET /api/admin/admin-users` | `staff.manage` 또는 `manager.manage` | Manager는 Staff만 조회, SystemAdmin은 전체 조회 |
| `POST /api/admin/admin-users` | `manager.manage` | 현재 UI에서는 미사용, 비상 수동 생성용 |
| `PUT /api/admin/admin-users/{id}` | `staff.manage` 또는 `manager.manage` | Manager는 Staff만 수정, SystemAdmin만 Manager 수정 가능 |

`GET /api/admin/admin-users` 응답의 각 사용자 항목은 아래 운영 정보를 포함한다.

- `grantedPermissions`
  Staff에게 개별 부여된 추가 permission 목록
- `effectivePermissions`
  role 기본 권한과 추가 grant를 합친 최종 permission 목록
- `approvedAt`, `approvedByUserId`, `approvedByLabel`
  승인 시점과 승인자
- `updatedAt`, `updatedByUserId`, `updatedByLabel`
  최근 수정 시각과 최근 수정자
- `managementHistory`
  최근 운영 이력 목록. `등록 요청`, `승인 처리`, `계정 중지`, `역할 변경`, `권한 부여`, `권한 회수` 같은 이벤트를 포함한다.

### 2. 지역연합

| API | 규칙 |
| --- | --- |
| `GET /api/admin/districts` | `district.manage` |
| `POST /api/admin/districts` | `district.manage` |
| `PUT /api/admin/districts/{id}` | `district.manage` |
| `DELETE /api/admin/districts/{id}` | `district.manage` |

### 3. 그룹 / 연락처 / 모임

| API | 규칙 |
| --- | --- |
| `GET /api/admin/groups` | `group.manage` |
| `POST /api/admin/groups` | `group.manage` |
| `PUT /api/admin/groups/{id}` | `group.manage` |
| `DELETE /api/admin/groups/{id}` | `group.manage` |
| `GET /api/admin/group-contacts` | `group.manage` |
| `POST /api/admin/group-contacts` | `group.manage` |
| `PUT /api/admin/group-contacts/{id}` | `group.manage` |
| `GET /api/admin/meetings` | `group.manage` |
| `POST /api/admin/meetings` | `group.manage` |
| `PUT /api/admin/meetings/{id}` | `group.manage` |
| `DELETE /api/admin/meetings/{id}` | `group.manage` |
| `POST /api/admin/meetings/backfill-coordinates` | `operations.coordinate_backfill.manage` |

### 4. 공지 / 안내 페이지

| API | 기본 규칙 | 추가 규칙 |
| --- | --- | --- |
| `GET /api/admin/content-pages` | `content_page.manage` | |
| `GET /api/admin/content-pages/{id}` | `content_page.manage` | |
| `POST /api/admin/content-pages` | `content_page.manage` | `published=true`면 `content.publish` 필요 |
| `PUT /api/admin/content-pages/{id}` | `content_page.manage` | 게시 중 문서 수정 또는 게시 전환 시 `content.publish` 필요 |
| `DELETE /api/admin/content-pages/{id}` | `content_page.manage` | 게시 중 문서 삭제는 `content.publish` 필요 |
| `GET /api/admin/notices` | `notice.manage` | |
| `GET /api/admin/notices/{id}` | `notice.manage` | |
| `POST /api/admin/notices` | `notice.manage` | `published=true`면 `content.publish` 필요 |
| `PUT /api/admin/notices/{id}` | `notice.manage` | 게시 중 문서 수정 또는 게시 전환 시 `content.publish` 필요 |
| `DELETE /api/admin/notices/{id}` | `notice.manage` | 게시 중 문서 삭제는 `content.publish` 필요 |

### 5. 공개 사이트 테마

| API | 규칙 |
| --- | --- |
| `GET /api/admin/public-theme` | `public_theme.manage` |
| `PUT /api/admin/public-theme/draft` | `public_theme.manage` |
| `POST /api/admin/public-theme/publish` | `public_theme.publish` |
| `POST /api/admin/public-theme/rollback` | `public_theme.publish` |

### 6. 테스트 도구

| API | 규칙 |
| --- | --- |
| `POST /api/admin/meeting-imports/normalize` | `operations.import.manage` |
| `POST /api/admin/meeting-imports/preview` | `operations.import.manage` |
| `POST /api/admin/meeting-imports/apply` | `operations.import.manage` |
| `POST /api/admin/meeting-imports/reset` | `operations.import.manage` |

---

## 현재 운영 원칙

- 메뉴 노출은 permission 기준으로 계산한다.
- 실제 차단은 백엔드 API와 서비스 계층이 최종 책임을 진다.
- `PENDING_APPROVAL`은 로그인은 가능하지만 effective permission은 비어 있다.
- `SUSPENDED`는 로그인 자체가 차단된다.
- 권한 부여/회수와 상태 변경은 운영자 관리 영역에서 별도 이력으로 남긴다.
