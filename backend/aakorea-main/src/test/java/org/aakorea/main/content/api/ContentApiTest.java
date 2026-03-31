package org.aakorea.main.content.api;

import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.aakorea.main.content.api.admin.ContentAdminController;
import org.aakorea.main.content.api.publicapi.PublicContentController;
import org.aakorea.main.content.application.ContentAdminService;
import org.aakorea.main.content.application.PublicContentQueryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = {ContentAdminController.class, PublicContentController.class})
@Import({
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

    @Test
    void adminContentApiRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/content-pages"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }

    @Test
    void createContentPageReturnsCreatedResponse() throws Exception {
        given(contentAdminService.createContentPage(
                "first-visitor-guide",
                "처음 오신 분 안내",
                "페이지 본문",
                true))
                .willReturn(new ContentAdminService.ContentPageData(
                        1L,
                        "first-visitor-guide",
                        "처음 오신 분 안내",
                        "페이지 본문",
                        true));

        mockMvc.perform(post("/api/admin/content-pages")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "key": "first-visitor-guide",
                                  "title": "처음 오신 분 안내",
                                  "body": "페이지 본문",
                                  "published": true
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.key").value("first-visitor-guide"))
                .andExpect(jsonPath("$.data.title").value("처음 오신 분 안내"))
                .andExpect(jsonPath("$.data.published").value(true));
    }

    @Test
    void publicContentPageReturnsPublishedPage() throws Exception {
        given(publicContentQueryService.getContentPage("first-visitor-guide"))
                .willReturn(new PublicContentQueryService.PublicContentPageData(
                        1L,
                        "first-visitor-guide",
                        "처음 오신 분 안내",
                        "페이지 본문"));

        mockMvc.perform(get("/api/public/content-pages/first-visitor-guide"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.key").value("first-visitor-guide"))
                .andExpect(jsonPath("$.data.body").value("페이지 본문"));
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
                        "공지 본문",
                        LocalDateTime.of(2026, 3, 30, 9, 0)));

        mockMvc.perform(get("/api/public/notices/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.title").value("공지 제목"))
                .andExpect(jsonPath("$.data.body").value("공지 본문"));
    }

    @Test
    void duplicateContentPageKeyReturnsFieldError() throws Exception {
        given(contentAdminService.createContentPage(
                "first-visitor-guide",
                "처음 오신 분 안내",
                "페이지 본문",
                true))
                .willThrow(FieldValidationException.conflict("key", "content page key already exists"));

        mockMvc.perform(post("/api/admin/content-pages")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "key": "first-visitor-guide",
                                  "title": "처음 오신 분 안내",
                                  "body": "페이지 본문",
                                  "published": true
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("CONFLICT"))
                .andExpect(jsonPath("$.error.fields.key").value("content page key already exists"));
    }
}
