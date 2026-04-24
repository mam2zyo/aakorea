package org.aakorea.auth.application;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.auth.domain.UserManagementEvent;
import org.aakorea.auth.domain.User;
import org.aakorea.auth.infrastructure.UserManagementEventRepository;
import org.aakorea.auth.infrastructure.UserRepository;
import org.aakorea.auth.support.OfficePrincipal;
import org.aakorea.core.common.error.FieldValidationException;
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
    private final UserRepository userRepository;
    private final UserManagementEventRepository userManagementEventRepository;
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

        if (userRepository.existsByUsername(normalizedEmail)) {
            throw FieldValidationException.conflict("email", "email already exists");
        }

        User user = userRepository.save(User.registerStaff(
                normalizedEmail,
                passwordEncoder.encode(password),
                displayName.trim()));
        userManagementEventRepository.save(UserManagementEvent.registered(user));

        return new RegistrationStatus(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole().name(),
                user.resolvedStatus().name());
    }

    public LogoutStatus logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        // 1. 세션 무효화 및 SecurityContext 전역 클리어
        new SecurityContextLogoutHandler().logout(request, response, authentication);

        // 2. JSESSIONID 쿠키 명시적 삭제 (브라우저 전달)
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

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
        if (!(principal instanceof OfficePrincipal officePrincipal)) {
            return;
        }

        userRepository.findById(officePrincipal.userId())
                .ifPresent(user -> user.recordLogin(now()));
    }

    private AuthStatus toAuthStatus(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof OfficePrincipal officePrincipal) {
            return new AuthStatus(
                    true,
                    officePrincipal.userId(),
                    officePrincipal.getUsername(),
                    officePrincipal.getUsername(),
                    officePrincipal.displayName(),
                    officePrincipal.role().name(),
                    officePrincipal.status().name(),
                    officePermissionService.toPermissionKeys(officePrincipal.permissions()));
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
