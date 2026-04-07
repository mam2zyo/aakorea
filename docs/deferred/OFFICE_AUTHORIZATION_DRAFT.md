<!-- docs/deferred/OFFICE_AUTHORIZATION_DRAFT.md -->

# OFFICE_AUTHORIZATION_DRAFT

## 이 문서의 역할

이 문서는 `office.aakorea.org`를 기준으로 한 1차 권한 모델 초안을 정리한다.

이 문서가 답하는 질문:

- 운영 콘솔 사용자를 어떤 역할과 권한으로 나누는가?
- 현재 `/admin` 메뉴와 화면은 어떤 permission으로 보호하는가?
- Spring Data JPA auditing과 `AuditorAware`를 염두에 둘 때, 어떤 사용자 식별 모델이 적절한가?
- 지금 무엇을 먼저 결정하면 되는가?

이 문서에 포함하지 않는 내용:

- `service.aakorea.org`의 최종 scope 권한 모델
- `store.aakorea.org`, `heart.aakorea.org`, `auth.aakorea.org` 통합 인증 설계
- Spring Security 구현 코드 상세
- 감사 로그 diff 저장 형식의 최종안

엔티티 / principal / auditing 상세 초안은 `OFFICE_AUTH_MODEL_DRAFT.md`를 따른다.

현재 관리자 화면 구조의 기준은 `../current/FRONTEND_STRUCTURE.md`,
현재 관리자 API 범위의 기준은 `../current/api/README.md`와 각 세부 API 문서를 따른다.

---

## 한 문장 요약

`office.aakorea.org`는 `SystemAdmin`, `Manager`, `Staff`의 3역할을 사용하고,
실제 접근 제어는 role보다 **permission 기준**으로 수행하며,
모든 변경의 작성자 / 수정자는 `AdminUser.id` 기준으로 auditing 한다.

---

## 현재 상황을 쉬운 말로 다시 쓰면

현재 운영 콘솔은 사실상 “로그인한 관리자면 `/api/admin/**` 전체 접근 가능” 구조다.

하지만 앞으로 원하는 것은 아래에 가깝다.

- 누가 로그인했는지 분명해야 한다
- 사람마다 할 수 있는 일이 달라야 한다
- 메뉴는 권한에 맞게 보여야 한다
- 실제 API 차단은 서버가 해야 한다
- 누가 무엇을 바꿨는지 `createdBy`, `updatedBy`에 자동으로 남아야 한다

즉, 지금 필요한 것은 “복잡한 인증 기술”보다
**운영자 식별 모델 + permission 카탈로그 + 화면별 매핑 기준**이다.

---

## 권장 1차 적용 범위

이번 초안은 아래 범위만 우선 다룬다.

- 대상 도메인: `office.aakorea.org`
- 대상 화면: 현재 `/admin`에 존재하는 운영 콘솔 화면
- 인증 수준: 운영 계정 관리
- 금융거래 / 결제: 제외
- 외부 서비스 간 SSO: 제외

즉, 지금은 “office 운영 콘솔을 안전하게 나누는 모델”만 먼저 만든다.

---

## 핵심 개념

### 1. User

- 실제 로그인 주체
- DB의 `AdminUser` 레코드를 가진다
- auditing의 actor도 결국 이 사용자를 가리킨다

### 2. Role

- 사용자의 큰 분류
- 현재는 `SystemAdmin`, `Manager`, `Staff` 3개만 사용한다

### 3. Permission

- 실제로 할 수 있는 작업 단위
- 예: 그룹 관리, 공지 수정, 테마 게시

### 4. Scope

- “어디까지 할 수 있는가”를 뜻한다
- 현재 office 1차에서는 전역 scope만 사용한다
- 추후 `service.aakorea.org`에서 `DISTRICT`, `GROUP` scope로 확장할 수 있다

### 5. Audit

- 누가 생성 / 수정 / 게시 / 롤백했는지 남기는 정보
- `AuditorAware`는 현재 로그인한 `AdminUser.id`를 반환하는 역할을 맡는다

---

## 권장 1차 모델

### 사용자 모델

권장 개념 모델:

- `AdminUser`
  운영 계정 본체
- `AdminRole`
  `SYSTEM_ADMIN`, `MANAGER`, `STAFF`
- `AdminPermission`
  코드에 정의된 permission 카탈로그
- `AdminUserPermissionGrant`
  사용자별 추가 권한 부여 기록

### 구현 단순화 제안

