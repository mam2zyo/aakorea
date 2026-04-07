package org.aakorea.main.support;

import java.util.ArrayList;
import java.util.List;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

public final class AdminSecurityTestSupport {

    private AdminSecurityTestSupport() {
    }

    public static RequestPostProcessor officeUser(AdminRole role, AdminPermission... permissions) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.authority()));
        for (AdminPermission permission : permissions) {
            authorities.add(new SimpleGrantedAuthority(permission.authority()));
        }

        return SecurityMockMvcRequestPostProcessors.user(role.name().toLowerCase())
                .authorities(authorities);
    }
}
