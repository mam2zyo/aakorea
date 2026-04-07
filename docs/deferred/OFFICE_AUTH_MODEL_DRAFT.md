<!-- docs/deferred/OFFICE_AUTH_MODEL_DRAFT.md -->

# OFFICE_AUTH_MODEL_DRAFT

## 이 문서의 역할

이 문서는 `office.aakorea.org` 1차 권한 모델을 실제 백엔드 코드와 DB 구조로 옮길 때의
엔티티 / enum / principal / auditing 초안을 정리한다.

이 문서가 답하는 질문:

- `AdminUser`는 어떤 필드를 가져야 하는가?
- 추가 권한 부여는 어떤 엔티티로 표현하는가?
- `AuditorAware`는 무엇을 반환해야 하는가?
- `/api/auth/me`는 어떤 형태로 확장하는가?

이 문서에 포함하지 않는 내용:

- 최종 UI 상세
- `service.aakorea.org`의 scope 기반 위임 모델
- SSO / OAuth / 외부 인증 통합
- 감사 로그 diff 저장 모델의 최종안

권한 정책 자체의 기준은 `OFFICE_AUTHORIZATION_DRAFT.md`를 따른다.

---

## 현재 상태와 이번 초안의 목표

현재 auth 구조는 아래에 가깝다.

- env 기반 단일 관리자 계정
- Spring Security `InMemoryUserDetailsManager`
- `/api/auth/me`는 `username`만 반환
- `AuditorAware`, JPA auditing, 운영자 DB 계정 모델은 아직 없음

이번 초안의 목표는 아래다.

- 운영자를 DB 엔티티로 도입한다
- role / permission은 enum으로 고정한다
- 추가 권한만 DB에 저장한다
- `AuditorAware<Long>`로 `AdminUser.id`를 반환하게 한다
- 이후 `createdBy`, `updatedBy`를 주요 도메인에 붙일 수 있게 한다

---

## 권장 패키지 초안

현재 `auth` 패키지에는 controller/service만 있으므로,
1차 구현에서는 아래 정도를 추가하는 방향을 권장한다.

```text
org.aakorea.main.auth
├─ api
│  └─ AuthController.java
├─ application
│  ├─ AuthService.java
│  ├─ OfficePermissionService.java
│  └─ OfficeUserBootstrapService.java
├─ domain
│  ├─ AdminUser.java
│  ├─ AdminRole.java
│  ├─ AdminPermission.java
│  └─ AdminUserPermissionGrant.java
├─ infrastructure
│  ├─ AdminUserRepository.java
│  └─ AdminUserPermissionGrantRepository.java
└─ support
   └─ OfficeAdminPrincipal.java

org.aakorea.main.common
├─ audit
│  ├─ AuditFields.java
│  ├─ JpaAuditingConfig.java
│  └─ SecurityAuditorAware.java
└─ security
   └─ SecurityConfig.java
```

`OfficeAdminPrincipal`은 실제 인증 주체이고,
`SecurityAuditorAware`는 이 principal에서 `adminUserId`를 꺼내는 역할을 맡는다.

---

## Enum 초안

### 1. `AdminRole`

```java
public enum AdminRole {
    SYSTEM_ADMIN,
    MANAGER,
    STAFF
}
```

규칙:

- 사용자당 역할은 1개만 가진다
- 역할 자체는 DB 테이블로 분리하지 않고 enum으로 고정한다

### 2. `AdminPermission`

권한은 enum 이름과 외부 노출용 key를 함께 가지는 형태를 권장한다.

```java
public enum AdminPermission {
    SELF_PREFERENCES_MANAGE("self.preferences.manage"),
    DISTRICT_MANAGE("district.manage"),
    GROUP_MANAGE("group.manage"),
    NOTICE_MANAGE("notice.manage"),
    CONTENT_PAGE_MANAGE("content_page.manage"),
    CONTENT_PUBLISH("content.publish"),
    PUBLIC_THEME_MANAGE("public_theme.manage"),
    PUBLIC_THEME_PUBLISH("public_theme.publish"),
    OPERATIONS_IMPORT_MANAGE("operations.import.manage"),
    OPERATIONS_COORDINATE_BACKFILL_MANAGE("operations.coordinate_backfill.manage"),
    AUDIT_VIEW("audit.view"),
    STAFF_MANAGE("staff.manage"),
    MANAGER_MANAGE("manager.manage"),
    STATS_VIEW("stats.view"),
    MENU_MANAGE("menu.manage");

    private final String key;
}
```

권장 규칙:

- DB에는 enum name 그대로 저장해도 되고, `key` 문자열을 저장해도 된다
- 1차는 JPA `@Enumerated(EnumType.STRING)`로 저장하는 편이 단순하다
- API 응답에는 enum name보다 `key` 문자열을 내려주는 편이 프론트와 읽기 쉽다

---

## 공통 감사 필드 초안

핵심 판단:

- `createdBy`, `updatedBy`는 `AdminUser` 엔티티 참조보다 `Long adminUserId` scalar로 시작하는 편이 좋다
- 이유는 `AuditorAware<Long>`와 잘 맞고, 순환 참조 / lazy loading 부담이 적기 때문이다

