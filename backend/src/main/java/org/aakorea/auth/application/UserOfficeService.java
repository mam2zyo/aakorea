package org.aakorea.auth.application;

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
import org.aakorea.auth.domain.Permission;
import org.aakorea.auth.domain.Role;
import org.aakorea.auth.domain.User;
import org.aakorea.auth.domain.UserManagementEvent;
import org.aakorea.auth.domain.UserStatus;
import org.aakorea.auth.domain.UserPermissionGrant;
import org.aakorea.auth.infrastructure.UserManagementEventRepository;
import org.aakorea.auth.infrastructure.UserPermissionGrantRepository;
import org.aakorea.auth.infrastructure.UserRepository;
import org.aakorea.auth.support.OfficePrincipal;
import org.aakorea.core.common.error.FieldValidationException;
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
public class UserOfficeService {

    private final UserRepository userRepository;
    private final UserManagementEventRepository userManagementEventRepository;
    private final UserPermissionGrantRepository userPermissionGrantRepository;
    private final OfficePermissionService officePermissionService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserWorkspaceData getWorkspace() {
        OfficePrincipal actor = currentPrincipal();
        List<User> visibleUsers = userRepository.findAll().stream()
                .filter(user -> canViewUser(actor, user))
                .sorted(userComparator())
                .toList();

        Map<Long, List<UserPermissionGrant>> grantsByUserId = loadActiveGrantsByUserId(visibleUsers);
        Map<Long, List<UserManagementEvent>> managementEventsByUserId = loadRecentManagementEventsByUserId(visibleUsers);
        Map<Long, String> actorLabelsByUserId = loadActorLabelsByUserId(visibleUsers, managementEventsByUserId);

        return new UserWorkspaceData(
                visibleUsers.stream()
                        .map(user -> toUserData(
                                actor,
                                user,
                                grantsByUserId.getOrDefault(user.getId(), List.of()),
                                managementEventsByUserId.getOrDefault(user.getId(), List.of()),
                                actorLabelsByUserId))
                        .toList(),
                creatableRoles(actor).stream()
                        .map(role -> new RoleOptionData(role.name(), roleLabel(role)))
                        .toList(),
                officePermissionService.assignableStaffPermissions().stream()
                        .sorted(Comparator.comparing(Permission::getKey))
                        .map(permission -> new PermissionOptionData(
                                permission.getKey(),
                                permissionLabel(permission),
                                permissionDescription(permission)))
                        .toList()
        );
    }

    @Transactional
    public UserData createUser(CreateUserCommand command) {
        OfficePrincipal actor = currentPrincipal();
        validateCreatableRole(actor, command.role());
        String normalizedEmail = normalizeEmail(command.email());
        validateEmail(normalizedEmail);

        EnumSet<Permission> grantedPermissions = parseGrantedPermissions(command.grantedPermissions());
        validateGrantedPermissions(command.role(), grantedPermissions);
        LocalDateTime changedAt = now();

        User user = userRepository.save(new User(
                normalizedEmail,
                passwordEncoder.encode(command.password()),
                command.displayName().trim(),
                command.role(),
                true,
                UserStatus.ACTIVE,
                changedAt,
                actor.userId()));

        List<UserPermissionGrant> activeGrants = createPermissionGrants(user, grantedPermissions);
        saveManagementEvents(buildCreateEvents(user, command.role(), grantedPermissions));
        Map<Long, List<UserManagementEvent>> managementEventsByUserId =
                loadRecentManagementEventsByUserId(List.of(user));
        return toUserData(
                actor,
                user,
                activeGrants,
                managementEventsByUserId.getOrDefault(user.getId(), List.of()),
                loadActorLabelsByUserId(List.of(user), managementEventsByUserId));
    }

