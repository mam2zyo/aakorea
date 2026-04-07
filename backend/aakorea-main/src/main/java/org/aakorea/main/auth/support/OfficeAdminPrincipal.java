package org.aakorea.main.auth.support;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.domain.AdminUser;
import org.aakorea.main.auth.domain.AdminUserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public final class OfficeAdminPrincipal implements UserDetails, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private final Long adminUserId;
    private final String username;
    private final String passwordHash;
    private final String displayName;
    private final AdminRole role;
    private final AdminUserStatus status;
    private final Set<AdminPermission> permissions;
    private final boolean active;
    private final List<GrantedAuthority> authorities;

    private OfficeAdminPrincipal(
            Long adminUserId,
            String username,
            String passwordHash,
            String displayName,
            AdminRole role,
            AdminUserStatus status,
            Set<AdminPermission> permissions,
            boolean active
    ) {
        this.adminUserId = adminUserId;
        this.username = username;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.role = role;
        this.status = status;
        this.permissions = toPermissionSet(permissions);
        this.active = active;
        this.authorities = Collections.unmodifiableList(buildAuthorities(role, this.permissions));
    }

    public static OfficeAdminPrincipal from(AdminUser adminUser, Set<AdminPermission> permissions) {
        return new OfficeAdminPrincipal(
                adminUser.getId(),
                adminUser.getEmail(),
                adminUser.getPasswordHash(),
                adminUser.getDisplayName(),
                adminUser.getRole(),
                adminUser.resolvedStatus(),
                permissions,
                adminUser.isActive());
    }

    public Long adminUserId() {
        return adminUserId;
    }

    public String displayName() {
        return displayName;
    }

    public AdminRole role() {
        return role;
    }

    public AdminUserStatus status() {
        return status;
    }

    public Set<AdminPermission> permissions() {
        if (permissions.isEmpty()) {
            return EnumSet.noneOf(AdminPermission.class);
        }

        return EnumSet.copyOf(permissions);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

    private static Set<AdminPermission> toPermissionSet(Set<AdminPermission> permissions) {
        if (permissions.isEmpty()) {
            return EnumSet.noneOf(AdminPermission.class);
        }

        return EnumSet.copyOf(permissions);
    }

    private static List<GrantedAuthority> buildAuthorities(AdminRole role, Set<AdminPermission> permissions) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.authority()));
        for (AdminPermission permission : permissions) {
            authorities.add(new SimpleGrantedAuthority(permission.authority()));
        }
        return authorities;
    }
}
