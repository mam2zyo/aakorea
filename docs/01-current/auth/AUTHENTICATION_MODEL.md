<!-- docs/current/auth/AUTHENTICATION_MODEL.md -->

# AUTHENTICATION_MODEL

## 이 문서의 역할

이 문서는 `office.aakorea.org` 운영 콘솔의 인증 시스템과 백엔드 데이터 모델을 정의한다.

이 문서가 답하는 질문:

- `AdminUser`는 어떤 필드를 가지는가?
- 권한 부여(`Grant`)는 어떻게 처리되는가?
- Spring Security와 어떻게 연동되는가?
- `AuditorAware`는 어떤 값을 반환하는가?

권한 정책의 기준은 `AUTHORIZATION_POLICY.md`를 따른다.

---

## 데이터 모델

### 1. `AdminUser` (운영자 계정)

운영 콘솔에 접근할 수 있는 개별 사용자 엔티티다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `Long` | PK |
| `username` | `String` | 로그인 식별자 (email 등) |
| `passwordHash` | `String` | 암호화된 비밀번호 |
| `displayName` | `String` | UI에 표시되는 이름 |
| `role` | `AdminRole` | 기본 역할 (`SYSTEM_ADMIN`, `MANAGER`, `STAFF`) |
| `status` | `AdminUserStatus` | 계정 상태 (`ACTIVE`, `INACTIVE` 등) |
| `lastLoginAt` | `LocalDateTime` | 마지막 로그인 시각 |

### 2. `AdminUserPermissionGrant` (추가 권한 부여)

사용자의 역할(Role) 외에 추가적으로 부여된 권한 기록이다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `Long` | PK |
| `adminUser` | `AdminUser` | 대상 사용자 |
| `permission` | `AdminPermission` | 부여된 권한 키 |
| `revokedAt` | `LocalDateTime` | 권한 회수 시각 (null이면 활성) |

---

## 인증 매커니즘

### 1. Spring Security 연동
- **Principal**: `OfficeAdminPrincipal` 레코드를 사용하여 현재 사용자의 `id`, `role`, `effectivePermissions`를 세션에 유지한다.
- **Provider**: `DaoAuthenticationProvider`를 통해 DB 기반으로 사용자를 조회하고 비밀번호를 검증한다.

### 2. 권한 계산 (Effective Permissions)
사용자가 가진 최종 권한은 다음과 같이 계산된다:
`최종 권한 = Role에 지정된 기본 권한 + AdminUserPermissionGrant로 추가된 활성 권한`

---

## 감사 시스템 (Auditing)

### SecurityAuditorAware
Spring Data JPA의 `@CreatedBy`, `@LastModifiedBy`에 사용될 식별자를 제공한다.
- **반환 데이터**: `Optional<Long>` (현재 로그인한 `AdminUser.id`)
- **설정**: `JpaAuditingConfig`를 통해 활성화되어 있다.

### AuditEvents
일부 주요 행동(계정 생성, 권한 변경 등)은 `AdminUserManagementEvent`를 통해 별도의 이력으로 기록된다.
- **필드**: `entityType`, `action`, `actorId`, `summary`, `occurredAt` 등
