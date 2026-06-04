package org.aakorea.auth.support;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import org.aakorea.auth.domain.Permission;
import org.aakorea.auth.domain.Role;
import org.aakorea.auth.domain.User;
import org.aakorea.auth.domain.UserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public final class OfficePrincipal implements UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;

    private final Long userId;
    private final String username;
    private final String passwordHash;
    private final String displayName;
    private final Role role;
    private final UserStatus status;
    private final Set<Permission> permissions;
    private final boolean active;
    private final List<GrantedAuthority> authorities;

    private OfficePrincipal(
            Long userId,
            String username,
            String passwordHash,
            String displayName,
            Role role,
            UserStatus status,
            Set<Permission> permissions,
            boolean active
    ) {
        this.userId = userId;
        this.username = username;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.role = role;
        this.status = status;
        this.permissions = toPermissionSet(permissions);
        this.active = active;
        this.authorities = Collections.unmodifiableList(buildAuthorities(role, this.permissions));
    }

    public static OfficePrincipal from(User user, Set<Permission> permissions) {
        return new OfficePrincipal(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getDisplayName(),
                user.getRole(),
                user.resolvedStatus(),
                permissions,
                user.isActive());
    }

    public Long userId() {
        return userId;
    }

    public String displayName() {
        return displayName;
    }

    public Role role() {
        return role;
    }

    public UserStatus status() {
        return status;
    }

    public Set<Permission> permissions() {
        if (permissions.isEmpty()) {
            return EnumSet.noneOf(Permission.class);
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

    private static Set<Permission> toPermissionSet(Set<Permission> permissions) {
        if (permissions.isEmpty()) {
            return EnumSet.noneOf(Permission.class);
        }

        return EnumSet.copyOf(permissions);
    }

    private static List<GrantedAuthority> buildAuthorities(Role role, Set<Permission> permissions) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.authority()));
        for (Permission permission : permissions) {
            authorities.add(new SimpleGrantedAuthority(permission.authority()));
        }
        return authorities;
    }
}
