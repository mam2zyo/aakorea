package org.aakorea.main.auth.support;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.auth.application.OfficePermissionService;
import org.aakorea.main.auth.domain.AdminUser;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class OfficeAdminSessionRefreshFilter extends OncePerRequestFilter {

    private final AdminUserRepository adminUserRepository;
    private final AdminUserPermissionGrantRepository adminUserPermissionGrantRepository;
    private final OfficePermissionService officePermissionService;
    private final SecurityContextRepository securityContextRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof OfficeAdminPrincipal principal)) {
            filterChain.doFilter(request, response);
            return;
        }

        AdminUser adminUser = adminUserRepository.findById(principal.adminUserId()).orElse(null);
        if (adminUser == null || !adminUser.isActive()) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
            filterChain.doFilter(request, response);
            return;
        }

        OfficeAdminPrincipal refreshedPrincipal = OfficeAdminPrincipal.from(
                adminUser,
                officePermissionService.resolvePermissions(
                        adminUser,
                        adminUserPermissionGrantRepository.findAllByAdminUser_IdAndRevokedAtIsNull(adminUser.getId())));

        if (!samePrincipal(principal, refreshedPrincipal)) {
            UsernamePasswordAuthenticationToken refreshedAuthentication =
                    UsernamePasswordAuthenticationToken.authenticated(
                            refreshedPrincipal,
                            authentication.getCredentials(),
                            refreshedPrincipal.getAuthorities());
            refreshedAuthentication.setDetails(authentication.getDetails());

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(refreshedAuthentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);
        }

        filterChain.doFilter(request, response);
    }

    private boolean samePrincipal(OfficeAdminPrincipal left, OfficeAdminPrincipal right) {
        return left.adminUserId().equals(right.adminUserId())
                && left.getUsername().equals(right.getUsername())
                && left.displayName().equals(right.displayName())
                && left.role() == right.role()
                && left.status() == right.status()
                && left.permissions().equals(right.permissions())
                && left.isEnabled() == right.isEnabled();
    }
}