권장 `@MappedSuperclass` 초안:

```java
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditFields {

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @CreatedBy
    @Column(updatable = false)
    private Long createdBy;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @LastModifiedBy
    private Long updatedBy;
}
```

비고:

- `createdBy`, `updatedBy`는 bootstrap root 계정 생성 같은 예외를 위해 initially nullable로 두는 편이 안전하다
- 실제 주요 도메인 확장 시점에 nullable 유지 여부를 다시 판단할 수 있다

---

## `AdminUser` 엔티티 초안

### 권장 의미

- `AdminUser`는 office 운영 콘솔에 로그인할 수 있는 실제 계정이다
- auditing의 actor 기준도 이 엔티티의 `id`다

### 권장 필드

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | `Long` | Y | PK |
| `username` | `String` | Y | 로그인 ID, unique |
| `passwordHash` | `String` | Y | Spring Security delegating password |
| `displayName` | `String` | Y | UI 표시용 이름 |
| `role` | `AdminRole` | Y | 사용자 기본 역할 |
| `active` | `boolean` | Y | 비활성화 시 로그인 차단 |
| `lastLoginAt` | `LocalDateTime` | N | 마지막 로그인 시각 |
| `createdAt` | `LocalDateTime` | Y | auditing |
| `createdBy` | `Long` | N | auditing |
| `updatedAt` | `LocalDateTime` | Y | auditing |
| `updatedBy` | `Long` | N | auditing |

### 권장 JPA 초안

```java
@Getter
@Entity
@Table(name = "admin_users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUser extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private AdminRole role;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
}
```

### 권장 규칙

- `username`은 stable identifier로 보고 쉽게 바꾸지 않는다
- 삭제 대신 `active=false`로 비활성화한다
- `displayName`은 자유롭게 바꿀 수 있다
- root / bootstrap 계정도 결국 `AdminUser` 레코드를 가져야 한다

---

## `AdminUserPermissionGrant` 엔티티 초안

### 왜 별도 엔티티가 필요한가

역할은 기본 permission 묶음이고,
`Staff`에게 추가 권한을 붙이기 위해서는 별도 grant 레코드가 필요하다.

핵심 계산식:

`effectivePermissions = role 기본 permission + active grant`

1차에서는 deny 모델을 두지 않는다.

### 권장 필드

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | `Long` | Y | PK |
| `adminUserId` | `Long` 또는 연관관계 | Y | 대상 운영자 |
| `permission` | `AdminPermission` | Y | 추가 허용할 permission |
| `revokedAt` | `LocalDateTime` | N | 회수 시각 |
| `revokedBy` | `Long` | N | 회수한 운영자 |
| `createdAt` | `LocalDateTime` | Y | grant 생성 시각 |
| `createdBy` | `Long` | N | grant 부여자 |
| `updatedAt` | `LocalDateTime` | Y | auditing |
| `updatedBy` | `Long` | N | auditing |

### 권장 JPA 초안

```java
@Getter
@Entity
@Table(name = "admin_user_permission_grants")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUserPermissionGrant extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_user_id", nullable = false)
    private AdminUser adminUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 80)
    private AdminPermission permission;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @Column(name = "revoked_by")
    private Long revokedBy;

    public boolean isActive() {
        return revokedAt == null;
    }

    public void revoke(Long actorId, LocalDateTime revokedAt) {
        this.revokedBy = actorId;
        this.revokedAt = revokedAt;
    }
}
```

### 권장 규칙

- 같은 사용자 + 같은 permission의 활성 grant는 1개만 허용한다
- revoke는 row 삭제 대신 `revokedAt`, `revokedBy`를 채운다
- `Manager`는 Staff 대상 grant만 만들 수 있고, 허용 집합 밖 permission은 줄 수 없다

PostgreSQL을 전제로 하면,
나중에 아래 partial unique index도 검토할 수 있다.

```sql
create unique index uq_admin_user_active_permission
on admin_user_permission_grants (admin_user_id, permission)
where revoked_at is null;
```

---

## role 기본 permission 계산 초안

권한은 DB에서 매번 role-permission 조인을 하지 않고,
코드에서 role 기본 permission을 계산하는 방식이 단순하다.

예:

```java
public final class AdminRoleDefaults {

    public static Set<AdminPermission> defaultPermissions(AdminRole role) {
        return switch (role) {
            case SYSTEM_ADMIN -> EnumSet.allOf(AdminPermission.class);
            case MANAGER -> EnumSet.of(
                    SELF_PREFERENCES_MANAGE,
                    DISTRICT_MANAGE,
                    GROUP_MANAGE,
                    NOTICE_MANAGE,
                    CONTENT_PAGE_MANAGE,
                    CONTENT_PUBLISH,
                    AUDIT_VIEW,
                    STAFF_MANAGE,
                    MENU_MANAGE
            );
            case STAFF -> EnumSet.of(SELF_PREFERENCES_MANAGE);
        };
    }
}
```

최종 계산:

