package org.aakorea.main.theme.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.theme.application.PublicThemeService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/public-theme")
@RequiredArgsConstructor
public class PublicThemeAdminController {

    private final PublicThemeService publicThemeService;

    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @GetMapping
    public ApiResponse<PublicThemeService.PublicThemeAdminData> getPublicThemeState() {
        return ApiResponse.success(publicThemeService.getAdminThemeState());
    }

    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @PutMapping("/draft")
    public ApiResponse<PublicThemeService.PublicThemeAdminData> saveDraftTheme(
            @Valid @RequestBody ThemeDraftRequest request
    ) {
        return ApiResponse.success(publicThemeService.saveDraftTheme(request.themeId()));
    }

    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @PostMapping("/publish")
    public ApiResponse<PublicThemeService.PublicThemeAdminData> publishDraftTheme() {
        return ApiResponse.success(publicThemeService.publishDraftTheme());
    }

    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @PostMapping("/rollback")
    public ApiResponse<PublicThemeService.PublicThemeAdminData> rollbackTheme() {
        return ApiResponse.success(publicThemeService.rollbackTheme());
    }

    public record ThemeDraftRequest(
            @NotBlank(message = "themeId is required") String themeId
    ) {
    }
}
