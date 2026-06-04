package org.aakorea.auth.application;

import java.util.Collection;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import org.aakorea.auth.domain.Permission;
import org.aakorea.auth.domain.Role;
import org.aakorea.auth.domain.User;
import org.aakorea.auth.domain.UserStatus;
import org.aakorea.auth.domain.UserPermissionGrant;
import org.springframework.stereotype.Service;

@Service
public class OfficePermissionService {

    public EnumSet<Permission> assignableStaffPermissions() {
        return EnumSet.of(
                Permission.DISTRICT_MANAGE,
                Permission.GROUP_MANAGE,
                Permission.NOTICE_MANAGE,
                Permission.CONTENT_PAGE_MANAGE,
                Permission.CONTENT_PUBLISH
        );
    }

    public Set<Permission> resolvePermissions(
            Role role,
            Collection<UserPermissionGrant> permissionGrants
    ) {
        EnumSet<Permission> permissions = defaultPermissions(role);
        for (UserPermissionGrant permissionGrant : permissionGrants) {
            if (permissionGrant.isActive()) {
                permissions.add(permissionGrant.getPermission());
            }
        }
        return permissions;
    }

    public Set<Permission> resolvePermissions(
            User user,
            Collection<UserPermissionGrant> permissionGrants
    ) {
        if (user.resolvedStatus() != UserStatus.ACTIVE) {
            return EnumSet.noneOf(Permission.class);
        }

        return resolvePermissions(user.getRole(), permissionGrants);
    }

    public List<String> toPermissionKeys(Collection<Permission> permissions) {
        return permissions.stream()
                .map(Permission::getKey)
                .sorted()
                .toList();
    }

    public EnumSet<Permission> defaultPermissions(Role role) {
        return switch (role) {
            case SYSTEM_ADMIN -> EnumSet.allOf(Permission.class);
            case MANAGER -> EnumSet.of(
                    Permission.SELF_PREFERENCES_MANAGE,
                    Permission.DISTRICT_MANAGE,
                    Permission.GROUP_MANAGE,
                    Permission.NOTICE_MANAGE,
                    Permission.CONTENT_PAGE_MANAGE,
                    Permission.CONTENT_PUBLISH,
                    Permission.AUDIT_VIEW,
                    Permission.STAFF_MANAGE,
                    Permission.MENU_MANAGE
            );
            case STAFF -> EnumSet.of(Permission.SELF_PREFERENCES_MANAGE);
        };
    }
}
