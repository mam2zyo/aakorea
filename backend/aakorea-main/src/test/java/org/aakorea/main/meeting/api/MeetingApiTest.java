package org.aakorea.main.meeting.api;

import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.DayOfWeek;
import java.util.List;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.aakorea.main.meeting.api.admin.MeetingAdminController;
import org.aakorea.main.meeting.api.publicapi.PublicMeetingController;
import org.aakorea.main.meeting.application.MeetingAdminService;
import org.aakorea.main.meeting.application.PublicMeetingQueryService;
import org.aakorea.main.meeting.domain.MeetingType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = {MeetingAdminController.class, PublicMeetingController.class})
@Import({
        GlobalExceptionHandler.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        SecurityConfig.class
})
class MeetingApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MeetingAdminService meetingAdminService;

    @MockitoBean
    private PublicMeetingQueryService publicMeetingQueryService;

    @Test
    void adminMeetingApiRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/meetings"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }

    @Test
    void createMeetingReturnsCreatedResponse() throws Exception {
        given(meetingAdminService.createMeeting(
                20L,
                "seoul",
                "MONDAY",
                "19:30",
                "OPEN",
                new MeetingAdminService.LocationInput("강남역 인근", "서울특별시 강남구 테헤란로 123"),
                true))
                .willReturn(new MeetingAdminService.MeetingData(
                        100L,
                        20L,
                        "seoul",
                        DayOfWeek.MONDAY,
                        "19:30",
                        MeetingType.OPEN,
                        new MeetingAdminService.LocationData("강남역 인근", "서울특별시 강남구 테헤란로 123"),
                        true));

        mockMvc.perform(post("/api/admin/meetings")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "groupId": 20,
                                  "province": "seoul",
                                  "dayOfWeek": "MONDAY",
                                  "startTime": "19:30",
                                  "type": "OPEN",
                                  "location": {
                                    "name": "강남역 인근",
                                    "address": "서울특별시 강남구 테헤란로 123"
                                  },
                                  "active": true
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(100))
                .andExpect(jsonPath("$.data.groupId").value(20))
                .andExpect(jsonPath("$.data.province").value("seoul"))
                .andExpect(jsonPath("$.data.dayOfWeek").value("MONDAY"))
                .andExpect(jsonPath("$.data.startTime").value("19:30"))
                .andExpect(jsonPath("$.data.type").value("OPEN"))
                .andExpect(jsonPath("$.data.location.name").value("강남역 인근"))
                .andExpect(jsonPath("$.data.location.address").value("서울특별시 강남구 테헤란로 123"))
                .andExpect(jsonPath("$.data.active").value(true));
    }

    @Test
    void publicMeetingListReturnsMeetingSummaries() throws Exception {
        given(publicMeetingQueryService.getMeetings("seoul", "MONDAY"))
                .willReturn(List.of(new PublicMeetingQueryService.PublicMeetingSummary(
                        100L,
                        20L,
                        "강남그룹",
                        "seoul",
                        DayOfWeek.MONDAY,
                        "19:30",
                        MeetingType.OPEN,
                        new PublicMeetingQueryService.LocationData("강남역 인근", "서울특별시 강남구 테헤란로 123"))));

        mockMvc.perform(get("/api/public/meetings")
                        .param("province", "seoul")
                        .param("dayOfWeek", "MONDAY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(100))
                .andExpect(jsonPath("$.data[0].groupId").value(20))
                .andExpect(jsonPath("$.data[0].groupName").value("강남그룹"))
                .andExpect(jsonPath("$.data[0].province").value("seoul"))
                .andExpect(jsonPath("$.data[0].dayOfWeek").value("MONDAY"))
                .andExpect(jsonPath("$.data[0].startTime").value("19:30"))
                .andExpect(jsonPath("$.data[0].type").value("OPEN"));
    }

    @Test
    void publicMeetingDetailReturnsRepresentativeContactPhone() throws Exception {
        given(publicMeetingQueryService.getMeeting(100L))
                .willReturn(new PublicMeetingQueryService.PublicMeetingDetail(
                        100L,
                        20L,
                        "강남그룹",
                        "seoul",
                        DayOfWeek.MONDAY,
                        "19:30",
                        MeetingType.OPEN,
                        new PublicMeetingQueryService.LocationData("강남역 인근", "서울특별시 강남구 테헤란로 123"),
                        "02-1234-5678"));

        mockMvc.perform(get("/api/public/meetings/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(100))
                .andExpect(jsonPath("$.data.groupName").value("강남그룹"))
                .andExpect(jsonPath("$.data.contactPhone").value("02-1234-5678"));
    }
}
