package org.aakorea.main.theme.api.publicapi;

import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.theme.application.PublicThemeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicThemeController {

    private final PublicThemeService publicThemeService;

    @GetMapping("/theme")
    public ApiResponse<PublicThemeService.PublicThemeData> getPublicTheme() {
        return ApiResponse.success(publicThemeService.getPublicTheme());
    }
}
