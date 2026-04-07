package org.aakorea.main.auth.application;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.domain.AdminUser;
import org.aakorea.main.auth.domain.AdminUserManagementEvent;
import org.aakorea.main.auth.domain.AdminUserStatus;
import org.aakorea.main.auth.domain.AdminUserPermissionGrant;
import org.aakorea.main.auth.infrastructure.AdminUserManagementEventRepository;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.auth.support.OfficeAdminPrincipal;
import org.aakorea.main.common.error.FieldValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdminUserAdminService {

    private final AdminUserRepository adminUserRepository;
    private final AdminUserManagementEventRepository adminUserManagementEventRepository;
    private final AdminUserPermissionGrantRepository adminUserPermissionGrantRepository;
    private final OfficePermissionService officePermissionService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public AdminUserWorkspaceData getWorkspace() {
        OfficeAdminPrincipal actor = currentPrincipal();
        List<AdminUser> visibleUsers = adminUserRepository.findAll().stream()
                .filter(adminUser -> canViewUser(actor, adminUser))
                .sorted(adminUserComparator())
                .toList();

        Map<Long, List<AdminUserPermissionGrant>> grantsByUserId = loadActiveGrantsByUserId(visibleUsers);
        Map<Long, List<AdminUserManagementEvent>> managementEventsByUserId = loadRecentManagementEventsByUserId(visibleUsers);
        Map<Long, String> actorLabelsByUserId = loadActorLabelsByUserId(visibleUsers, managementEventsByUserId);

        return new AdminUserWorkspaceData(
                visibleUsers.stream()
                        .map(adminUser -> toAdminUserData(
                                actor,
                                adminUser,
                                grantsByUserId.getOrDefault(adminUser.getId(), List.of()),
                                managementEventsByUserId.getOrDefault(adminUser.getId(), List.of()),
                                actorLabelsByUserId))
                        .toList(),
                creatableRoles(actor).stream()
                        .map(role -> new RoleOptionData(role.name(), roleLabel(role)))
                        .toList(),
                officePermissionService.assignableStaffPermissions().stream()
                        .sorted(Comparator.comparing(AdminPermission::getKey))
                        .map(permission -> new PermissionOptionData(
                                permission.getKey(),
                                permissionLabel(permission),
                                permissionDescription(permission)))
                        .toList()
        );
    }

    @Transactional
    public AdminUserData createAdminUser(CreateAdminUserCommand command) {
        OfficeAdminPrincipal actor = currentPrincipal();
        validateCreatableRole(actor, command.role());
        String normalizedEmail = normalizeEmail(command.email());
        validateEmail(normalizedEmail);

        EnumSet<AdminPermission> grantedPermissions = parseGrantedPermissions(command.grantedPermissions());
        validateGrantedPermissions(command.role(), grantedPermissions);
        LocalDateTime changedAt = now();

        AdminUser adminUser = adminUserRepository.save(new AdminUser(
                normalizedEmail,
                passwordEncoder.encode(command.password()),
                command.displayName().trim(),
                command.role(),
                true,
                AdminUserStatus.ACTIVE,
                changedAt,
                actor.adminUserId()));

        List<AdminUserPermissionGrant> activeGrants = createPermissionGrants(adminUser, grantedPermissions);
        saveManagementEvents(buildCreateEvents(adminUser, command.role(), grantedPermissions));
        Map<Long, List<AdminUserManagementEvent>> managementEventsByUserId =
                loadRecentManagementEventsByUserId(List.of(adminUser));
        return toAdminUserData(
                actor,
                adminUser,
                activeGrants,
                managementEventsByUserId.getOrDefault(adminUser.getId(), List.of()),
                loadActorLabelsByUserId(List.of(adminUser), managementEventsByUserId));
    }

    @Transactional
    public AdminUserData updateAdminUser(Long adminUserId, UpdateAdminUserCommand command) {
        OfficeAdminPrincipal actor = currentPrincipal();
        AdminUser adminUser = adminUserRepository.findById(adminUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "admin user not found"));

        if (!canEditUser(actor, adminUser)) {
            throw forbidden();
        }

        validateUpdatableRole(actor, command.role());
        validateUpdatableStatus(adminUser, command.status());
        EnumSet<AdminPermission> grantedPermissions = parseGrantedPermissions(command.grantedPermissions());
        validateGrantedPermissions(command.role(), grantedPermissions);
        AdminRole previousRole = adminUser.getRole();
        AdminUserStatus previousStatus = adminUser.resolvedStatus();
        LocalDateTime changedAt = now();

        adminUser.updateManagedProfile(
                command.displayName().trim(),
                command.role(),
                command.status(),
                actor.adminUserId(),
                changedAt);
        if (command.password() != null && !command.password().isBlank()) {
            adminUser.changePassword(passwordEncoder.encode(command.password()));
        }

        PermissionSyncResult permissionSyncResult = syncPermissionGrants(
                actor.adminUserId(),
                adminUser,
                grantedPermissions,
                changedAt);

        List<AdminUserManagementEvent> managementEvents = new ArrayList<>();
        managementEvents.addAll(buildProfileChangeEvents(adminUser, previousRole, previousStatus));
        managementEvents.addAll(permissionSyncResult.events());
        saveManagementEvents(managementEvents);

        Map<Long, List<AdminUserManagementEvent>> managementEventsByUserId =
                loadRecentManagementEventsByUserId(List.of(adminUser));
        return toAdminUserData(
                actor,
                adminUser,
                permissionSyncResult.activeGrants(),
                managementEventsByUserId.getOrDefault(adminUser.getId(), List.of()),
                loadActorLabelsByUserId(List.of(adminUser), managementEventsByUserId));
    }

    private void validateEmail(String email) {
        if (email.isEmpty()) {
            throw FieldValidationException.badRequest("email", "email is required");
        }
        if (adminUserRepository.existsByUsername(email)) {
            throw FieldValidationException.conflict("email", "admin email already exists");
        }
    }

    private void validateCreatableRole(OfficeAdminPrincipal actor, AdminRole role) {
        if (role == AdminRole.SYSTEM_ADMIN) {
            throw FieldValidationException.badRequest("role", "SYSTEM_ADMIN cannot be created from admin console");
        }
        if (!creatableRoles(actor).contains(role)) {
            throw forbidden();
        }
    }

    private void validateUpdatableRole(OfficeAdminPrincipal actor, AdminRole role) {
        if (role == AdminRole.SYSTEM_ADMIN) {
            throw FieldValidationException.badRequest("role", "SYSTEM_ADMIN cannot be assigned from admin console");
        }
        if (!creatableRoles(actor).contains(role)) {
            throw forbidden();
        }
    }

    private void validateUpdatableStatus(AdminUser adminUser, AdminUserStatus status) {
        if (status == AdminUserStatus.PENDING_APPROVAL && !adminUser.isPendingApproval()) {
            throw FieldValidationException.badRequest(
                    "status",
                    "approved user cannot return to pending approval");
        }
    }

    private EnumSet<AdminPermission> parseGrantedPermissions(Collection<String> grantedPermissionKeys) {
        EnumSet<AdminPermission> permissions = EnumSet.noneOf(AdminPermission.class);
        if (grantedPermissionKeys == null) {
            return permissions;
        }

        for (String grantedPermissionKey : grantedPermissionKeys) {
            String normalizedKey = grantedPermissionKey == null ? "" : grantedPermissionKey.trim();
            if (normalizedKey.isEmpty()) {
                continue;
            }

            AdminPermission permission = AdminPermission.fromKey(normalizedKey)
                    .orElseThrow(() -> FieldValidationException.badRequest(
                            "grantedPermissions",
                            "permission is invalid"));
            permissions.add(permission);
        }

        return permissions;
    }

    private void validateGrantedPermissions(AdminRole role, Set<AdminPermission> grantedPermissions) {
        if (role != AdminRole.STAFF && !grantedPermissions.isEmpty()) {
            throw FieldValidationException.badRequest(
                    "grantedPermissions",
                    "extra permission grants are only supported for STAFF");
        }

        EnumSet<AdminPermission> assignableStaffPermissions = officePermissionService.assignableStaffPermissions();
        for (AdminPermission grantedPermission : grantedPermissions) {
            if (!assignableStaffPermissions.contains(grantedPermission)) {
                throw FieldValidationException.badRequest(
                        "grantedPermissions",
                        grantedPermission.getKey() + " cannot be granted to STAFF");
            }
        }
    }

    private List<AdminUserPermissionGrant> createPermissionGrants(
            AdminUser adminUser,
            Collection<AdminPermission> grantedPermissions
    ) {
        if (grantedPermissions.isEmpty()) {
            return List.of();
        }

        List<AdminUserPermissionGrant> grants = grantedPermissions.stream()
                .sorted(Comparator.comparing(AdminPermission::getKey))
                .map(permission -> AdminUserPermissionGrant.grant(adminUser, permission))
                .toList();
        return adminUserPermissionGrantRepository.saveAll(grants);
    }

    private PermissionSyncResult syncPermissionGrants(
            Long actorId,
            AdminUser adminUser,
            Set<AdminPermission> requestedPermissions,
            LocalDateTime changedAt
    ) {
        List<AdminUserPermissionGrant> currentActiveGrants =
                adminUserPermissionGrantRepository.findAllByAdminUser_IdAndRevokedAtIsNull(adminUser.getId());

        Map<AdminPermission, AdminUserPermissionGrant> grantByPermission = new LinkedHashMap<>();
        for (AdminUserPermissionGrant currentActiveGrant : currentActiveGrants) {
            grantByPermission.put(currentActiveGrant.getPermission(), currentActiveGrant);
        }

        List<AdminUserPermissionGrant> nextActiveGrants = new ArrayList<>();
        List<AdminUserManagementEvent> managementEvents = new ArrayList<>();
        for (AdminUserPermissionGrant currentActiveGrant : currentActiveGrants) {
            if (requestedPermissions.contains(currentActiveGrant.getPermission())) {
                nextActiveGrants.add(currentActiveGrant);
            } else {
                currentActiveGrant.revoke(actorId, changedAt);
                managementEvents.add(AdminUserManagementEvent.permissionRevoked(
                        adminUser,
                        currentActiveGrant.getPermission()));
            }
        }

        List<AdminUserPermissionGrant> newGrants = requestedPermissions.stream()
                .filter(permission -> !grantByPermission.containsKey(permission))
                .sorted(Comparator.comparing(AdminPermission::getKey))
                .map(permission -> AdminUserPermissionGrant.grant(adminUser, permission))
                .toList();

        if (!newGrants.isEmpty()) {
            nextActiveGrants.addAll(adminUserPermissionGrantRepository.saveAll(newGrants));
            newGrants.forEach(permissionGrant -> managementEvents.add(AdminUserManagementEvent.permissionGranted(
                    adminUser,
                    permissionGrant.getPermission())));
        }

        return new PermissionSyncResult(nextActiveGrants, managementEvents);
    }

    private AdminUserData toAdminUserData(
            OfficeAdminPrincipal actor,
            AdminUser adminUser,
            Collection<AdminUserPermissionGrant> activeGrants,
            Collection<AdminUserManagementEvent> managementEvents,
            Map<Long, String> actorLabelsByUserId
    ) {
        Set<AdminPermission> effectivePermissions =
                officePermissionService.resolvePermissions(adminUser, activeGrants);

        return new AdminUserData(
                adminUser.getId(),
                adminUser.getEmail(),
                adminUser.getDisplayName(),
                adminUser.getRole().name(),
                roleLabel(adminUser.getRole()),
                adminUser.resolvedStatus().name(),
                statusLabel(adminUser.resolvedStatus()),
                canEditUser(actor, adminUser),
                officePermissionService.toPermissionKeys(activeGrantPermissions(activeGrants)),
                officePermissionService.toPermissionKeys(effectivePermissions),
                adminUser.getApprovedAt(),
                adminUser.getApprovedBy(),
                actorLabelsByUserId.get(adminUser.getApprovedBy()),
                adminUser.getLastLoginAt(),
                adminUser.getCreatedAt(),
                adminUser.getUpdatedAt(),
                adminUser.getUpdatedBy(),
                actorLabelsByUserId.get(adminUser.getUpdatedBy()),
                managementEvents.stream()
                        .map(event -> toManagementEventData(event, actorLabelsByUserId))
                        .toList()
        );
    }

    private Set<AdminPermission> activeGrantPermissions(Collection<AdminUserPermissionGrant> activeGrants) {
        EnumSet<AdminPermission> permissions = EnumSet.noneOf(AdminPermission.class);
        for (AdminUserPermissionGrant activeGrant : activeGrants) {
            permissions.add(activeGrant.getPermission());
        }
        return permissions;
    }

    private List<AdminUserManagementEvent> buildCreateEvents(
            AdminUser adminUser,
            AdminRole role,
            Collection<AdminPermission> grantedPermissions
    ) {
        List<AdminUserManagementEvent> managementEvents = new ArrayList<>();
        managementEvents.add(AdminUserManagementEvent.accountCreated(adminUser, role));
        grantedPermissions.stream()
                .sorted(Comparator.comparing(AdminPermission::getKey))
                .forEach(permission -> managementEvents.add(AdminUserManagementEvent.permissionGranted(
                        adminUser,
                        permission)));
        return managementEvents;
    }

    private List<AdminUserManagementEvent> buildProfileChangeEvents(
            AdminUser adminUser,
            AdminRole previousRole,
            AdminUserStatus previousStatus
    ) {
        List<AdminUserManagementEvent> managementEvents = new ArrayList<>();
        if (previousRole != adminUser.getRole()) {
            managementEvents.add(AdminUserManagementEvent.roleChanged(
                    adminUser,
                    previousRole,
                    adminUser.getRole()));
        }

        AdminUserStatus currentStatus = adminUser.resolvedStatus();
        if (previousStatus == currentStatus) {
            return managementEvents;
        }

        switch (currentStatus) {
            case ACTIVE -> managementEvents.add(previousStatus == AdminUserStatus.PENDING_APPROVAL
                    ? AdminUserManagementEvent.approved(adminUser)
                    : AdminUserManagementEvent.reactivated(adminUser));
            case SUSPENDED -> managementEvents.add(AdminUserManagementEvent.suspended(adminUser));
            case PENDING_APPROVAL -> {
                // 현재 정책에서는 승인 후 다시 pending으로 되돌리지 않는다.
            }
        }
        return managementEvents;
    }

    private void saveManagementEvents(Collection<AdminUserManagementEvent> managementEvents) {
        if (managementEvents.isEmpty()) {
            return;
        }

        adminUserManagementEventRepository.saveAll(managementEvents);
    }

    private Map<Long, List<AdminUserPermissionGrant>> loadActiveGrantsByUserId(List<AdminUser> adminUsers) {
        Map<Long, List<AdminUserPermissionGrant>> grantsByUserId = new HashMap<>();
        if (adminUsers.isEmpty()) {
            return grantsByUserId;
        }

        List<Long> adminUserIds = adminUsers.stream()
                .map(AdminUser::getId)
                .toList();

        adminUserPermissionGrantRepository.findAllByAdminUser_IdInAndRevokedAtIsNull(adminUserIds)
                .forEach(permissionGrant -> grantsByUserId
                        .computeIfAbsent(permissionGrant.getAdminUser().getId(), ignored -> new ArrayList<>())
                        .add(permissionGrant));

        return grantsByUserId;
    }

    private Map<Long, List<AdminUserManagementEvent>> loadRecentManagementEventsByUserId(List<AdminUser> adminUsers) {
        Map<Long, List<AdminUserManagementEvent>> eventsByUserId = new HashMap<>();
        if (adminUsers.isEmpty()) {
            return eventsByUserId;
        }

        List<Long> adminUserIds = adminUsers.stream()
                .map(AdminUser::getId)
                .toList();

        adminUserManagementEventRepository.findAllByAdminUser_IdInOrderByCreatedAtDesc(adminUserIds)
                .forEach(event -> {
                    List<AdminUserManagementEvent> history = eventsByUserId
                            .computeIfAbsent(event.getAdminUser().getId(), ignored -> new ArrayList<>());
                    if (history.size() < 6) {
                        history.add(event);
                    }
                });

        return eventsByUserId;
    }

    private Map<Long, String> loadActorLabelsByUserId(
            List<AdminUser> adminUsers,
            Map<Long, List<AdminUserManagementEvent>> managementEventsByUserId
    ) {
        Set<Long> actorIds = new HashSet<>();
        for (AdminUser adminUser : adminUsers) {
            if (adminUser.getApprovedBy() != null) {
                actorIds.add(adminUser.getApprovedBy());
            }
            if (adminUser.getUpdatedBy() != null) {
                actorIds.add(adminUser.getUpdatedBy());
            }
            for (AdminUserManagementEvent managementEvent :
                    managementEventsByUserId.getOrDefault(adminUser.getId(), List.of())) {
                if (managementEvent.getCreatedBy() != null) {
                    actorIds.add(managementEvent.getCreatedBy());
                }
            }
        }

        if (actorIds.isEmpty()) {
            return Map.of();
        }

        Map<Long, String> labelsByUserId = new HashMap<>();
        adminUserRepository.findAllByIdIn(actorIds).forEach(adminUser ->
                labelsByUserId.put(adminUser.getId(), actorLabel(adminUser)));
        return labelsByUserId;
    }

    private AdminUserHistoryEventData toManagementEventData(
            AdminUserManagementEvent event,
            Map<Long, String> actorLabelsByUserId
    ) {
        Long actorUserId = event.getCreatedBy();
        return new AdminUserHistoryEventData(
                event.getId(),
                event.getEventType().name(),
                managementEventTitle(event),
                managementEventDetail(event),
                event.getCreatedAt(),
                actorUserId,
                actorUserId == null
                        ? managementEventAnonymousActorLabel(event)
                        : actorLabelsByUserId.getOrDefault(actorUserId, "알 수 없는 운영자"));
    }

    private List<AdminRole> creatableRoles(OfficeAdminPrincipal actor) {
        List<AdminRole> roles = new ArrayList<>();
        if (canManageManagers(actor)) {
            roles.add(AdminRole.MANAGER);
        }
        if (canManageStaff(actor)) {
            roles.add(AdminRole.STAFF);
        }
        return roles;
    }

    private boolean canViewUser(OfficeAdminPrincipal actor, AdminUser adminUser) {
        if (canManageManagers(actor)) {
            return true;
        }

        return adminUser.getRole() == AdminRole.STAFF;
    }

    private boolean canEditUser(OfficeAdminPrincipal actor, AdminUser adminUser) {
        if (actor.adminUserId().equals(adminUser.getId())) {
            return false;
        }
        if (adminUser.getRole() == AdminRole.SYSTEM_ADMIN) {
            return false;
        }
        if (adminUser.getRole() == AdminRole.MANAGER) {
            return canManageManagers(actor);
        }
        return canManageStaff(actor);
    }

    private boolean canManageManagers(OfficeAdminPrincipal actor) {
        return actor.permissions().contains(AdminPermission.MANAGER_MANAGE);
    }

    private boolean canManageStaff(OfficeAdminPrincipal actor) {
        return canManageManagers(actor) || actor.permissions().contains(AdminPermission.STAFF_MANAGE);
    }

    private Comparator<AdminUser> adminUserComparator() {
        return Comparator.comparingInt((AdminUser adminUser) -> switch (adminUser.getRole()) {
                    case SYSTEM_ADMIN -> 0;
                    case MANAGER -> 1;
                    case STAFF -> 2;
                })
                .thenComparing(AdminUser::getEmail, String.CASE_INSENSITIVE_ORDER);
    }

    private OfficeAdminPrincipal currentPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof OfficeAdminPrincipal officeAdminPrincipal)) {
            throw forbidden();
        }

        return officeAdminPrincipal;
    }

    private AccessDeniedException forbidden() {
        return new AccessDeniedException("forbidden");
    }

    private LocalDateTime now() {
        return LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }

    private String roleLabel(AdminRole role) {
        return switch (role) {
            case SYSTEM_ADMIN -> "System Admin";
            case MANAGER -> "Manager";
            case STAFF -> "Staff";
        };
    }

    private String permissionLabel(AdminPermission permission) {
        return switch (permission) {
            case DISTRICT_MANAGE -> "지역연합 관리";
            case GROUP_MANAGE -> "그룹 및 모임 관리";
            case NOTICE_MANAGE -> "공지 관리";
            case CONTENT_PAGE_MANAGE -> "안내 페이지 관리";
            case CONTENT_PUBLISH -> "게시 권한";
            default -> permission.getKey();
        };
    }

    private String permissionDescription(AdminPermission permission) {
        return switch (permission) {
            case DISTRICT_MANAGE -> "지역연합 생성, 수정, 삭제를 허용합니다.";
            case GROUP_MANAGE -> "그룹, 그룹 연락처, 모임 편집을 허용합니다.";
            case NOTICE_MANAGE -> "공지 초안 작성과 수정을 허용합니다.";
            case CONTENT_PAGE_MANAGE -> "안내 페이지 초안 작성과 수정을 허용합니다.";
            case CONTENT_PUBLISH -> "공지와 안내 페이지의 게시 상태 변경 및 게시 중 문서 수정을 허용합니다.";
            default -> permission.getKey();
        };
    }

    private String statusLabel(AdminUserStatus status) {
        return switch (status) {
            case PENDING_APPROVAL -> "승인 대기";
            case ACTIVE -> "활성";
            case SUSPENDED -> "중지";
        };
    }

    private String managementEventTitle(AdminUserManagementEvent event) {
        return switch (event.getEventType()) {
            case REGISTERED -> "등록 요청";
            case ACCOUNT_CREATED -> "계정 생성";
            case APPROVED -> "승인 처리";
            case SUSPENDED -> "계정 중지";
            case REACTIVATED -> "계정 재활성화";
            case ROLE_CHANGED -> "역할 변경";
            case PERMISSION_GRANTED -> "권한 부여";
            case PERMISSION_REVOKED -> "권한 회수";
        };
    }

    private String managementEventDetail(AdminUserManagementEvent event) {
        return switch (event.getEventType()) {
            case REGISTERED -> "GSO Staff 등록을 통해 승인 요청이 생성되었습니다.";
            case ACCOUNT_CREATED -> roleLabel(event.getNextRole()) + " 계정으로 생성되었습니다.";
            case APPROVED -> "승인 대기 계정을 활성화했습니다.";
            case SUSPENDED -> "운영 콘솔 접근을 중지했습니다.";
            case REACTIVATED -> "중지된 운영 계정을 다시 활성화했습니다.";
            case ROLE_CHANGED -> roleLabel(event.getPreviousRole()) + " -> " + roleLabel(event.getNextRole());
            case PERMISSION_GRANTED, PERMISSION_REVOKED -> permissionLabel(event.getPermission());
        };
    }

    private String managementEventAnonymousActorLabel(AdminUserManagementEvent event) {
        return switch (event.getEventType()) {
            case REGISTERED -> "가입 요청";
            default -> "시스템";
        };
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String actorLabel(AdminUser adminUser) {
        return adminUser.getDisplayName() + " (" + adminUser.getEmail() + ")";
    }

    public record AdminUserWorkspaceData(
            List<AdminUserData> users,
            List<RoleOptionData> creatableRoles,
            List<PermissionOptionData> staffGrantOptions
    ) {
    }

    public record AdminUserData(
            Long id,
            String email,
            String displayName,
            String role,
            String roleLabel,
            String status,
            String statusLabel,
            boolean editable,
            List<String> grantedPermissions,
            List<String> effectivePermissions,
            LocalDateTime approvedAt,
            Long approvedByUserId,
            String approvedByLabel,
            LocalDateTime lastLoginAt,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Long updatedByUserId,
            String updatedByLabel,
            List<AdminUserHistoryEventData> managementHistory
    ) {
    }

    public record AdminUserHistoryEventData(
            Long id,
            String eventType,
            String title,
            String detail,
            LocalDateTime happenedAt,
            Long actorUserId,
            String actorLabel
    ) {
    }

    public record RoleOptionData(String value, String label) {
    }

    public record PermissionOptionData(String key, String label, String description) {
    }

    public record CreateAdminUserCommand(
            String email,
            String displayName,
            AdminRole role,
            String password,
            List<String> grantedPermissions
    ) {
    }

    public record UpdateAdminUserCommand(
            String displayName,
            AdminRole role,
            AdminUserStatus status,
            String password,
            List<String> grantedPermissions
    ) {
    }

    private record PermissionSyncResult(
            List<AdminUserPermissionGrant> activeGrants,
            List<AdminUserManagementEvent> events
    ) {
    }
}
