package io.step5.aakorea.modules.service.district.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.step5.aakorea.modules.service.district.domain.District;
import io.step5.aakorea.modules.service.district.infrastructure.DistrictRepository;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.group.infrastructure.GroupRepository;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
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
class AdminDistrictControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private GroupRepository groupRepository;

    @BeforeEach
    void setUp() {
        groupRepository.deleteAll();
        districtRepository.deleteAll();
    }

    @Test
    void createUpdateAndListDistricts() throws Exception {
        mockMvc.perform(post("/api/admin/districts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AdminDistrictRequest("  Capital Region  "))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Capital Region"))
                .andExpect(jsonPath("$.groupCount").value(0));

        District district = districtRepository.findByName("Capital Region").orElseThrow();

        mockMvc.perform(put("/api/admin/districts/{districtId}", district.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AdminDistrictRequest("Daegyeong"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Daegyeong"));

        mockMvc.perform(get("/api/admin/districts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.districts", hasSize(1)))
                .andExpect(jsonPath("$.districts[0].name").value("Daegyeong"));
    }

    @Test
    void cannotDeleteDistrictWhenGroupsExist() throws Exception {
        District district = new District();
        district.setName("Incheon Union");
        District savedDistrict = districtRepository.save(district);

        Group group = new Group();
        group.setName("Hope Group");
        group.setStartDate(LocalDate.of(2010, 5, 1));
        group.setProvince(Province.INCHEON);
        group.setDistrict(savedDistrict);

        MeetingPlace meetingPlace = new MeetingPlace();
        meetingPlace.setRoadAddress("1 Freedom-ro, Incheon");
        meetingPlace.setDetailAddress("2F");
        meetingPlace.setLatitude(37.4563);
        meetingPlace.setLongitude(126.7052);
        group.setMeetingPlace(meetingPlace);

        groupRepository.save(group);

        mockMvc.perform(delete("/api/admin/districts/{districtId}", savedDistrict.getId()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }
}