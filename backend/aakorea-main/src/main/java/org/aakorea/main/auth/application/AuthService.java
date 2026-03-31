package org.aakorea.main.auth.application;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final org.springframework.security.authentication.AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthStatus login(
            String username,
            String password,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(username, password));

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            return new AuthStatus(true, authentication.getName());
        } catch (AuthenticationException exception) {
            SecurityContextHolder.clearContext();
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials");
        }
    }

    public LogoutStatus logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        return new LogoutStatus(true);
    }

    public AuthStatus me(Authentication authentication) {
        if (!isAuthenticated(authentication)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "authentication required");
        }

        return new AuthStatus(true, authentication.getName());
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }

    public record AuthStatus(boolean authenticated, String username) {
    }

    public record LogoutStatus(boolean success) {
    }
}
