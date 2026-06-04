package org.aakorea.auth.support;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.aakorea.auth.application.OfficePermissionService;
import org.aakorea.auth.domain.User;
import org.aakorea.auth.infrastructure.UserPermissionGrantRepository;
import org.aakorea.auth.infrastructure.UserRepository;
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
public class OfficeSessionRefreshFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final UserPermissionGrantRepository userPermissionGrantRepository;
    private final OfficePermissionService officePermissionService;
    private final SecurityContextRepository securityContextRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof OfficePrincipal principal)) {
            filterChain.doFilter(request, response);
            return;
        }

        User user = userRepository.findById(principal.userId()).orElse(null);
        if (user == null || !user.isActive()) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
            filterChain.doFilter(request, response);
            return;
        }

        OfficePrincipal refreshedPrincipal = OfficePrincipal.from(
                user,
                officePermissionService.resolvePermissions(
                        user,
                        userPermissionGrantRepository.findAllByUser_IdAndRevokedAtIsNull(user.getId())));

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

    private boolean samePrincipal(OfficePrincipal left, OfficePrincipal right) {
        return left.userId().equals(right.userId())
                && left.getUsername().equals(right.getUsername())
                && left.displayName().equals(right.displayName())
                && left.role() == right.role()
                && left.status() == right.status()
                && left.permissions().equals(right.permissions())
                && left.isEnabled() == right.isEnabled();
    }
}
