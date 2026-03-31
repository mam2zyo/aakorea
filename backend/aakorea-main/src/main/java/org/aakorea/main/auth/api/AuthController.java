package org.aakorea.main.auth.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.auth.application.AuthService;
import org.aakorea.main.common.response.ApiResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthService.AuthStatus> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse
    ) {
        return ApiResponse.success(authService.login(
                request.username(),
                request.password(),
                httpServletRequest,
                httpServletResponse));
    }

    @PostMapping("/logout")
    public ApiResponse<AuthService.LogoutStatus> logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        return ApiResponse.success(authService.logout(request, response, authentication));
    }

    @GetMapping("/me")
    public ApiResponse<AuthService.AuthStatus> me(Authentication authentication) {
        return ApiResponse.success(authService.me(authentication));
    }

    public record LoginRequest(
            @NotBlank(message = "username is required") String username,
            @NotBlank(message = "password is required") String password
    ) {
    }
}