1차에서는 `Role`, `Permission`을 DB 테이블로 만들기보다
코드 enum / 상수 카탈로그로 두는 편이 이해와 구현이 쉽다.

즉:

- 역할 종류는 코드에 고정
- permission 종류도 코드에 고정
- DB는 `AdminUser`와 “이 사용자에게 어떤 permission을 부여했는가”만 저장

이 방식의 장점:

- Spring Security 매핑이 단순하다
- 오타나 임의 permission 생성 위험이 없다
- 관리자 UI를 role/permission 자체 관리 화면까지 확장하지 않아도 된다

현재 합의된 방향도 이 방식이다.

- `AdminRole`은 enum으로 시작한다
- `AdminPermission`도 enum으로 시작한다
- DB는 사용자와 사용자별 permission 부여 기록만 관리한다

---

## 권장 역할 정책

### SystemAdmin

- 모든 permission 보유
- 시스템 통계, 보안 설정, Manager 관리 가능
- auditing / 운영 정책의 최종 책임자

### Manager

- 운영 기능 대부분 보유
- Staff 계정 생성 / 비활성화 / 권한 부여 가능
- `SystemAdmin` 전용 기능은 제외

### Staff

- 기본 0권한 또는 최소 권한으로 시작
- Manager가 명시적으로 허용한 permission만 사용

핵심 원칙:

- `Staff`는 기본 허용이 아니라 기본 거부로 시작한다
- Manager는 Staff보다 높은 권한을 부여할 수 없다
- Manager는 Manager 또는 SystemAdmin을 만들거나 승격할 수 없다
- 운영 계정은 삭제보다 `비활성화`를 우선한다

---

## 권장 1차 permission 카탈로그

아래는 현재 `/admin` 기준으로 바로 쓸 수 있는 1차 카탈로그다.

| Permission | 의미 | Staff에게 Manager가 부여 가능? | 비고 |
| --- | --- | --- | --- |
| `self.preferences.manage` | 자신의 계정 설정 / 콘솔 테마 변경 | 자동 허용 | 모든 office 사용자 공통 |
| `district.manage` | 지역연합 CRUD | 가능 | 추후 `district scope` 확장 후보 |
| `group.manage` | 그룹 / 연락처 / 모임 CRUD | 가능 | 현재 `/admin/groups` 전체를 하나로 묶음 |
| `notice.manage` | 공지 초안 생성 / 수정 / 삭제 | 가능 | 게시는 별도 permission |
| `content_page.manage` | 안내 페이지 초안 생성 / 수정 / 삭제 | 가능 | 게시는 별도 permission |
| `content.publish` | 공지 / 안내 페이지 게시 상태 반영 | 불가 | Manager 이상 전용 |
| `public_theme.manage` | 공개 테마 드래프트 저장 / 미리보기 | 불가 | SystemAdmin 전용 |
| `public_theme.publish` | 공개 테마 게시 / 롤백 | 불가 | SystemAdmin 전용 |
| `operations.import.manage` | import preview / apply / reset | 불가 | SystemAdmin 전용 |
| `operations.coordinate_backfill.manage` | 좌표 dry-run / backfill 실행 | 불가 | SystemAdmin 전용 |
| `audit.view` | 변경 이력 / 감사 로그 조회 | 1차 기본은 불가 | 민감도 있음 |
| `staff.manage` | Staff 계정 생성 / 권한 부여 / 비활성화 | 불가 | Manager 이상 |
| `manager.manage` | Manager 계정 생성 / 변경 / 비활성화 | 불가 | SystemAdmin 전용 |
| `stats.view` | 시스템 통계 / 보안 통계 조회 | 불가 | SystemAdmin 전용 |
| `menu.manage` | 공개 사이트 메뉴 편집 | 1차 기본은 불가 | 추후 기능용 예약 permission |

1차 보수적 권장안:

- Staff 기본 상태는 `self.preferences.manage`만 가진다
- Manager가 Staff에게 부여할 수 있는 추가 permission은 `district.manage`, `group.manage`, `notice.manage`, `content_page.manage`까지만 제한한다
- `content.publish`는 Manager 이상에 둔다
- 공개 테마와 운영 도구는 SystemAdmin 전용으로 둔다

---

## 역할별 기본 permission 초안

