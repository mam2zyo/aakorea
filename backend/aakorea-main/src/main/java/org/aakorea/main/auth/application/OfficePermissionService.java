package org.aakorea.main.auth.application;

import java.util.Collection;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.domain.AdminUser;
import org.aakorea.main.auth.domain.AdminUserStatus;
import org.aakorea.main.auth.domain.AdminUserPermissionGrant;
import org.springframework.stereotype.Service;

@Service
public class OfficePermissionService {

    public EnumSet<AdminPermission> assignableStaffPermissions() {
        return EnumSet.of(
                AdminPermission.DISTRICT_MANAGE,
                AdminPermission.GROUP_MANAGE,
                AdminPermission.NOTICE_MANAGE,
                AdminPermission.CONTENT_PAGE_MANAGE,
                AdminPermission.CONTENT_PUBLISH
        );
    }

    public Set<AdminPermission> resolvePermissions(
            AdminRole role,
            Collection<AdminUserPermissionGrant> permissionGrants
    ) {
        EnumSet<AdminPermission> permissions = defaultPermissions(role);
        for (AdminUserPermissionGrant permissionGrant : permissionGrants) {
            if (permissionGrant.isActive()) {
                permissions.add(permissionGrant.getPermission());
            }
        }
        return permissions;
    }

    public Set<AdminPermission> resolvePermissions(
            AdminUser adminUser,
            Collection<AdminUserPermissionGrant> permissionGrants
    ) {
        if (adminUser.resolvedStatus() != AdminUserStatus.ACTIVE) {
            return EnumSet.noneOf(AdminPermission.class);
        }

        return resolvePermissions(adminUser.getRole(), permissionGrants);
    }

    public List<String> toPermissionKeys(Collection<AdminPermission> permissions) {
        return permissions.stream()
                .map(AdminPermission::getKey)
                .sorted()
                .toList();
    }

    public EnumSet<AdminPermission> defaultPermissions(AdminRole role) {
        return switch (role) {
            case SYSTEM_ADMIN -> EnumSet.allOf(AdminPermission.class);
            case MANAGER -> EnumSet.of(
                    AdminPermission.SELF_PREFERENCES_MANAGE,
                    AdminPermission.DISTRICT_MANAGE,
                    AdminPermission.GROUP_MANAGE,
                    AdminPermission.NOTICE_MANAGE,
                    AdminPermission.CONTENT_PAGE_MANAGE,
                    AdminPermission.CONTENT_PUBLISH,
                    AdminPermission.AUDIT_VIEW,
                    AdminPermission.STAFF_MANAGE,
                    AdminPermission.MENU_MANAGE
            );
            case STAFF -> EnumSet.of(AdminPermission.SELF_PREFERENCES_MANAGE);
        };
    }
}
