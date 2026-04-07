package org.aakorea.main.auth.api;

import static org.mockito.BDDMockito.given;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.aakorea.main.support.AdminSecurityTestSupport.officeUser;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;
import org.aakorea.main.auth.application.OfficePermissionService;
import org.aakorea.main.auth.application.AuthService;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.domain.AdminUser;
import org.aakorea.main.auth.domain.AdminUserStatus;
import org.aakorea.main.auth.infrastructure.AdminUserManagementEventRepository;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.aakorea.main.generalservice.api.admin.DistrictAdminController;
import org.aakorea.main.generalservice.application.DistrictAdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = {AuthController.class, DistrictAdminController.class})
@ActiveProfiles("test")
@Import({
        AuthService.class,
        OfficePermissionService.class,
        GlobalExceptionHandler.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        SecurityConfig.class
})
class AuthAndDistrictApiTest {

    private static final String ADMIN_EMAIL = "admin-test@aakorea.org";
    private static final String PENDING_EMAIL = "staff-ops@aakorea.org";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DistrictAdminService districtAdminService;

    @MockitoBean
    private AdminUserRepository adminUserRepository;

    @MockitoBean
    private AdminUserManagementEventRepository adminUserManagementEventRepository;

    @MockitoBean
    private AdminUserPermissionGrantRepository adminUserPermissionGrantRepository;

    @BeforeEach
    void setUpAdminAuthentication() {
        AdminUser adminUser = AdminUser.createBootstrap(
                ADMIN_EMAIL,
                "{noop}password-test",
                "Test Admin");
        ReflectionTestUtils.setField(adminUser, "id", 1L);

        given(adminUserRepository.findByUsername(ADMIN_EMAIL))
                .willReturn(Optional.of(adminUser));
        given(adminUserRepository.findById(1L))
                .willReturn(Optional.of(adminUser));
        given(adminUserRepository.save(any(AdminUser.class)))
                .willAnswer(invocation -> invocation.getArgument(0));
        given(adminUserPermissionGrantRepository.findAllByAdminUser_IdAndRevokedAtIsNull(1L))
                .willReturn(List.of());
    }