| Permission | SystemAdmin | Manager | Staff 기본값 |
| --- | --- | --- | --- |
| `self.preferences.manage` | Y | Y | Y |
| `district.manage` | Y | Y | N |
| `group.manage` | Y | Y | N |
| `notice.manage` | Y | Y | N |
| `content_page.manage` | Y | Y | N |
| `content.publish` | Y | Y | N |
| `public_theme.manage` | Y | N | N |
| `public_theme.publish` | Y | N | N |
| `operations.import.manage` | Y | N | N |
| `operations.coordinate_backfill.manage` | Y | N | N |
| `audit.view` | Y | Y | N |
| `staff.manage` | Y | Y | N |
| `manager.manage` | Y | N | N |
| `stats.view` | Y | N | N |
| `menu.manage` | Y | Y | N |

이 표의 의미:

- `SystemAdmin`은 전체 허용
- `Manager`는 콘텐츠 게시까지 포함한 일반 운영 기능을 가진다
- 공개 테마와 운영 도구는 `SystemAdmin` 전용으로 둔다
- `Staff`는 기본적으로 `self.preferences.manage`만 가지고 시작하며, Manager가 허용한 일부 편집 permission만 추가로 가진다

---

## 현재 `/admin` 메뉴 기준 permission 매핑표

현재 프론트의 관리자 메뉴 기준은 [AdminLayout.jsx](/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src/admin/layouts/AdminLayout.jsx)와 [routeDefinitions.js](/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src/app/routeDefinitions.js)를 따른다.

| 화면 | 경로 | 현재 작업 범위 | 접근 permission | 버튼 / 작업별 추가 permission | 기본 노출 역할 |
| --- | --- | --- | --- | --- | --- |
| 그룹 관리 | `/admin/groups`, `/admin/groups/:id` | 그룹, 연락처, 모임 CRUD | `group.manage` | 없음 | SystemAdmin, Manager |
| 지역연합 관리 | `/admin/districts` | 지역연합 CRUD | `district.manage` | 없음 | SystemAdmin, Manager |
| 공지 관리 | `/admin/notices` | 공지 목록, 생성, 수정, 삭제 | `notice.manage` | 게시 상태 저장은 `content.publish` | SystemAdmin, Manager |
| 안내 페이지 | `/admin/content-pages` | 페이지 목록, 생성, 수정, 삭제 | `content_page.manage` | 게시 상태 저장은 `content.publish` | SystemAdmin, Manager |
| 공개 사이트 테마 | `/admin/public-theme` | 테마 상태 조회, 드래프트 저장, 미리보기 | `public_theme.manage` | 게시 / 롤백은 `public_theme.publish` | SystemAdmin |
| 테스트 도구 | `/admin/overview` | import, 좌표 backfill | `operations.import.manage` 또는 `operations.coordinate_backfill.manage` 중 하나 이상 | 패널별로 각각 검사 | SystemAdmin |
| 계정 설정 | `/admin/account` | 내 콘솔 테마 설정 | `self.preferences.manage` | 없음 | 모든 office 사용자 |

추후 화면 예약:

| 화면 | 예상 경로 | 접근 permission | 비고 |
| --- | --- | --- | --- |
| Staff 관리 | `/admin/staff` | `staff.manage` | Manager 이상 |
| Manager 관리 | `/admin/managers` | `manager.manage` | SystemAdmin 전용 |
| 감사 로그 | `/admin/audit` | `audit.view` | 변경 이력 조회 |
| 시스템 통계 | `/admin/stats` | `stats.view` | SystemAdmin 전용 |
| 공개 메뉴 편집 | `/admin/public-menu` | `menu.manage` | 추후 추가 permission 후보 |

---

## 현재 화면 기준 UI 동작 권장안

### 1. 메뉴 노출

- 사용자가 필요한 permission이 없으면 사이드바 메뉴를 숨긴다
- 다만 실제 보호는 UI가 아니라 서버에서 수행한다

### 2. 같은 화면 안의 세부 버튼 제어

- 공지 / 안내 페이지 화면은 `manage` permission만 있으면 편집은 가능하게 하고,
  `content.publish`가 없으면 게시 토글 또는 게시 상태 저장을 막는 편이 좋다
- 공개 테마 화면은 1차에서는 `SystemAdmin` 전용으로 두는 편이 좋다
- 운영 도구 화면도 1차에서는 `SystemAdmin` 전용으로 두는 편이 좋다

### 3. `/admin/overview` 처리

현재는 import와 좌표 backfill이 같은 화면에 있다.

권한이 분리되면 아래 둘 중 하나를 택할 수 있다.