1. `AdminUser.role`의 기본 permission 계산
2. 활성 grant 추가
3. 정렬해서 principal과 `/api/auth/me` 응답에 반영

---

## `OfficeAdminPrincipal` 초안

`Authentication.getPrincipal()`에는 최소 아래 정보가 있어야 한다.

| 필드 | 설명 |
| --- | --- |
| `adminUserId` | auditing actor ID |
| `username` | 로그인 식별자 |
| `displayName` | UI 표시용 |
| `role` | 현재 역할 |
| `permissions` | 최종 effective permission |
| `active` | 활성 계정 여부 |

예시:

```java
public record OfficeAdminPrincipal(
        Long adminUserId,
        String username,
        String displayName,
        AdminRole role,
        Set<AdminPermission> permissions,
        boolean active
) implements UserDetails {
}
```

비고:

- `getAuthorities()`는 `ROLE_SYSTEM_ADMIN` 같은 role authority와
  `PERM_group.manage` 같은 permission authority를 함께 만들 수 있다
- 1차는 permission 검사 중심으로 가되, role은 운영 화면 표시와 정책 판단에 같이 쓸 수 있다

---

## `/api/auth/me` 응답 초안

현재는 `username`만 내려주지만, 1차 확장안은 아래 정도가 적절하다.

```json
{
  "data": {
    "authenticated": true,
    "userId": 1,
    "username": "root",
    "displayName": "System Administrator",
    "role": "SYSTEM_ADMIN",
    "permissions": [
      "self.preferences.manage",
      "group.manage",
      "content.publish"
    ]
  }
}
```

권장 이유:

- 프론트가 메뉴 노출과 버튼 상태를 즉시 계산할 수 있다
- `AuditorAware` actor와 프론트 세션 표시가 같은 사용자 모델을 바라보게 된다

---

## `AuditorAware` 초안

권장 타입:

- `AuditorAware<Long>`

예시:

```java
@Component
public class SecurityAuditorAware implements AuditorAware<Long> {

    @Override
    public Optional<Long> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        if (!(authentication.getPrincipal() instanceof OfficeAdminPrincipal principal)) {
            return Optional.empty();
        }
        return Optional.ofNullable(principal.adminUserId());
    }
}
```

핵심 판단:

- auditing은 `username`이 아니라 `adminUserId`를 반환한다
- unauthenticated / bootstrap 상황은 `Optional.empty()`를 허용한다

---

## bootstrap 방식 초안

현재 env 기반 관리자 계정을 완전히 없애기보다,
초기 1회 root 계정 bootstrap 용도로만 유지하는 편이 좋다.

권장 흐름:

1. 앱 시작 시 `AdminAuthProperties`를 읽는다
2. 같은 `username`의 `AdminUser`가 없으면 `SYSTEM_ADMIN` 계정으로 생성한다
3. 있으면 비밀번호와 표시 이름 갱신 정책은 별도 선택한다
4. 실제 로그인은 `InMemoryUserDetailsManager`가 아니라 `AdminUserRepository` 기준으로 수행한다

이 방식의 장점:

- 운영자도 결국 DB의 `AdminUser.id`를 가진다
- root 계정도 auditing actor가 될 수 있다
- `AuditorAware`가 null actor로 흔들리는 경우를 줄일 수 있다

---

## 주요 서비스 초안

### 1. `AuthService`

현재 책임에서 아래를 추가한다.

- 로그인 성공 시 `lastLoginAt` 업데이트
- `/me` 응답에 `userId`, `displayName`, `role`, `permissions` 포함

### 2. `OfficePermissionService`

권장 책임:

- role 기본 permission 계산
- 활성 grant 로딩
- 최종 effective permission 조합
- `canManageStaffPermissions(granter, permission)` 같은 정책 메서드

### 3. `OfficeUserBootstrapService`

권장 책임:

- env 기반 root 계정 bootstrap
- 최초 운영 환경에서 최소 1명의 `SYSTEM_ADMIN` 존재 보장

---

## 구현 순서 초안

아래 순서가 무난하다.

1. `AdminRole`, `AdminPermission` enum 추가
2. `AuditFields`, `JpaAuditingConfig`, `SecurityAuditorAware` 추가
3. `AdminUser`, `AdminUserPermissionGrant` 엔티티와 repository 추가
4. bootstrap root 계정 생성 로직 추가
5. `InMemoryUserDetailsManager`를 DB 기반 로더로 교체
6. `OfficeAdminPrincipal` 도입
7. `/api/auth/me` 응답 확장
8. 각 admin API에 permission 검사 추가
9. 주요 도메인에 `createdBy`, `updatedBy` 적용

---

## 지금 일부러 하지 않는 것

1차에서는 아래를 하지 않는 편이 좋다.

- 사용자 다중 역할
- deny permission
- scope 기반 district / group 제한
- role / permission 자체를 DB에서 자유 편집
- 외부 auth 서버 분리
- `createdBy`, `updatedBy`를 `@ManyToOne AdminUser`로 바로 연결

이 항목들은 모두 복잡도를 크게 올리지만,
현재 office 1차 요구에는 꼭 필요하지 않다.

