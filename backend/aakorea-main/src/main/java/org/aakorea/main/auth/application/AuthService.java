package org.aakorea.main.auth.application;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.auth.domain.AdminUserManagementEvent;
import org.aakorea.main.auth.domain.AdminUser;
import org.aakorea.main.auth.infrastructure.AdminUserManagementEventRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.auth.support.OfficeAdminPrincipal;
import org.aakorea.main.common.error.FieldValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final org.springframework.security.authentication.AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final AdminUserRepository adminUserRepository;
    private final AdminUserManagementEventRepository adminUserManagementEventRepository;
    private final OfficePermissionService officePermissionService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthStatus login(
            String email,
            String password,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        try {
            String normalizedEmail = normalizeEmail(email);
            Authentication authentication = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(normalizedEmail, password));

            // 인증 성공 후 SecurityContext를 만들고,
            // SecurityConfig.requireExplicitSave(true) 설정에 맞춰 세션 저장소에 직접 저장한다.
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            updateLastLoginAt(authentication);
            return toAuthStatus(authentication);
        } catch (AuthenticationException exception) {
            SecurityContextHolder.clearContext();
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials");
        }
    }

    @Transactional
    public RegistrationStatus register(String email, String password, String displayName) {
        String normalizedEmail = normalizeEmail(email);
        validateRegistrationEmail(normalizedEmail);
        validateDisplayName(displayName);

        if (adminUserRepository.existsByUsername(normalizedEmail)) {
            throw FieldValidationException.conflict("email", "email already exists");
        }

        AdminUser adminUser = adminUserRepository.save(AdminUser.registerStaff(
                normalizedEmail,
                passwordEncoder.encode(password),
                displayName.trim()));
        adminUserManagementEventRepository.save(AdminUserManagementEvent.registered(adminUser));

        return new RegistrationStatus(
                adminUser.getId(),
                adminUser.getEmail(),
                adminUser.getDisplayName(),
                adminUser.getRole().name(),
                adminUser.resolvedStatus().name());
    }

    public LogoutStatus logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        // 세션에 저장된 SecurityContext까지 함께 비워서 완전히 로그아웃한다.
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        return new LogoutStatus(true);
    }

    public AuthStatus me(Authentication authentication) {
        if (!isAuthenticated(authentication)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "authentication required");
        }

        return toAuthStatus(authentication);
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }

    private void updateLastLoginAt(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof OfficeAdminPrincipal officeAdminPrincipal)) {
            return;
        }

        adminUserRepository.findById(officeAdminPrincipal.adminUserId())
                .ifPresent(adminUser -> adminUser.recordLogin(now()));
    }

    private AuthStatus toAuthStatus(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof OfficeAdminPrincipal officeAdminPrincipal) {
            return new AuthStatus(
                    true,
                    officeAdminPrincipal.adminUserId(),
                    officeAdminPrincipal.getUsername(),
                    officeAdminPrincipal.getUsername(),
                    officeAdminPrincipal.displayName(),
                    officeAdminPrincipal.role().name(),
                    officeAdminPrincipal.status().name(),
                    officePermissionService.toPermissionKeys(officeAdminPrincipal.permissions()));
        }

        return new AuthStatus(
                true,
                null,
                authentication.getName(),
                authentication.getName(),
                authentication.getName(),
                null,
                null,
                List.of());
    }

    private void validateRegistrationEmail(String email) {
        if (email.isBlank()) {
            throw FieldValidationException.badRequest("email", "email is required");
        }
    }

    private void validateDisplayName(String displayName) {
        if (displayName == null || displayName.trim().isEmpty()) {
            throw FieldValidationException.badRequest(
                    "displayName",
                    "displayName is required");
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private LocalDateTime now() {
        return LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }

    public record AuthStatus(
            boolean authenticated,
            Long userId,
            String email,
            String username,
            String displayName,
            String role,
            String status,
            List<String> permissions
    ) {
    }

    public record RegistrationStatus(
            Long userId,
            String email,
            String displayName,
            String role,
            String status
    ) {
    }

    public record LogoutStatus(boolean success) {
    }
}
