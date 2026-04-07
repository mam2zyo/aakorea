package org.aakorea.main.auth.api;

import static org.aakorea.main.support.AdminSecurityTestSupport.officeUser;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.aakorea.main.auth.api.admin.AdminUserAdminController;
import org.aakorea.main.auth.application.AdminUserAdminService;
import org.aakorea.main.auth.application.OfficePermissionService;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.auth.support.OfficeAdminSessionRefreshFilter;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = AdminUserAdminController.class)
@Import({
        GlobalExceptionHandler.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        OfficeAdminSessionRefreshFilter.class,
        SecurityConfig.class
})
class AdminUserAdminApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminUserAdminService adminUserAdminService;

    @MockitoBean
    private AdminUserRepository adminUserRepository;

    @MockitoBean
    private AdminUserPermissionGrantRepository adminUserPermissionGrantRepository;

    @MockitoBean
    private OfficePermissionService officePermissionService;

    @Test
    void adminUserApiRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/admin-users"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }

    @Test
    void staffCannotAccessAdminUserApi() throws Exception {
        mockMvc.perform(get("/api/admin/admin-users")
                        .with(officeUser(AdminRole.STAFF, AdminPermission.SELF_PREFERENCES_MANAGE)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.code").value("FORBIDDEN"))
                .andExpect(jsonPath("$.error.message").value("forbidden"));
    }

    @Test
    void managerCanReadAdminUserWorkspace() throws Exception {
        given(adminUserAdminService.getWorkspace())
                .willReturn(new AdminUserAdminService.AdminUserWorkspaceData(
                        List.of(new AdminUserAdminService.AdminUserData(
                                10L,
                                "staff-ops@aakorea.org",
                                "Desk Staff",
                                "STAFF",
                                "Staff",
                                "PENDING_APPROVAL",
                                "승인 대기",
                                true,
                                List.of("group.manage"),
                                List.of(),
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                List.of())),
                        List.of(new AdminUserAdminService.RoleOptionData("STAFF", "Staff")),
                        List.of(new AdminUserAdminService.PermissionOptionData(
                                "group.manage",
                                "그룹 및 모임 관리",
                                "그룹, 그룹 연락처, 모임 편집을 허용합니다."))));

        mockMvc.perform(get("/api/admin/admin-users")
                        .with(officeUser(AdminRole.MANAGER, AdminPermission.STAFF_MANAGE)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.users[0].email").value("staff-ops@aakorea.org"))
                .andExpect(jsonPath("$.data.users[0].status").value("PENDING_APPROVAL"))
                .andExpect(jsonPath("$.data.users[0].approvedByLabel").isEmpty())
                .andExpect(jsonPath("$.data.creatableRoles[0].value").value("STAFF"))
                .andExpect(jsonPath("$.data.staffGrantOptions[0].key").value("group.manage"));
    }
}
