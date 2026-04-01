package org.aakorea.main.group.api;

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
import org.aakorea.main.group.api.admin.MeetingAdminController;
import org.aakorea.main.group.api.publicapi.PublicMeetingController;
import org.aakorea.main.group.application.MeetingAdminService;
import org.aakorea.main.group.application.PublicMeetingQueryService;
import org.aakorea.main.group.domain.MeetingType;
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
                "지하 강당",
                true))
                .willReturn(new MeetingAdminService.MeetingData(
                        100L,
                        20L,
                        "seoul",
                        DayOfWeek.MONDAY,
                        "19:30",
                        MeetingType.OPEN,
                        "지하 강당",
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
                                  "meetingPlaceNote": "지하 강당",
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
                .andExpect(jsonPath("$.data.meetingPlaceNote").value("지하 강당"))
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
                        "지하 강당",
                        new PublicMeetingQueryService.GroupLocationData("강남역 인근", "서울특별시 강남구 테헤란로 123"))));

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
                .andExpect(jsonPath("$.data[0].type").value("OPEN"))
                .andExpect(jsonPath("$.data[0].groupLocation.name").value("강남역 인근"));
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
                        "지하 강당",
                        "02-1234-5678",
                        new PublicMeetingQueryService.GroupProfileData(
                                20L,
                                "강남그룹",
                                "강남역 인근",
                                "서울특별시 강남구 테헤란로 123",
                                "반갑습니다",
                                "이번 주 공지 없음",
                                "최근 변경 없음"),
                        List.of(new PublicMeetingQueryService.MeetingScheduleData(
                                100L,
                                "seoul",
                                DayOfWeek.MONDAY,
                                "19:30",
                                MeetingType.OPEN,
                                "지하 강당"))));

        mockMvc.perform(get("/api/public/meetings/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(100))
                .andExpect(jsonPath("$.data.groupName").value("강남그룹"))
                .andExpect(jsonPath("$.data.contactPhone").value("02-1234-5678"))
                .andExpect(jsonPath("$.data.group.locationName").value("강남역 인근"))
                .andExpect(jsonPath("$.data.groupMeetings[0].id").value(100));
    }
}