    @Transactional
    public UserData updateUser(Long userId, UpdateUserCommand command) {
        OfficePrincipal actor = currentPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "admin user not found"));

        if (!canEditUser(actor, user)) {
            throw forbidden();
        }

        validateUpdatableRole(actor, command.role());
        validateUpdatableStatus(user, command.status());
        EnumSet<Permission> grantedPermissions = parseGrantedPermissions(command.grantedPermissions());
        validateGrantedPermissions(command.role(), grantedPermissions);
        Role previousRole = user.getRole();
        UserStatus previousStatus = user.resolvedStatus();
        LocalDateTime changedAt = now();

        user.updateManagedProfile(
                command.displayName().trim(),
                command.role(),
                command.status(),
                actor.userId(),
                changedAt);
        if (command.password() != null && !command.password().isBlank()) {
            user.changePassword(passwordEncoder.encode(command.password()));
        }

        PermissionSyncResult permissionSyncResult = syncPermissionGrants(
                actor.userId(),
                user,
                grantedPermissions,
                changedAt);

        List<UserManagementEvent> managementEvents = new ArrayList<>();
        managementEvents.addAll(buildProfileChangeEvents(user, previousRole, previousStatus));
        managementEvents.addAll(permissionSyncResult.events());
        saveManagementEvents(managementEvents);

        Map<Long, List<UserManagementEvent>> managementEventsByUserId =
                loadRecentManagementEventsByUserId(List.of(user));
        return toUserData(
                actor,
                user,
                permissionSyncResult.activeGrants(),
                managementEventsByUserId.getOrDefault(user.getId(), List.of()),
                loadActorLabelsByUserId(List.of(user), managementEventsByUserId));
    }

    private void validateEmail(String email) {
        if (email.isEmpty()) {
            throw FieldValidationException.badRequest("email", "email is required");
        }
        if (userRepository.existsByUsername(email)) {
            throw FieldValidationException.conflict("email", "admin email already exists");
        }
    }

    private void validateCreatableRole(OfficePrincipal actor, Role role) {
        if (role == Role.SYSTEM_ADMIN) {
            throw FieldValidationException.badRequest("role", "SYSTEM_ADMIN cannot be created from admin console");
        }
        if (!creatableRoles(actor).contains(role)) {
            throw forbidden();
        }
    }

    private void validateUpdatableRole(OfficePrincipal actor, Role role) {
        if (role == Role.SYSTEM_ADMIN) {
            throw FieldValidationException.badRequest("role", "SYSTEM_ADMIN cannot be assigned from admin console");
        }
        if (!creatableRoles(actor).contains(role)) {
            throw forbidden();
        }
    }

    private void validateUpdatableStatus(User user, UserStatus status) {
        if (status == UserStatus.PENDING_APPROVAL && !user.isPendingApproval()) {
            throw FieldValidationException.badRequest(
                    "status",
                    "approved user cannot return to pending approval");
        }
    }

    private EnumSet<Permission> parseGrantedPermissions(Collection<String> grantedPermissionKeys) {
        EnumSet<Permission> permissions = EnumSet.noneOf(Permission.class);
        if (grantedPermissionKeys == null) {
            return permissions;
        }

        for (String grantedPermissionKey : grantedPermissionKeys) {
            String normalizedKey = grantedPermissionKey == null ? "" : grantedPermissionKey.trim();
            if (normalizedKey.isEmpty()) {
                continue;
            }

            Permission permission = Permission.fromKey(normalizedKey)
                    .orElseThrow(() -> FieldValidationException.badRequest(
                            "grantedPermissions",
                            "permission is invalid"));
            permissions.add(permission);
        }

        return permissions;
    }

    private void validateGrantedPermissions(Role role, Set<Permission> grantedPermissions) {
        if (role != Role.STAFF && !grantedPermissions.isEmpty()) {
            throw FieldValidationException.badRequest(
                    "grantedPermissions",
                    "extra permission grants are only supported for STAFF");
        }

        EnumSet<Permission> assignableStaffPermissions = officePermissionService.assignableStaffPermissions();
        for (Permission grantedPermission : grantedPermissions) {
            if (!assignableStaffPermissions.contains(grantedPermission)) {
                throw FieldValidationException.badRequest(
                        "grantedPermissions",
                        grantedPermission.getKey() + " cannot be granted to STAFF");
            }
        }
    }

    private List<UserPermissionGrant> createPermissionGrants(
            User user,
            Collection<Permission> grantedPermissions
    ) {
        if (grantedPermissions.isEmpty()) {
            return List.of();
        }

        List<UserPermissionGrant> grants = grantedPermissions.stream()
                .sorted(Comparator.comparing(Permission::getKey))
                .map(permission -> UserPermissionGrant.grant(user, permission))
                .toList();
        return userPermissionGrantRepository.saveAll(grants);
    }

    private PermissionSyncResult syncPermissionGrants(
            Long actorId,
            User user,
            Set<Permission> requestedPermissions,
            LocalDateTime changedAt
    ) {
        List<UserPermissionGrant> currentActiveGrants =
                userPermissionGrantRepository.findAllByUser_IdAndRevokedAtIsNull(user.getId());

        Map<Permission, UserPermissionGrant> grantByPermission = new LinkedHashMap<>();
        for (UserPermissionGrant currentActiveGrant : currentActiveGrants) {
            grantByPermission.put(currentActiveGrant.getPermission(), currentActiveGrant);
        }

        List<UserPermissionGrant> nextActiveGrants = new ArrayList<>();
        List<UserManagementEvent> managementEvents = new ArrayList<>();
        for (UserPermissionGrant currentActiveGrant : currentActiveGrants) {
            if (requestedPermissions.contains(currentActiveGrant.getPermission())) {
                nextActiveGrants.add(currentActiveGrant);
            } else {
                currentActiveGrant.revoke(actorId, changedAt);
                managementEvents.add(UserManagementEvent.permissionRevoked(
                        user,
                        currentActiveGrant.getPermission()));
            }
        }

        List<UserPermissionGrant> newGrants = requestedPermissions.stream()
                .filter(permission -> !grantByPermission.containsKey(permission))
                .sorted(Comparator.comparing(Permission::getKey))
                .map(permission -> UserPermissionGrant.grant(user, permission))
                .toList();

        if (!newGrants.isEmpty()) {
            nextActiveGrants.addAll(userPermissionGrantRepository.saveAll(newGrants));
            newGrants.forEach(permissionGrant -> managementEvents.add(UserManagementEvent.permissionGranted(
                    user,
                    permissionGrant.getPermission())));
        }

        return new PermissionSyncResult(nextActiveGrants, managementEvents);
    }

    private UserData toUserData(
            OfficePrincipal actor,
            User user,
            Collection<UserPermissionGrant> activeGrants,
            Collection<UserManagementEvent> managementEvents,
            Map<Long, String> actorLabelsByUserId
    ) {
        Set<Permission> effectivePermissions =
                officePermissionService.resolvePermissions(user, activeGrants);

        return new UserData(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole().name(),
                roleLabel(user.getRole()),
                user.resolvedStatus().name(),
                statusLabel(user.resolvedStatus()),
                canEditUser(actor, user),
                officePermissionService.toPermissionKeys(activeGrantPermissions(activeGrants)),
                officePermissionService.toPermissionKeys(effectivePermissions),
                user.getApprovedAt(),
                user.getApprovedBy(),
                actorLabelsByUserId.get(user.getApprovedBy()),
                user.getLastLoginAt(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getUpdatedBy(),
                actorLabelsByUserId.get(user.getUpdatedBy()),
                managementEvents.stream()
                        .map(event -> toManagementEventData(event, actorLabelsByUserId))
                        .toList()
        );
    }

    private Set<Permission> activeGrantPermissions(Collection<UserPermissionGrant> activeGrants) {
        EnumSet<Permission> permissions = EnumSet.noneOf(Permission.class);
        for (UserPermissionGrant activeGrant : activeGrants) {
            permissions.add(activeGrant.getPermission());
        }
        return permissions;
    }

    private List<UserManagementEvent> buildCreateEvents(
            User user,
            Role role,
            Collection<Permission> grantedPermissions
    ) {
        List<UserManagementEvent> managementEvents = new ArrayList<>();
        managementEvents.add(UserManagementEvent.accountCreated(user, role));
        grantedPermissions.stream()
                .sorted(Comparator.comparing(Permission::getKey))
                .forEach(permission -> managementEvents.add(UserManagementEvent.permissionGranted(
                        user,
                        permission)));
        return managementEvents;
    }

    private List<UserManagementEvent> buildProfileChangeEvents(
            User user,
            Role previousRole,
            UserStatus previousStatus
    ) {
        List<UserManagementEvent> managementEvents = new ArrayList<>();
        if (previousRole != user.getRole()) {
            managementEvents.add(UserManagementEvent.roleChanged(
                    user,
                    previousRole,
                    user.getRole()));
        }

        UserStatus currentStatus = user.resolvedStatus();
        if (previousStatus == currentStatus) {
            return managementEvents;
        }

        switch (currentStatus) {
            case ACTIVE -> managementEvents.add(previousStatus == UserStatus.PENDING_APPROVAL
                    ? UserManagementEvent.approved(user)
                    : UserManagementEvent.reactivated(user));
            case SUSPENDED -> managementEvents.add(UserManagementEvent.suspended(user));
            case PENDING_APPROVAL -> {
                // 현재 정책에서는 승인 후 다시 pending으로 되돌리지 않는다.
            }
        }
        return managementEvents;
    }

    private void saveManagementEvents(Collection<UserManagementEvent> managementEvents) {
        if (managementEvents.isEmpty()) {
            return;
        }

        userManagementEventRepository.saveAll(managementEvents);
    }

    private Map<Long, List<UserPermissionGrant>> loadActiveGrantsByUserId(List<User> users) {
        Map<Long, List<UserPermissionGrant>> grantsByUserId = new HashMap<>();
        if (users.isEmpty()) {
            return grantsByUserId;
        }

        List<Long> userIds = users.stream()
                .map(User::getId)
                .toList();

        userPermissionGrantRepository.findAllByUser_IdInAndRevokedAtIsNull(userIds)
                .forEach(permissionGrant -> grantsByUserId
                        .computeIfAbsent(permissionGrant.getUser().getId(), ignored -> new ArrayList<>())
                        .add(permissionGrant));

        return grantsByUserId;
    }

    private Map<Long, List<UserManagementEvent>> loadRecentManagementEventsByUserId(List<User> users) {
        Map<Long, List<UserManagementEvent>> eventsByUserId = new HashMap<>();
        if (users.isEmpty()) {
            return eventsByUserId;
        }

        List<Long> userIds = users.stream()
                .map(User::getId)
                .toList();

        userManagementEventRepository.findAllByUser_IdInOrderByCreatedAtDesc(userIds)
                .forEach(event -> {
                    List<UserManagementEvent> history = eventsByUserId
                            .computeIfAbsent(event.getUser().getId(), ignored -> new ArrayList<>());
                    if (history.size() < 6) {
                        history.add(event);
                    }
                });

        return eventsByUserId;
    }

    private Map<Long, String> loadActorLabelsByUserId(
            List<User> users,
            Map<Long, List<UserManagementEvent>> managementEventsByUserId
    ) {
        Set<Long> actorIds = new HashSet<>();
        for (User user : users) {
            if (user.getApprovedBy() != null) {
                actorIds.add(user.getApprovedBy());
            }
            if (user.getUpdatedBy() != null) {
                actorIds.add(user.getUpdatedBy());
            }
            for (UserManagementEvent managementEvent :
                    managementEventsByUserId.getOrDefault(user.getId(), List.of())) {
                if (managementEvent.getCreatedBy() != null) {
                    actorIds.add(managementEvent.getCreatedBy());
                }
            }
        }

        if (actorIds.isEmpty()) {
            return Map.of();
        }

        Map<Long, String> labelsByUserId = new HashMap<>();
        userRepository.findAllByIdIn(actorIds).forEach(user ->
                labelsByUserId.put(user.getId(), actorLabel(user)));
        return labelsByUserId;
    }

    private UserHistoryEventData toManagementEventData(
            UserManagementEvent event,
            Map<Long, String> actorLabelsByUserId
    ) {
        Long actorUserId = event.getCreatedBy();
        return new UserHistoryEventData(
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

    private List<Role> creatableRoles(OfficePrincipal actor) {
        List<Role> roles = new ArrayList<>();
        if (canManageManagers(actor)) {
            roles.add(Role.MANAGER);
        }
        if (canManageStaff(actor)) {
            roles.add(Role.STAFF);
        }
        return roles;
    }

    private boolean canViewUser(OfficePrincipal actor, User user) {
        if (canManageManagers(actor)) {
            return true;
        }

        return user.getRole() == Role.STAFF;
    }

    private boolean canEditUser(OfficePrincipal actor, User user) {
        if (actor.userId().equals(user.getId())) {
            return false;
        }
        if (user.getRole() == Role.SYSTEM_ADMIN) {
            return false;
        }
        if (user.getRole() == Role.MANAGER) {
            return canManageManagers(actor);
        }
        return canManageStaff(actor);
    }

    private boolean canManageManagers(OfficePrincipal actor) {
        return actor.permissions().contains(Permission.MANAGER_MANAGE);
    }

    private boolean canManageStaff(OfficePrincipal actor) {
        return canManageManagers(actor) || actor.permissions().contains(Permission.STAFF_MANAGE);
    }

    private Comparator<User> userComparator() {
        return Comparator.comparingInt((User user) -> switch (user.getRole()) {
                    case SYSTEM_ADMIN -> 0;
                    case MANAGER -> 1;
                    case STAFF -> 2;
                })
                .thenComparing(User::getEmail, String.CASE_INSENSITIVE_ORDER);
    }

    private OfficePrincipal currentPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof OfficePrincipal officePrincipal)) {
            throw forbidden();
        }

        return officePrincipal;
    }

    private AccessDeniedException forbidden() {
        return new AccessDeniedException("forbidden");
    }

    private LocalDateTime now() {
        return LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }

    private String roleLabel(Role role) {
        return switch (role) {
            case SYSTEM_ADMIN -> "System Admin";
            case MANAGER -> "Manager";
            case STAFF -> "Staff";
        };
    }

    private String permissionLabel(Permission permission) {
        return switch (permission) {
            case DISTRICT_MANAGE -> "지역연합 관리";
            case GROUP_MANAGE -> "그룹 및 모임 관리";
            case NOTICE_MANAGE -> "공지 관리";
            case CONTENT_PAGE_MANAGE -> "안내 페이지 관리";
            case CONTENT_PUBLISH -> "게시 권한";
            default -> permission.getKey();
        };
    }

    private String permissionDescription(Permission permission) {
        return switch (permission) {
            case DISTRICT_MANAGE -> "지역연합 생성, 수정, 삭제를 허용합니다.";
            case GROUP_MANAGE -> "그룹, 그룹 연락처, 모임 편집을 허용합니다.";
            case NOTICE_MANAGE -> "공지 초안 작성과 수정을 허용합니다.";
            case CONTENT_PAGE_MANAGE -> "안내 페이지 초안 작성과 수정을 허용합니다.";
            case CONTENT_PUBLISH -> "공지와 안내 페이지의 게시 상태 변경 및 게시 중 문서 수정을 허용합니다.";
            default -> permission.getKey();
        };
    }

    private String statusLabel(UserStatus status) {
        return switch (status) {
            case PENDING_APPROVAL -> "승인 대기";
            case ACTIVE -> "활성";
            case SUSPENDED -> "중지";
        };
    }

    private String managementEventTitle(UserManagementEvent event) {
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

    private String managementEventDetail(UserManagementEvent event) {
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

    private String managementEventAnonymousActorLabel(UserManagementEvent event) {
        return switch (event.getEventType()) {
            case REGISTERED -> "가입 요청";
            default -> "시스템";
        };
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String actorLabel(User user) {
        return user.getDisplayName() + " (" + user.getEmail() + ")";
    }

    public record UserWorkspaceData(
            List<UserData> users,
            List<RoleOptionData> creatableRoles,
            List<PermissionOptionData> staffGrantOptions
    ) {
    }

    public record UserData(
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
            List<UserHistoryEventData> managementHistory
    ) {
    }

    public record UserHistoryEventData(
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

    public record CreateUserCommand(
            String email,
            String displayName,
            Role role,
            String password,
            List<String> grantedPermissions
    ) {
    }

    public record UpdateUserCommand(
            String displayName,
            Role role,
            UserStatus status,
            String password,
            List<String> grantedPermissions
    ) {
    }

    private record PermissionSyncResult(
            List<UserPermissionGrant> activeGrants,
            List<UserManagementEvent> events
    ) {
    }
}
