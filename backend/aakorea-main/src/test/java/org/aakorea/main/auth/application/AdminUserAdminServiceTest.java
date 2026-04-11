package org.aakorea.main.auth.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.util.EnumSet;
import java.util.List;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.domain.AdminUser;
import org.aakorea.main.auth.domain.AdminUserManagementEvent;
import org.aakorea.main.auth.domain.AdminUserManagementEventType;
import org.aakorea.main.auth.domain.AdminUserStatus;
import org.aakorea.main.auth.domain.AdminUserPermissionGrant;
import org.aakorea.main.auth.infrastructure.AdminUserManagementEventRepository;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.auth.support.OfficeAdminPrincipal;
import org.aakorea.main.common.error.FieldValidationException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class AdminUserAdminServiceTest {

    @Mock
    private AdminUserRepository adminUserRepository;

    @Mock
    private AdminUserManagementEventRepository adminUserManagementEventRepository;

    @Mock
    private AdminUserPermissionGrantRepository adminUserPermissionGrantRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AdminUserAdminService adminUserAdminService;

    @BeforeEach
    void setUp() {
        adminUserAdminService = new AdminUserAdminService(
                adminUserRepository,
                adminUserManagementEventRepository,
                adminUserPermissionGrantRepository,
                new OfficePermissionService(),
                passwordEncoder);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void managerCreatesStaffWithGrantedPermissions() {
        authenticate(actorPrincipal(
                1L,
                AdminRole.MANAGER,
                EnumSet.of(AdminPermission.STAFF_MANAGE)));

        given(adminUserRepository.existsByUsername("staff-ops@aakorea.org")).willReturn(false);
        given(passwordEncoder.encode("secret-123")).willReturn("{bcrypt}encoded");
        given(adminUserRepository.save(any(AdminUser.class))).willAnswer(invocation -> {
            AdminUser savedAdminUser = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedAdminUser, "id", 20L);
            return savedAdminUser;
        });
        given(adminUserPermissionGrantRepository.saveAll(any())).willAnswer(invocation -> invocation.getArgument(0));

        AdminUserAdminService.AdminUserData result = adminUserAdminService.createAdminUser(
                new AdminUserAdminService.CreateAdminUserCommand(
                        "staff-ops@aakorea.org",
                        "Desk Staff",
                        AdminRole.STAFF,
                        "secret-123",
                        List.of("group.manage", "notice.manage")));

        assertThat(result.email()).isEqualTo("staff-ops@aakorea.org");
        assertThat(result.role()).isEqualTo("STAFF");
        assertThat(result.status()).isEqualTo("ACTIVE");
        assertThat(result.grantedPermissions()).containsExactly("group.manage", "notice.manage");
        assertThat(result.effectivePermissions()).containsExactly(
                "group.manage",
                "notice.manage",
                "self.preferences.manage");
    }

    @Test
    void managerCannotCreateManagerAccount() {
        authenticate(actorPrincipal(
                1L,
                AdminRole.MANAGER,
                EnumSet.of(AdminPermission.STAFF_MANAGE)));

        assertThatThrownBy(() -> adminUserAdminService.createAdminUser(
                new AdminUserAdminService.CreateAdminUserCommand(
                        "manager-ops@aakorea.org",
                        "Ops Manager",
                        AdminRole.MANAGER,
                        "secret-123",
                        List.of())))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("forbidden");
    }

    @Test
    void managerCannotPromoteStaffToManager() {
        authenticate(actorPrincipal(
                1L,
                AdminRole.MANAGER,
                EnumSet.of(AdminPermission.STAFF_MANAGE)));

        AdminUser targetUser = new AdminUser(
                "staff-ops@aakorea.org",
                "{bcrypt}encoded",
                "Desk Staff",
                AdminRole.STAFF,
                true,
                AdminUserStatus.PENDING_APPROVAL,
                null,
                null);
        ReflectionTestUtils.setField(targetUser, "id", 20L);

        given(adminUserRepository.findById(20L)).willReturn(java.util.Optional.of(targetUser));

        assertThatThrownBy(() -> adminUserAdminService.updateAdminUser(
                20L,
                new AdminUserAdminService.UpdateAdminUserCommand(
                        "Desk Manager",
                        AdminRole.MANAGER,
                        AdminUserStatus.ACTIVE,
                        "",
                        List.of())))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("forbidden");
    }

    @Test
    void systemAdminCannotGrantPrivilegedPermissionToStaff() {
        authenticate(actorPrincipal(
                1L,
                AdminRole.SYSTEM_ADMIN,
                EnumSet.of(AdminPermission.MANAGER_MANAGE, AdminPermission.STAFF_MANAGE)));

        given(adminUserRepository.existsByUsername("staff-ops@aakorea.org")).willReturn(false);

        assertThatThrownBy(() -> adminUserAdminService.createAdminUser(
                new AdminUserAdminService.CreateAdminUserCommand(
                        "staff-ops@aakorea.org",
                        "Desk Staff",
                        AdminRole.STAFF,
                        "secret-123",
                        List.of("staff.manage"))))
                .isInstanceOf(FieldValidationException.class)
                .satisfies(error -> {
                    FieldValidationException exception = (FieldValidationException) error;
                    assertThat(exception.getReason()).isEqualTo("staff.manage cannot be granted to STAFF");
                    assertThat(exception.getFields()).containsEntry(
                            "grantedPermissions",
                            "staff.manage cannot be granted to STAFF");
                });
    }

    @Test
    void systemAdminCanPromoteStaffToManagerAndRevokeStaffGrants() {
        authenticate(actorPrincipal(
                1L,
                AdminRole.SYSTEM_ADMIN,
                EnumSet.of(AdminPermission.MANAGER_MANAGE, AdminPermission.STAFF_MANAGE)));

        AdminUser targetUser = new AdminUser(
                "staff-ops@aakorea.org",
                "{bcrypt}encoded",
                "Desk Staff",
                AdminRole.STAFF,
                true,
                AdminUserStatus.PENDING_APPROVAL,
                null,
                null);
        ReflectionTestUtils.setField(targetUser, "id", 20L);

        AdminUserPermissionGrant groupManageGrant = AdminUserPermissionGrant.grant(targetUser, AdminPermission.GROUP_MANAGE);

        given(adminUserRepository.findById(20L)).willReturn(java.util.Optional.of(targetUser));
        given(adminUserPermissionGrantRepository.findAllByAdminUser_IdAndRevokedAtIsNull(20L))
                .willReturn(List.of(groupManageGrant));

        AdminUserAdminService.AdminUserData result = adminUserAdminService.updateAdminUser(
                20L,
                new AdminUserAdminService.UpdateAdminUserCommand(
                        "Desk Manager",
                        AdminRole.MANAGER,
                        AdminUserStatus.ACTIVE,
                        "",
                        List.of()));

        assertThat(result.role()).isEqualTo("MANAGER");
        assertThat(result.status()).isEqualTo("ACTIVE");
        assertThat(result.grantedPermissions()).isEmpty();
        assertThat(targetUser.getDisplayName()).isEqualTo("Desk Manager");
        assertThat(targetUser.getRole()).isEqualTo(AdminRole.MANAGER);
        assertThat(targetUser.isActive()).isTrue();
        assertThat(targetUser.resolvedStatus()).isEqualTo(AdminUserStatus.ACTIVE);
        assertThat(groupManageGrant.isActive()).isFalse();
        assertThat(groupManageGrant.getRevokedBy()).isEqualTo(1L);
        verify(adminUserPermissionGrantRepository).findAllByAdminUser_IdAndRevokedAtIsNull(20L);
        verify(adminUserManagementEventRepository).saveAll(any());
    }

    @Test
    void updateAdminUserRecordsManagementEvents() {
        authenticate(actorPrincipal(
                1L,
                AdminRole.SYSTEM_ADMIN,
                EnumSet.of(AdminPermission.MANAGER_MANAGE, AdminPermission.STAFF_MANAGE)));

        AdminUser targetUser = new AdminUser(
                "staff-ops@aakorea.org",
                "{bcrypt}encoded",
                "Desk Staff",
                AdminRole.STAFF,
                true,
                AdminUserStatus.PENDING_APPROVAL,
                null,
                null);
        ReflectionTestUtils.setField(targetUser, "id", 20L);

        AdminUserPermissionGrant noticeGrant = AdminUserPermissionGrant.grant(targetUser, AdminPermission.NOTICE_MANAGE);

        given(adminUserRepository.findById(20L)).willReturn(java.util.Optional.of(targetUser));
        given(adminUserPermissionGrantRepository.findAllByAdminUser_IdAndRevokedAtIsNull(20L))
                .willReturn(List.of(noticeGrant));
        given(adminUserPermissionGrantRepository.saveAll(any())).willAnswer(invocation -> invocation.getArgument(0));

        adminUserAdminService.updateAdminUser(
                20L,
                new AdminUserAdminService.UpdateAdminUserCommand(
                        "Desk Staff",
                        AdminRole.STAFF,
                        AdminUserStatus.ACTIVE,
                        "",
                        List.of("group.manage")));

        @SuppressWarnings("unchecked")
        org.mockito.ArgumentCaptor<List<AdminUserManagementEvent>> captor =
                org.mockito.ArgumentCaptor.forClass(List.class);
        verify(adminUserManagementEventRepository).saveAll(captor.capture());

        List<AdminUserManagementEventType> eventTypes = captor.getValue().stream()
                .map(AdminUserManagementEvent::getEventType)
                .toList();

        assertThat(eventTypes).containsExactly(
                AdminUserManagementEventType.APPROVED,
                AdminUserManagementEventType.PERMISSION_REVOKED,
                AdminUserManagementEventType.PERMISSION_GRANTED);
    }

    private void authenticate(OfficeAdminPrincipal principal) {
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(
                        principal,
                        "N/A",
                        principal.getAuthorities()));
    }

    private OfficeAdminPrincipal actorPrincipal(Long id, AdminRole role, EnumSet<AdminPermission> permissions) {
        AdminUser actor = new AdminUser("actor@aakorea.org", "{noop}password", "Actor", role, true);
        ReflectionTestUtils.setField(actor, "id", id);
        return OfficeAdminPrincipal.from(actor, permissions);
    }
}
