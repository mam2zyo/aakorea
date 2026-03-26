package io.step5.aakorea.modules.general.admin.group.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.step5.aakorea.modules.general.admin.district.domain.District;
import io.step5.aakorea.modules.general.admin.district.infrastructure.DistrictRepository;
import io.step5.aakorea.modules.general.admin.group.domain.Group;
import io.step5.aakorea.modules.general.admin.group.infrastructure.GroupRepository;
import io.step5.aakorea.modules.general.admin.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminGroupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @BeforeEach
    void setUp() {
        groupRepository.deleteAll();
        districtRepository.deleteAll();
    }

    @Test
    void createUpdateListAndDeleteGroup() throws Exception {
        District district = new District();
        district.setName("Seoul Union");
        District savedDistrict = districtRepository.save(district);

        AdminGroupRequest createRequest = new AdminGroupRequest(
                "  Hope Group  ",
                LocalDate.of(2016, 1, 1),
                Province.SEOUL,
                savedDistrict.getId(),
                null,
                "Central Seoul",
                "hope@example.org",
                "010-1234-5678",
                "10 Plaza-ro, Seoul",
                "3F",
                "Use the front entrance",
                37.5665,
                126.9780
        );

        mockMvc.perform(post("/api/admin/service/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Hope Group"))
                .andExpect(jsonPath("$.districtName").value("Seoul Union"));

        Group group = groupRepository.findByNameContainingIgnoreCaseOrderByNameAsc("hope").getFirst();

        AdminGroupRequest updateRequest = new AdminGroupRequest(
                "New Hope Group",
                LocalDate.of(2018, 5, 12),
                Province.GYEONGGI,
                null,
                null,
                "Goyang",
                "newhope@example.org",
                "02-000-0000",
                "1 Jungang-ro, Goyang",
                "1F Hall",
                null,
                37.6584,
                126.8320
        );

        mockMvc.perform(put("/api/admin/service/groups/{groupId}", group.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Hope Group"))
                .andExpect(jsonPath("$.districtName").doesNotExist());

        mockMvc.perform(get("/api/admin/service/groups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.groups", hasSize(1)))
                .andExpect(jsonPath("$.groups[0].province").value("GYEONGGI"));

        mockMvc.perform(delete("/api/admin/service/groups/{groupId}", group.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/admin/service/groups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(0));
    }

    @Test
    void returnsNotFoundForUnknownDistrict() throws Exception {
        AdminGroupRequest request = new AdminGroupRequest(
                "Test Group",
                null,
                Province.SEOUL,
                9999L,
                null,
                null,
                null,
                null,
                "1 Test-ro, Seoul",
                "1F",
                null,
                37.0,
                127.0
        );

        mockMvc.perform(post("/api/admin/service/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void validatesLatitudeAndLongitudeRange() throws Exception {
        AdminGroupRequest request = new AdminGroupRequest(
                "Test Group",
                null,
                Province.SEOUL,
                null,
                null,
                null,
                null,
                null,
                "1 Test-ro, Seoul",
                "1F",
                null,
                91.0,
                190.0
        );

        mockMvc.perform(post("/api/admin/service/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnsNotFoundWhenDeletingUnknownGroup() throws Exception {
        mockMvc.perform(delete("/api/admin/service/groups/{groupId}", 12345L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void rejectsBlankGroupName() throws Exception {
        AdminGroupRequest request = new AdminGroupRequest(
                "   ",
                null,
                Province.SEOUL,
                null,
                null,
                null,
                null,
                null,
                "1 Test-ro, Seoul",
                "1F",
                null,
                37.0,
                127.0
        );

        mockMvc.perform(post("/api/admin/service/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void managesMeetingsWithinGroup() throws Exception {
        Group group = new Group();
        group.setName("Meeting Admin Group");
        group.setProvince(Province.SEOUL);

        MeetingPlace place = new MeetingPlace();
        place.setRoadAddress("1 Meeting-ro, Seoul");
        place.setDetailAddress("3F");
        place.setLatitude(37.0);
        place.setLongitude(127.0);
        group.setMeetingPlace(place);

        Group saved = groupRepository.save(group);

        String createBody = """
                {
                  "dayOfWeek": "MONDAY",
                  "startTime": "19:00",
                  "meetingType": "OPEN",
                  "status": "ACTIVE"
                }
                """;

        mockMvc.perform(post("/api/admin/service/groups/{groupId}/meetings", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dayOfWeek").value("MONDAY"));

        mockMvc.perform(get("/api/admin/service/groups/{groupId}/meetings", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void createsPublicChangeLogWhenGroupIsUpdated() throws Exception {
        Group group = new Group();
        group.setName("Change Log Group");
        group.setProvince(Province.SEOUL);

        MeetingPlace place = new MeetingPlace();
        place.setRoadAddress("1 Original-ro, Seoul");
        place.setDetailAddress("2F");
        place.setLatitude(37.0);
        place.setLongitude(127.0);
        group.setMeetingPlace(place);

        Group saved = groupRepository.save(group);

        AdminGroupRequest updateRequest = new AdminGroupRequest(
                "Changed Group",
                LocalDate.of(2024, 1, 1),
                Province.GYEONGGI,
                null,
                null,
                "Anyang",
                "changed@example.org",
                "02-111-1111",
                "99 New-ro, Anyang",
                "5F",
                "후문 출입",
                37.3943,
                126.9568
        );

        mockMvc.perform(put("/api/admin/service/groups/{groupId}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/basic/groups/{groupId}", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recentChangeLogs", hasSize(1)))
                .andExpect(jsonPath("$.recentChangeLogs[0].summary").value("그룹 기본 정보가 업데이트되었습니다."))
                .andExpect(jsonPath("$.recentChangeLogs[0].detail").value(org.hamcrest.Matchers.containsString("그룹명")));
    }
}
