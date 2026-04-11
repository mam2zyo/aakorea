package org.aakorea.main.content.api;

import static org.mockito.BDDMockito.given;
import static org.aakorea.main.support.AdminSecurityTestSupport.officeUser;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;
import org.aakorea.main.auth.application.OfficeAuthorizationService;
import org.aakorea.main.auth.application.OfficePermissionService;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.aakorea.main.content.api.admin.ContentAdminController;
import org.aakorea.main.content.api.publicapi.PublicContentController;
import org.aakorea.main.content.application.ContentAdminService;
import org.aakorea.main.content.application.PublicContentQueryService;
import org.aakorea.main.content.infrastructure.ContentPageRepository;
import org.aakorea.main.content.infrastructure.NoticeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = {ContentAdminController.class, PublicContentController.class})
@Import({
        OfficeAuthorizationService.class,
        GlobalExceptionHandler.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        SecurityConfig.class
})
class ContentApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ContentAdminService contentAdminService;

    @MockitoBean
    private PublicContentQueryService publicContentQueryService;

    @MockitoBean
    private ContentPageRepository contentPageRepository;

    @MockitoBean
    private NoticeRepository noticeRepository;

    @MockitoBean
    private AdminUserRepository adminUserRepository;

    @MockitoBean
    private AdminUserPermissionGrantRepository adminUserPermissionGrantRepository;

    @MockitoBean
    private OfficePermissionService officePermissionService;

    @Test
    void adminContentApiRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/content-pages"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }

    @Test
    void createContentPageReturnsCreatedResponse() throws Exception {
        given(contentAdminService.createContentPage(
                org.mockito.ArgumentMatchers.eq("first-visitor-guide"),
                org.mockito.ArgumentMatchers.eq("처음 오신 분 안내"),
                org.mockito.ArgumentMatchers.eq(true),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyList()))
                .willReturn(new ContentAdminService.ContentPageData(
                        1L,
                        "first-visitor-guide",
                        "처음 오신 분 안내",
                        true,
                        "test.html",
                        List.of()));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart("/api/admin/content-pages/upload")
                        .file("file", "test-content".getBytes())
                        .param("key", "first-visitor-guide")
                        .param("title", "처음 오신 분 안내")
                        .param("published", "true")
                        .with(officeUser(AdminRole.MANAGER, AdminPermission.CONTENT_PUBLISH)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.key").value("first-visitor-guide"))
                .andExpect(jsonPath("$.data.title").value("처음 오신 분 안내"))
                .andExpect(jsonPath("$.data.published").value(true));
    }

    @Test
    void createPublishedContentPageRequiresPublishPermission() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart("/api/admin/content-pages/upload")
                        .file("file", "test-content".getBytes())
                        .param("key", "first-visitor-guide")
                        .param("title", "처음 오신 분 안내")
                        .param("published", "true")
                        .with(officeUser(AdminRole.STAFF, AdminPermission.CONTENT_PAGE_MANAGE)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.code").value("FORBIDDEN"))
                .andExpect(jsonPath("$.error.message").value("forbidden"));
    }

    @Test
    void publicContentPageReturnsPublishedPage() throws Exception {
        given(publicContentQueryService.getContentPage("first-visitor-guide"))
                .willReturn(new PublicContentQueryService.PublicContentPageData(
                        1L,
                        "first-visitor-guide",
                        "처음 오신 분 안내",
                        "페이지 본문 HTML",
                        List.of()));

        mockMvc.perform(get("/api/public/content-pages/first-visitor-guide"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.key").value("first-visitor-guide"))
                .andExpect(jsonPath("$.data.bodyHtml").value("페이지 본문 HTML"));
    }

    @Test
    void publicNoticeListReturnsPublishedSummaries() throws Exception {
        given(publicContentQueryService.getNotices())
                .willReturn(List.of(new PublicContentQueryService.PublicNoticeSummary(
                        10L,
                        "공지 제목",
                        LocalDateTime.of(2026, 3, 30, 9, 0))));

        mockMvc.perform(get("/api/public/notices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(10))
                .andExpect(jsonPath("$.data[0].title").value("공지 제목"))
                .andExpect(jsonPath("$.data[0].publishedAt").value("2026-03-30T09:00:00"));
    }

    @Test
    void publicNoticeDetailReturnsBody() throws Exception {
        given(publicContentQueryService.getNotice(10L))
                .willReturn(new PublicContentQueryService.PublicNoticeData(
                        10L,
                        "공지 제목",
                        "공지 본문 HTML",
                        LocalDateTime.of(2026, 3, 30, 9, 0),
                        List.of()));

        mockMvc.perform(get("/api/public/notices/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.title").value("공지 제목"))
                .andExpect(jsonPath("$.data.bodyHtml").value("공지 본문 HTML"));
    }

    @Test
    void duplicateContentPageKeyReturnsFieldError() throws Exception {
        given(contentAdminService.createContentPage(
                org.mockito.ArgumentMatchers.eq("first-visitor-guide"),
                org.mockito.ArgumentMatchers.eq("처음 오신 분 안내"),
                org.mockito.ArgumentMatchers.eq(true),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyList()))
                .willThrow(FieldValidationException.conflict("key", "content page key already exists"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart("/api/admin/content-pages/upload")
                        .file("file", "test-content".getBytes())
                        .param("key", "first-visitor-guide")
                        .param("title", "처음 오신 분 안내")
                        .param("published", "true")
                        .with(officeUser(
                                AdminRole.MANAGER,
                                AdminPermission.CONTENT_PAGE_MANAGE,
                                AdminPermission.CONTENT_PUBLISH)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("CONFLICT"))
                .andExpect(jsonPath("$.error.fields.key").value("content page key already exists"));
    }
}