    @Test
    void adminApiRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/districts"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.error.message").value("authentication required"));
    }

    @Test
    void districtApiReturnsForbiddenWhenPermissionMissing() throws Exception {
        mockMvc.perform(get("/api/admin/districts")
                        .with(officeUser(AdminRole.STAFF, AdminPermission.SELF_PREFERENCES_MANAGE)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.code").value("FORBIDDEN"))
                .andExpect(jsonPath("$.error.message").value("forbidden"));
    }

    @Test
    void loginCreatesSessionAndAllowsAccessToAdminApi() throws Exception {
        given(districtAdminService.getDistricts())
                .willReturn(java.util.List.of(new DistrictAdminService.DistrictData(1L, "서울")));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                .content("""
                                {
                                  "email": "%s",
                                  "password": "password-test"
                                }
                                """.formatted(ADMIN_EMAIL)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.authenticated").value(true))
                .andExpect(jsonPath("$.data.email").value(ADMIN_EMAIL))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(get("/api/auth/me").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.authenticated").value(true))
                .andExpect(jsonPath("$.data.email").value(ADMIN_EMAIL))
                .andExpect(jsonPath("$.data.role").value("SYSTEM_ADMIN"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));

        mockMvc.perform(get("/api/admin/districts").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].name").value("서울"));
    }

    @Test
    void invalidLoginReturnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "wrong-password"
                                }
                                """.formatted(ADMIN_EMAIL)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.error.message").value("invalid credentials"));
    }

    @Test
    void pendingUserCanLoginButCannotAccessDistrictApi() throws Exception {
        AdminUser pendingUser = AdminUser.registerStaff(
                PENDING_EMAIL,
                "{noop}password-test",
                "Pending Staff");
        ReflectionTestUtils.setField(pendingUser, "id", 20L);

        given(adminUserRepository.findByUsername(PENDING_EMAIL))
                .willReturn(Optional.of(pendingUser));
        given(adminUserRepository.findById(20L))
                .willReturn(Optional.of(pendingUser));
        given(adminUserPermissionGrantRepository.findAllByAdminUser_IdAndRevokedAtIsNull(20L))
                .willReturn(List.of());

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "password-test"
                                }
                                """.formatted(PENDING_EMAIL)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.authenticated").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING_APPROVAL"))
                .andExpect(jsonPath("$.data.permissions").isArray())
                .andExpect(jsonPath("$.data.permissions").isEmpty())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(get("/api/admin/districts").session(session))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.code").value("FORBIDDEN"));
    }

    @Test
    void suspendedUserCannotLogin() throws Exception {
        AdminUser suspendedUser = new AdminUser(
                "suspended-staff@aakorea.org",
                "{noop}password-test",
                "Suspended Staff",
                AdminRole.STAFF,
                false,
                AdminUserStatus.SUSPENDED,
                null,
                1L);
        ReflectionTestUtils.setField(suspendedUser, "id", 30L);

        given(adminUserRepository.findByUsername("suspended-staff@aakorea.org"))
                .willReturn(Optional.of(suspendedUser));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "suspended-staff@aakorea.org",
                                  "password": "password-test"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.error.message").value("invalid credentials"));
    }

    @Test
    void logoutClearsSession() throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "password-test"
                                }
                                """.formatted(ADMIN_EMAIL)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(post("/api/auth/logout").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.success").value(true));

        mockMvc.perform(get("/api/admin/districts").session(session))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createDistrictReturnsCreatedResponse() throws Exception {
        given(districtAdminService.createDistrict("서울"))
                .willReturn(new DistrictAdminService.DistrictData(1L, "서울"));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "password-test"
                                }
                                """.formatted(ADMIN_EMAIL)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(post("/api/admin/districts")
                        .session(session)
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "서울"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("서울"));
    }

    @Test
    void createDistrictReturnsConflictWhenNameAlreadyExists() throws Exception {
        given(districtAdminService.createDistrict("서울"))
                .willThrow(FieldValidationException.conflict("name", "district name already exists"));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "password-test"
                                }
                                """.formatted(ADMIN_EMAIL)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(post("/api/admin/districts")
                        .session(session)
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "서울"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("CONFLICT"))
                .andExpect(jsonPath("$.error.message").value("district name already exists"))
                .andExpect(jsonPath("$.error.fields.name").value("district name already exists"));
    }

    @Test
    void deleteDistrictReturnsNoContentWhenDeletionSucceeds() throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "password-test"
                                }
                                """.formatted(ADMIN_EMAIL)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(delete("/api/admin/districts/10").session(session))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteDistrictReturnsConflictWhenLinkedGroupsExist() throws Exception {
        org.mockito.Mockito.doThrow(new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.CONFLICT,
                "연결된 Group이 있는 지역연합은 삭제할 수 없습니다."))
                .when(districtAdminService)
                .deleteDistrict(10L);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "password-test"
                                }
                                """.formatted(ADMIN_EMAIL)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(delete("/api/admin/districts/10").session(session))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("CONFLICT"))
                .andExpect(jsonPath("$.error.message").value("연결된 Group이 있는 지역연합은 삭제할 수 없습니다."));
    }

    @Test
    void registerCreatesPendingStaffAccount() throws Exception {
        given(adminUserRepository.existsByUsername(PENDING_EMAIL)).willReturn(false);
        given(adminUserRepository.save(any(AdminUser.class))).willAnswer(invocation -> {
            AdminUser savedAdminUser = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedAdminUser, "id", 2L);
            return savedAdminUser;
        });

        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "displayName": "Desk Staff",
                                  "password": "secret-123"
                                }
                                """.formatted(PENDING_EMAIL)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value(PENDING_EMAIL))
                .andExpect(jsonPath("$.data.role").value("STAFF"))
                .andExpect(jsonPath("$.data.status").value("PENDING_APPROVAL"));
    }

    @Test
    void pendingUserCanLoginButReceivesPendingStatus() throws Exception {
        AdminUser pendingUser = AdminUser.registerStaff(
                PENDING_EMAIL,
                "{noop}secret-123",
                "Desk Staff");
        ReflectionTestUtils.setField(pendingUser, "id", 2L);
        ReflectionTestUtils.setField(pendingUser, "status", AdminUserStatus.PENDING_APPROVAL);

        given(adminUserRepository.findByUsername(PENDING_EMAIL))
                .willReturn(Optional.of(pendingUser));
        given(adminUserRepository.findById(2L))
                .willReturn(Optional.of(pendingUser));
        given(adminUserPermissionGrantRepository.findAllByAdminUser_IdAndRevokedAtIsNull(2L))
                .willReturn(List.of());

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "secret-123"
                                }
                                """.formatted(PENDING_EMAIL)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value(PENDING_EMAIL))
                .andExpect(jsonPath("$.data.status").value("PENDING_APPROVAL"))
                .andExpect(jsonPath("$.data.permissions").isEmpty())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(get("/api/admin/districts").session(session))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.code").value("FORBIDDEN"));
    }
}