1. 같은 화면을 유지하고 permission이 있는 패널만 보여 준다
2. 추후 `/admin/imports`, `/admin/coordinates`로 분리한다

1차는 1번이 더 구현이 단순하다.

---

## Staff 권한 부여 정책 권장안

Manager가 Staff에게 임의로 아무 permission이나 줄 수 있게 하기보다,
아래 “허용 가능한 Staff permission 집합” 안에서만 부여하게 하는 편이 안전하다.

Staff 기본 상태:

- `self.preferences.manage`만 허용

Manager가 Staff에게 추가로 부여 가능한 권장 집합:

- `district.manage`
- `group.manage`
- `notice.manage`
- `content_page.manage`

1차에서 Manager가 Staff에게 직접 주지 않는 것을 권장:

- `content.publish`
- `public_theme.manage`
- `public_theme.publish`
- `operations.import.manage`
- `operations.coordinate_backfill.manage`
- `audit.view`
- `staff.manage`
- `manager.manage`
- `stats.view`

이유:

- 게시 / 롤백 / 운영 도구 / 감사 조회는 영향 범위가 넓다
- 처음부터 Staff 권한을 넓게 열면 auditing은 남아도 운영 실수의 비용이 커진다

---

## `AuditorAware`와 맞물리는 권장 결정

### 1. auditing은 `username`이 아니라 `AdminUser.id`를 사용한다

추천 이유:

- username은 바뀔 수 있다
- 사람 이름 표기는 `displayName`으로 따로 관리할 수 있다
- 감사 기록의 외래키 안정성이 좋아진다

### 2. principal은 최소 아래 정보를 가져야 한다

- `adminUserId`
- `username`
- `displayName`
- `role`
- `effectivePermissions`

### 3. 주요 엔티티에는 공통 감사 필드를 둔다

- `createdAt`
- `createdBy`
- `updatedAt`
- `updatedBy`

추후 별도 `AuditEvent`를 도입하면,
이 공통 필드는 “현재 상태 메타데이터” 역할을 하고,
`AuditEvent`는 “변경 이력 본문” 역할을 맡게 된다.

---

## 지금 확정하면 좋은 결정

아래 6가지는 지금 결정하면 이후 구현이 훨씬 쉬워진다.

### 1. 사용자당 역할 수

권장안:

- 사용자당 역할 1개만 사용

이유:

- 이해하기 쉽다
- 메뉴 / auditing / 계정 관리 UI가 단순해진다

### 2. Manager의 인사 권한 범위

권장안:

- Manager는 Staff만 관리 가능
- Manager 생성 / 승격 / 비활성화는 SystemAdmin만 가능

### 3. Staff 기본 정책

권장안:

- Staff는 `self.preferences.manage`만 기본 보유
- 그 외에는 Manager가 명시적으로 부여한 permission만 사용

### 4. 게시 권한 분리 여부

권장안:

- `content.publish`, `public_theme.publish`는 별도 permission으로 분리

### 5. 운영 도구 분리 여부

권장안:

- import / backfill은 일반 CRUD와 별도 permission 유지
- 1차 운영에서는 `SystemAdmin` 전용으로 둔다

### 6. 현재 단계의 scope 사용 여부

권장안:

- office 1차에서는 scope를 도입하지 않음
- 모든 office 사용자는 전역 scope
- 추후 `service.aakorea.org`에서 `district`, `group` scope 추가

---

## 현재 합의된 1차 결정

현재까지 합의된 방향은 아래와 같다.

1. `Staff`의 기본 상태는 `self.preferences.manage`만 허용한다
2. `content.publish`는 `Manager` 이상 권한으로 둔다
3. 공개 테마와 운영 도구는 `SystemAdmin` 전용으로 둔다
4. `AdminRole`, `AdminPermission`은 enum 기반으로 시작한다

---

## 다음 단계 제안

구현 순서는 아래가 자연스럽다.

1. `AdminUser` 도입과 현재 로그인 구조 교체
2. `AdminRole`, `AdminPermission` 카탈로그 정의
3. `/api/auth/me` 응답에 role / permission 추가
4. 프론트 메뉴와 버튼을 permission 기준으로 가리기
5. 백엔드 API / 서비스 계층 permission 검사 추가
6. `AuditorAware<AdminUserId>` 기반 auditing 도입

이 흐름을 따르면, 권한 모델과 auditing을 한 번에 연결할 수 있다.
