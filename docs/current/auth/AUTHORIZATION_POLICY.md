<!-- docs/current/auth/AUTHORIZATION_POLICY.md -->

# AUTHORIZATION_POLICY

## 이 문서의 역할

이 문서는 `office.aakorea.org`를 기준으로 한 현재 프로젝트의 권한 정책을 정의한다.

이 문서가 답하는 질문:

- 운영 콘솔 사용자를 어떤 역할과 권한으로 나누는가?
- 현재 `/admin` 메뉴와 화면은 어떤 permission으로 보호하는가?
- Spring Data JPA auditing과 `AuditorAware`를 사용할 때, 어떤 사용자 식별 모델을 사용하는가?

이 문서에 포함하지 않는 내용:

- `service.aakorea.org`의 최종 scope 권한 모델
- Spring Security 구현 코드 상세

엔티티 / principal / auditing 상세 명세는 `AUTHENTICATION_MODEL.md`를 따른다.

현재 관리자 화면 구조의 기준은 `../FRONTEND_STRUCTURE.md`,
현재 관리자 API 범위의 기준은 `../api/README.md`와 각 세부 API 문서를 따른다.

---

## 핵심 원칙

`office.aakorea.org`는 `SystemAdmin`, `Manager`, `Staff`의 3개 역할을 사용하고,
실제 접근 제어는 role보다 **permission 기준**으로 수행하며,
모든 변경의 작성자 / 수정자는 `AdminUser.id` 기준으로 auditing 한다.

---

## 역할 정의 (Roles)

### SystemAdmin
- 모든 permission 보유
- 시스템 통계, 보안 설정, Manager 관리 가능
- auditing / 운영 정책의 최종 책임자

### Manager
- 운영 기능 대부분 보유
- Staff 계정 생성 / 비활성화 / 권한 부여 가능
- `SystemAdmin` 전용 기능은 제외

### Staff
- 기본적으로 자신의 설정 관리(`self.preferences.manage`)만 가능
- Manager가 명시적으로 허용한 특정 편집 permission(`district.manage`, `group.manage` 등)만 추가로 사용

---

## 권한 카탈로그 (Permissions)

현재 시스템에서 정의된 15개의 핵심 권한이다.

| Permission | 의미 | Staff에게 부여 가능? | 비고 |
| --- | --- | --- | --- |
| `self.preferences.manage` | 자신의 계정 설정 / 콘솔 테마 변경 | 자동 허용 | 모든 운영자 공통 |
| `district.manage` | 지역연합 CRUD | 가능 | |
| `group.manage` | 그룹 / 연락처 / 모임 CRUD | 가능 | |
| `notice.manage` | 공지 초안 생성 / 수정 / 삭제 | 가능 | |
| `content_page.manage` | 안내 페이지 초안 생성 / 수정 / 삭제 | 가능 | |
| `content.publish` | 공지 / 안내 페이지 게시 상태 반영 | 가능 | Manager 기본값 |
| `public_theme.manage` | 공개 테마 드래프트 저장 / 미리보기 | 불가 | SystemAdmin 전용 |
| `public_theme.publish` | 공개 테마 게시 / 롤백 | 불가 | SystemAdmin 전용 |
| `operations.import.manage` | import preview / apply / reset | 불가 | SystemAdmin 전용 |
| `operations.coordinate_backfill.manage` | 좌표 dry-run / backfill 실행 | 불가 | SystemAdmin 전용 |
| `audit.view` | 변경 이력 / 감사 로그 조회 | 불가 | |
| `staff.manage` | Staff 계정 생성 / 권한 부여 / 비활성화 | 불가 | Manager 이상 |
| `manager.manage` | Manager 계정 생성 / 변경 / 비활성화 | 불가 | SystemAdmin 전용 |
| `stats.view` | 시스템 통계 / 보안 통계 조회 | 불가 | SystemAdmin 전용 |
| `menu.manage` | 공개 사이트 메뉴 편집 | 불가 | |

---

## 현재 화면별 Permission 매핑

| 화면 | 경로 | 접근 permission | 버튼 / 작업별 추가 permission |
| --- | --- | --- | --- |
| 그룹 관리 | `/admin/groups` | `group.manage` | - |
| 지역연합 관리 | `/admin/districts` | `district.manage` | - |
| 공지 관리 | `/admin/notices` | `notice.manage` | 게시 상태 저장은 `content.publish` |
| 안내 페이지 | `/admin/content-pages` | `content_page.manage` | 게시 상태 저장은 `content.publish` |
| 공개 사이트 테마 | `/admin/public-theme` | `public_theme.manage` | 게시 / 롤백은 `public_theme.publish` |
| 테스트 도구 | `/admin/overview` | `operations.import.manage` 등 | 패널별로 각각 검사 |
| 계정 설정 | `/admin/account` | `self.preferences.manage` | - |

---

## Auditing 정책

### 1. 식별자 (Actor)
- `AuditorAware`는 `username`이 아닌 `AdminUser.id` (Long)를 반환한다.
- 고유 식별자를 사용함으로써 사용자 정보 변경 시에도 감사 기록의 무결성을 유지한다.

### 2. 공통 필드
모든 주요 도메인 엔티티는 아래 필드를 포함한다.
- `createdAt`: 생성 일시
- `createdBy`: 생성자 ID
- `updatedAt`: 수정 일시
- `updatedBy`: 최종 수정자 ID
