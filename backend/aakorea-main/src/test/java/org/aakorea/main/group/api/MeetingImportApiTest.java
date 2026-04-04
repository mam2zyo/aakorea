package org.aakorea.main.group.api;

import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.aakorea.main.group.api.admin.MeetingImportAdminController;
import org.aakorea.main.group.application.MeetingImportAdminService;
import org.aakorea.main.group.domain.MeetingType;
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

    @Test
    void importNormalizeRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/admin/meeting-imports/normalize")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "html": "<html></html>"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }

    @Test
    void importNormalizeReturnsNormalizedGroups() throws Exception {
        given(meetingImportAdminService.normalizeHtml("<html></html>"))
                .willReturn(new MeetingImportAdminService.NormalizedMeetingImport(
                        1,
                        List.of(),
                        List.of(new MeetingImportAdminService.NormalizedImportGroup(
                                "호남연합",
                                "다락방",
                                "010-3912-1256",
                                "송정공원역 4번 출구",
                                List.of(new MeetingImportAdminService.NormalizedImportMeeting(
                                        "THURSDAY",
                                        "19:00",
                                        MeetingType.NOTFIXED.name(),
                                        "GWANGJU",
                                        "광주 광산구 상무대로 309-1",
                                        "황금마트 3층",
                                        null,
                                        false,
                                        true))))));

        mockMvc.perform(post("/api/admin/meeting-imports/normalize")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "html": "<html></html>"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sourceMeetingCount").value(1))
                .andExpect(jsonPath("$.data.groups[0].districtName").value("호남연합"))
                .andExpect(jsonPath("$.data.groups[0].name").value("다락방"))
                .andExpect(jsonPath("$.data.groups[0].phone").value("010-3912-1256"))
                .andExpect(jsonPath("$.data.groups[0].meetings[0].type").value("NOTFIXED"))
                .andExpect(jsonPath("$.data.groups[0].meetings[0].active").value(true));
    }

    @Test
    void importPreviewAcceptsNormalizedJson() throws Exception {
        given(meetingImportAdminService.previewImport(new MeetingImportAdminService.NormalizedMeetingImport(
                1,
                List.of(),
                List.of(new MeetingImportAdminService.NormalizedImportGroup(
                        "호남연합",
                        "다락방",
                        "010-3912-1256",
                        "송정공원역 4번 출구",
                        List.of(new MeetingImportAdminService.NormalizedImportMeeting(
                                "THURSDAY",
                                "19:00",
                                "NOTFIXED",
                                "GWANGJU",
                                "광주 광산구 상무대로 309-1",
                                "황금마트 3층",
                                null,
                                false,
                                true)))))))
                .willReturn(new MeetingImportAdminService.ImportPreview(
                        1,
                        1,
                        1,
                        List.of("호남연합"),
                        List.of(),
                        List.of(new MeetingImportAdminService.ImportedGroupPreview(
                                "호남연합",
                                "다락방",
                                "010-3912-1256",
                                "송정공원역 4번 출구",
                                1,
                                List.of(new MeetingImportAdminService.ImportedMeetingPreview(
                                        "THURSDAY",
                                        "19:00",
                                        MeetingType.NOTFIXED,
                                        "광주 광산구 상무대로 309-1",
                                        "황금마트 3층",
                                        null,
                                        true,
                                        false))))));

        mockMvc.perform(post("/api/admin/meeting-imports/preview")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "sourceMeetingCount": 1,
                                  "issues": [],
                                  "groups": [
                                    {
                                      "districtName": "호남연합",
                                      "name": "다락방",
                                      "phone": "010-3912-1256",
                                      "notice": "송정공원역 4번 출구",
                                      "meetings": [
                                        {
                                          "dayOfWeek": "THURSDAY",
                                          "startTime": "19:00",
                                          "type": "NOTFIXED",
                                          "province": "GWANGJU",
                                          "locationAddress": "광주 광산구 상무대로 309-1",
                                          "locationDetail": "황금마트 3층",
                                          "contactPhoneOverride": null,
                                          "heuristicLocationSplit": false,
                                          "active": true
                                        }
                                      ]
                                    }
                                  ]
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.importedGroupCount").value(1))
                .andExpect(jsonPath("$.data.groups[0].meetings[0].type").value("NOTFIXED"))
                .andExpect(jsonPath("$.data.groups[0].meetings[0].active").value(true));
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
                        .with(user("admin").roles("ADMIN"))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.deletedDistrictCount").value(11))
                .andExpect(jsonPath("$.data.deletedGroupCount").value(207))
                .andExpect(jsonPath("$.data.deletedGroupContactCount").value(207))
                .andExpect(jsonPath("$.data.deletedMeetingCount").value(270));
    }
}
