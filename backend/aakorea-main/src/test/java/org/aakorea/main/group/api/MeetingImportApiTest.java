package org.aakorea.main.group.api;

import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.aakorea.main.support.AdminSecurityTestSupport.officeUser;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.aakorea.main.auth.application.OfficePermissionService;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.aakorea.main.group.api.admin.MeetingImportAdminController;
import org.aakorea.main.group.application.MeetingImportAdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = MeetingImportAdminController.class)
@Import({
        GlobalExceptionHandler.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        SecurityConfig.class
})
class MeetingImportApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MeetingImportAdminService meetingImportAdminService;

    @MockitoBean
    private AdminUserRepository adminUserRepository;

    @MockitoBean
    private AdminUserPermissionGrantRepository adminUserPermissionGrantRepository;

    @MockitoBean
    private OfficePermissionService officePermissionService;

    @Test
    void applyHtmlRequiresSystemAdminRole() throws Exception {
        mockMvc.perform(post("/api/admin/meeting-imports/apply-html")
                        .with(officeUser(AdminRole.MANAGER))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "html": "<html></html>"
                                }
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.code").value("FORBIDDEN"));
    }

    @Test
    void applyHtmlReturnsApplyResult() throws Exception {
        given(meetingImportAdminService.applyHtml("<html></html>"))
                .willReturn(new MeetingImportAdminService.ImportApplyResult(
                        1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
                        List.of("호남연합"),
                        List.of()));

        mockMvc.perform(post("/api/admin/meeting-imports/apply-html")
                        .with(officeUser(AdminRole.SYSTEM_ADMIN))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "html": "<html></html>"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sourceMeetingCount").value(1))
                .andExpect(jsonPath("$.data.createdGroupCount").value(1))
                .andExpect(jsonPath("$.data.createdDistrictNames[0]").value("호남연합"));
    }

    @Test
    void importResetReturnsDeletedCounts() throws Exception {
        given(meetingImportAdminService.resetImportData())
                .willReturn(new MeetingImportAdminService.ImportResetResult(
                        11L,
                        207L,
                        207L,
                        270L));

        mockMvc.perform(post("/api/admin/meeting-imports/reset")
                        .with(officeUser(AdminRole.SYSTEM_ADMIN))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.deletedDistrictCount").value(11))
                .andExpect(jsonPath("$.data.deletedGroupCount").value(207))
                .andExpect(jsonPath("$.data.deletedGroupContactCount").value(207))
                .andExpect(jsonPath("$.data.deletedMeetingCount").value(270));
    }
}
