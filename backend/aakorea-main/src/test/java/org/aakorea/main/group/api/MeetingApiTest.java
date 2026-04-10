package org.aakorea.main.group.api;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.aakorea.main.support.AdminSecurityTestSupport.officeUser;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.DayOfWeek;
import java.util.List;
import org.aakorea.main.auth.application.OfficePermissionService;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.common.error.GlobalExceptionHandler;
import org.aakorea.main.common.security.RestAccessDeniedHandler;
import org.aakorea.main.common.security.RestAuthenticationEntryPoint;
import org.aakorea.main.common.security.SecurityConfig;
import org.aakorea.main.group.api.admin.MeetingAdminController;
import org.aakorea.main.group.api.publicapi.PublicGroupController;
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

@WebMvcTest(controllers = {MeetingAdminController.class, PublicMeetingController.class, PublicGroupController.class})
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

    @MockitoBean
    private AdminUserRepository adminUserRepository;

    @MockitoBean
    private AdminUserPermissionGrantRepository adminUserPermissionGrantRepository;

    @MockitoBean
    private OfficePermissionService officePermissionService;

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
                "강남역 인근",
                "서울특별시 강남구 테헤란로 123",
                37.4979,
                127.0276,
                "010-9999-0000",
                "MONDAY",
                "19:30",
                "OPEN",
                true))
                .willReturn(new MeetingAdminService.MeetingData(
                        100L,
                        20L,
                        "seoul",
                        "강남역 인근",
                        "서울특별시 강남구 테헤란로 123",
                        37.4979,
                        127.0276,
                        "010-9999-0000",
                        DayOfWeek.MONDAY,
                        "19:30",
                        MeetingType.OPEN,
                        true));

        mockMvc.perform(post("/api/admin/meetings")
                        .with(officeUser(AdminRole.MANAGER, AdminPermission.GROUP_MANAGE))
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "groupId": 20,
                                  "locationDetail": "강남역 인근",
                                  "locationAddress": "서울특별시 강남구 테헤란로 123",
                                  "latitude": 37.4979,
                                  "longitude": 127.0276,
                                  "contactPhoneOverride": "010-9999-0000",
                                  "dayOfWeek": "MONDAY",
                                  "startTime": "19:30",
                                  "type": "OPEN",
                                  "active": true
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(100))
                .andExpect(jsonPath("$.data.groupId").value(20))
                .andExpect(jsonPath("$.data.province").value("seoul"))
                .andExpect(jsonPath("$.data.locationDetail").value("강남역 인근"))
                .andExpect(jsonPath("$.data.locationAddress").value("서울특별시 강남구 테헤란로 123"))
                .andExpect(jsonPath("$.data.latitude").value(37.4979))
                .andExpect(jsonPath("$.data.longitude").value(127.0276))
                .andExpect(jsonPath("$.data.contactPhoneOverride").value("010-9999-0000"))
                .andExpect(jsonPath("$.data.dayOfWeek").value("MONDAY"))
                .andExpect(jsonPath("$.data.startTime").value("19:30"))
                .andExpect(jsonPath("$.data.type").value("OPEN"))
                .andExpect(jsonPath("$.data.active").value(true));
    }

    @Test
    void backfillCoordinatesReturnsSummary() throws Exception {
        given(meetingAdminService.backfillMissingCoordinates(true))
                .willReturn(new MeetingAdminService.CoordinateBackfillResult(
                        true,
                        2,
                        1,
                        0,
                        1,
                        List.of(
                                new MeetingAdminService.CoordinateBackfillItem(
                                        100L,
                                        20L,
                                        "강남그룹",
                                        "서울특별시 강남구 테헤란로 123",
                                        37.4979,
                                        127.0276,
                                        MeetingAdminService.CoordinateBackfillStatus.READY,
                                        "coordinates resolved"),
                                new MeetingAdminService.CoordinateBackfillItem(
                                        101L,
                                        21L,
                                        "서초그룹",
                                        "서울특별시 서초구 강남대로 456",
                                        null,
                                        null,
                                        MeetingAdminService.CoordinateBackfillStatus.FAILED,
                                        "locationAddress cannot determine coordinates"))));

        mockMvc.perform(post("/api/admin/meetings/backfill-coordinates")
                        .with(officeUser(AdminRole.SYSTEM_ADMIN))
                        .param("dryRun", "true")
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.dryRun").value(true))
                .andExpect(jsonPath("$.data.totalCandidateCount").value(2))
                .andExpect(jsonPath("$.data.resolvedCount").value(1))
                .andExpect(jsonPath("$.data.updatedCount").value(0))
                .andExpect(jsonPath("$.data.failedCount").value(1))
                .andExpect(jsonPath("$.data.items[0].meetingId").value(100))
                .andExpect(jsonPath("$.data.items[0].status").value("READY"))
                .andExpect(jsonPath("$.data.items[1].status").value("FAILED"));
    }

    @Test
    void backfillCoordinatesRequiresSystemAdminRole() throws Exception {
        mockMvc.perform(post("/api/admin/meetings/backfill-coordinates")
                        .with(officeUser(AdminRole.MANAGER, AdminPermission.GROUP_MANAGE))
                        .param("dryRun", "true")
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.code").value("FORBIDDEN"))
                .andExpect(jsonPath("$.error.message").value("forbidden"));
    }

    @Test
    void deleteMeetingReturnsNoContent() throws Exception {
        willDoNothing().given(meetingAdminService).deleteMeeting(100L);

        mockMvc.perform(delete("/api/admin/meetings/100")
                        .with(officeUser(AdminRole.MANAGER, AdminPermission.GROUP_MANAGE)))
                .andExpect(status().isNoContent());
    }

    @Test
    void publicMeetingListReturnsMeetingSummaries() throws Exception {
        given(publicMeetingQueryService.getMeetings(List.of("seoul"), "MONDAY", null, null, null, null, null, null))
                .willReturn(List.of(new PublicMeetingQueryService.PublicMeetingSummary(
                        100L,
                        20L,
                        "강남그룹",
                        "seoul",
                        DayOfWeek.MONDAY,
                        "19:30",
                        MeetingType.OPEN,
                        "강남역 인근",
                        "서울특별시 강남구 테헤란로 123",
                        37.4979,
                        127.0276,
                        15L,
                        null)));

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
                .andExpect(jsonPath("$.data[0].locationDetail").value("강남역 인근"))
                .andExpect(jsonPath("$.data[0].latitude").value(37.4979))
                .andExpect(jsonPath("$.data[0].longitude").value(127.0276));
    }

    @Test
    void publicNearbyMeetingListReturnsDistance() throws Exception {
        given(publicMeetingQueryService.getMeetings(null, "MONDAY", null, null, null, 37.4979, 127.0276, 10))
                .willReturn(List.of(new PublicMeetingQueryService.PublicMeetingSummary(
                        100L,
                        20L,
                        "강남그룹",
                        "seoul",
                        DayOfWeek.MONDAY,
                        "19:30",
                        MeetingType.OPEN,
                        "강남역 인근",
                        "서울특별시 강남구 테헤란로 123",
                        37.4979,
                        127.0276,
                        15L,
                        0.2)));

        mockMvc.perform(get("/api/public/meetings")
                        .param("dayOfWeek", "MONDAY")
                        .param("latitude", "37.4979")
                        .param("longitude", "127.0276")
                        .param("radiusKm", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].groupName").value("강남그룹"))
                .andExpect(jsonPath("$.data[0].distanceKm").value(0.2));
    }

    @Test
    void publicMeetingDetailReturnsMeetingSpecificContactPhoneWhenOverrideExists() throws Exception {
        given(publicMeetingQueryService.getMeeting(100L))
                .willReturn(new PublicMeetingQueryService.PublicMeetingDetail(
                        100L,
                        20L,
                        "강남그룹",
                        new PublicMeetingQueryService.DistrictData(1L, "서울지역연합"),
                        "010-9999-0000",
                        "seoul",
                        DayOfWeek.MONDAY,
                        "19:30",
                        MeetingType.OPEN,
                        "강남역 인근",
                        "서울특별시 강남구 테헤란로 123",
                        37.4979,
                        127.0276,
                        List.of(new PublicMeetingQueryService.GroupMeetingData(
                                100L,
                                "010-9999-0000",
                                "seoul",
                                DayOfWeek.MONDAY,
                                "19:30",
                                MeetingType.OPEN,
                                "강남역 인근",
                                "서울특별시 강남구 테헤란로 123",
                                37.4979,
                                127.0276))));

        mockMvc.perform(get("/api/public/meetings/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(100))
                .andExpect(jsonPath("$.data.groupName").value("강남그룹"))
                .andExpect(jsonPath("$.data.contactPhone").value("010-9999-0000"))
                .andExpect(jsonPath("$.data.locationDetail").value("강남역 인근"))
                .andExpect(jsonPath("$.data.latitude").value(37.4979))
                .andExpect(jsonPath("$.data.longitude").value(127.0276))
                .andExpect(jsonPath("$.data.groupMeetings[0].id").value(100))
                .andExpect(jsonPath("$.data.groupMeetings[0].contactPhone").value("010-9999-0000"));
    }

    @Test
    void publicGroupDetailReturnsMeetingsAndDistrict() throws Exception {
        given(publicMeetingQueryService.getGroup(20L))
                .willReturn(new PublicMeetingQueryService.PublicGroupDetail(
                        20L,
                        "강남그룹",
                        new PublicMeetingQueryService.DistrictData(1L, "서울지역연합"),
                        "02-1234-5678",
                        "첫 방문자는 10분 전에 와 주세요.",
                        List.of(new PublicMeetingQueryService.GroupMeetingData(
                                100L,
                                "010-9999-0000",
                                "seoul",
                                DayOfWeek.MONDAY,
                                "19:30",
                                MeetingType.OPEN,
                                "강남역 인근",
                                "서울특별시 강남구 테헤란로 123",
                                37.4979,
                                127.0276))));

        mockMvc.perform(get("/api/public/groups/20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(20))
                .andExpect(jsonPath("$.data.name").value("강남그룹"))
                .andExpect(jsonPath("$.data.district.name").value("서울지역연합"))
                .andExpect(jsonPath("$.data.notice").value("첫 방문자는 10분 전에 와 주세요."))
                .andExpect(jsonPath("$.data.contactPhone").value("02-1234-5678"))
                .andExpect(jsonPath("$.data.meetings[0].contactPhone").value("010-9999-0000"))
                .andExpect(jsonPath("$.data.meetings[0].locationDetail").value("강남역 인근"))
                .andExpect(jsonPath("$.data.meetings[0].latitude").value(37.4979))
                .andExpect(jsonPath("$.data.meetings[0].longitude").value(127.0276));
    }
}
