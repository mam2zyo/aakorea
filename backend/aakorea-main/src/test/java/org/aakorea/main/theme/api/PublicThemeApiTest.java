package org.aakorea.main.theme.api;

import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.aakorea.main.theme.api.admin.PublicThemeAdminController;
import org.aakorea.main.theme.api.publicapi.PublicThemeController;
import org.aakorea.main.theme.application.PublicThemeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = {PublicThemeAdminController.class, PublicThemeController.class})
@Import({
        GlobalExceptionHandler.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        SecurityConfig.class
})
class PublicThemeApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PublicThemeService publicThemeService;

    @Test
    void adminThemeApiRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/public-theme"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }

    @Test
    void publicThemeApiReturnsTheActiveTheme() throws Exception {
        given(publicThemeService.getPublicTheme())
                .willReturn(new PublicThemeService.PublicThemeData("harbor"));

        mockMvc.perform(get("/api/public/theme"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.activeThemeId").value("harbor"));
    }

    @Test
    void adminDraftThemeApiPersistsTheRequestedTheme() throws Exception {
        given(publicThemeService.saveDraftTheme("harbor"))
                .willReturn(new PublicThemeService.PublicThemeAdminData(
                        "classic",
                        "harbor",
                        null,
                        true,
                        null,
                        LocalDateTime.of(2026, 4, 7, 10, 0)));

        mockMvc.perform(put("/api/admin/public-theme/draft")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "themeId": "harbor"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.activeThemeId").value("classic"))
                .andExpect(jsonPath("$.data.draftThemeId").value("harbor"))
                .andExpect(jsonPath("$.data.hasUnpublishedDraft").value(true));
    }

    @Test
    void adminRollbackThemeApiReturnsUpdatedState() throws Exception {
        given(publicThemeService.rollbackTheme())
                .willReturn(new PublicThemeService.PublicThemeAdminData(
                        "classic",
                        "classic",
                        "harbor",
                        false,
                        LocalDateTime.of(2026, 4, 7, 11, 0),
                        LocalDateTime.of(2026, 4, 7, 11, 0)));

        mockMvc.perform(post("/api/admin/public-theme/rollback")
                        .with(user("admin").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.activeThemeId").value("classic"))
                .andExpect(jsonPath("$.data.previousThemeId").value("harbor"));
    }
}
