package org.aakorea.main.auth.api;

import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.aakorea.main.auth.application.AuthService;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.aakorea.main.generalservice.api.admin.DistrictAdminController;
import org.aakorea.main.generalservice.application.DistrictAdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = {AuthController.class, DistrictAdminController.class})
@ActiveProfiles("test")
@Import({
        AuthService.class,
        GlobalExceptionHandler.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        SecurityConfig.class
})
class AuthAndDistrictApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DistrictAdminService districtAdminService;

    @Test
    void adminApiRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/districts"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.error.message").value("authentication required"));
    }

    @Test
    void loginCreatesSessionAndAllowsAccessToAdminApi() throws Exception {
        given(districtAdminService.getDistricts())
                .willReturn(java.util.List.of(new DistrictAdminService.DistrictData(1L, "서울")));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                .content("""
                                {
                                  "username": "admin-test",
                                  "password": "password-test"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.authenticated").value(true))
                .andExpect(jsonPath("$.data.username").value("admin-test"))
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(get("/api/auth/me").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.authenticated").value(true))
                .andExpect(jsonPath("$.data.username").value("admin-test"));

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
                                  "username": "admin-test",
                                  "password": "wrong-password"
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
                                  "username": "admin-test",
                                  "password": "password-test"
                                }
                                """))
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
                                  "username": "admin-test",
                                  "password": "password-test"
                                }
                                """))
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
                                  "username": "admin-test",
                                  "password": "password-test"
                                }
                                """))
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
                                  "username": "admin-test",
                                  "password": "password-test"
                                }
                                """))
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
                                  "username": "admin-test",
                                  "password": "password-test"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

        mockMvc.perform(delete("/api/admin/districts/10").session(session))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("CONFLICT"))
                .andExpect(jsonPath("$.error.message").value("연결된 Group이 있는 지역연합은 삭제할 수 없습니다."));
    }
}
