package io.step5.aakorea.controller.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.step5.aakorea.domain.District;
import io.step5.aakorea.domain.Group;
import io.step5.aakorea.domain.MeetingPlace;
import io.step5.aakorea.domain.Province;
import io.step5.aakorea.dto.admin.AdminDistrictRequest;
import io.step5.aakorea.repository.DistrictRepository;
import io.step5.aakorea.repository.GroupRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

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
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    DistrictRepository districtRepository;

    @Autowired
    GroupRepository groupRepository;

    @BeforeEach
    void setUp() {
        groupRepository.deleteAll();
        districtRepository.deleteAll();
    }

    @Test
    void 지역연합을_생성_수정_조회할_수_있다() throws Exception {
        mockMvc.perform(post("/api/admin/districts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AdminDistrictRequest("  수도권 남부 연합  "))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("수도권 남부 연합"))
                .andExpect(jsonPath("$.groupCount").value(0));

        District district = districtRepository.findByName("수도권 남부 연합").orElseThrow();

        mockMvc.perform(put("/api/admin/districts/{districtId}", district.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AdminDistrictRequest("대경연합"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("대경연합"));

        mockMvc.perform(get("/api/admin/districts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.districts", hasSize(1)))
                .andExpect(jsonPath("$.districts[0].name").value("대경연합"));
    }

    @Test
    void 그룹이_있는_지역연합은_삭제할_수_없다() throws Exception {
        District district = new District();
        district.setName("인천연합");
        District savedDistrict = districtRepository.save(district);

        Group group = new Group();
        group.setName("희망 그룹");
        group.setStartDate(LocalDate.of(2010, 5, 1));
        group.setProvince(Province.INCHEON);
        group.setDistrict(savedDistrict);

        MeetingPlace meetingPlace = new MeetingPlace();
        meetingPlace.setName("AA 인천 회관");
        meetingPlace.setRoadAddress("인천광역시 남동구 예술로 1");
        meetingPlace.setDetailAddress("2층");
        group.setMeetingPlace(meetingPlace);

        groupRepository.save(group);

        mockMvc.perform(delete("/api/admin/districts/{districtId}", savedDistrict.getId()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("'인천연합' 지역연합에 소속된 그룹 1개가 있어 삭제할 수 없습니다."));
    }
}
