package io.step5.aakorea.controller.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.step5.aakorea.domain.District;
import io.step5.aakorea.domain.Group;
import io.step5.aakorea.domain.MeetingPlace;
import io.step5.aakorea.domain.Province;
import io.step5.aakorea.dto.admin.AdminGroupRequest;
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
class AdminGroupControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    DistrictRepository districtRepository;

    @BeforeEach
    void setUp() {
        groupRepository.deleteAll();
        districtRepository.deleteAll();
    }

    @Test
    void 그룹을_생성_수정_조회_삭제할_수_있다() throws Exception {
        District district = new District();
        district.setName("수도권 서부연합");
        District savedDistrict = districtRepository.save(district);

        AdminGroupRequest createRequest = new AdminGroupRequest(
                "  희망 그룹  ",
                LocalDate.of(2016, 1, 1),
                Province.SEOUL,
                savedDistrict.getId(),
                "서울시 중구",
                "hope@example.org",
                "010-1234-5678",
                "서울 중구 을지로 10",
                "3층",
                "건물 뒷문 이용",
                37.5665,
                126.9780
        );

        mockMvc.perform(post("/api/admin/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("희망 그룹"))
                .andExpect(jsonPath("$.districtName").value("수도권 서부연합"));

        Group group = groupRepository.findByNameContainingIgnoreCaseOrderByNameAsc("희망").getFirst();

        AdminGroupRequest updateRequest = new AdminGroupRequest(
                "새희망 그룹",
                LocalDate.of(2018, 5, 12),
                Province.GYEONGGI,
                null,
                "경기도 고양시",
                "newhope@example.org",
                "02-000-0000",
                "경기 고양시 일산동구 중앙로 1",
                "1층 교육실",
                null,
                37.6584,
                126.8320
        );

        mockMvc.perform(put("/api/admin/groups/{groupId}", group.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("새희망 그룹"))
                .andExpect(jsonPath("$.districtName").doesNotExist());

        mockMvc.perform(get("/api/admin/groups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.groups", hasSize(1)))
                .andExpect(jsonPath("$.groups[0].province").value("GYEONGGI"));

        mockMvc.perform(delete("/api/admin/groups/{groupId}", group.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/admin/groups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(0));
    }

    @Test
    void 없는_지역연합으로_그룹을_등록하면_예외가_발생한다() throws Exception {
        AdminGroupRequest request = new AdminGroupRequest(
                "테스트 그룹",
                null,
                Province.SEOUL,
                9999L,
                null,
                null,
                null,
                "서울 어딘가",
                "지하 1층",
                null,
                37.0,
                127.0
        );

        mockMvc.perform(post("/api/admin/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("ID 9999 지역연합을 찾을 수 없습니다."));
    }

    @Test
    void 위도와_경도_범위를_검증한다() throws Exception {
        AdminGroupRequest request = new AdminGroupRequest(
                "테스트 그룹",
                null,
                Province.SEOUL,
                null,
                null,
                null,
                null,
                "서울 어딘가",
                "지하 1층",
                null,
                91.0,
                190.0
        );

        mockMvc.perform(post("/api/admin/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void 없는_그룹을_삭제하면_예외가_발생한다() throws Exception {
        mockMvc.perform(delete("/api/admin/groups/{groupId}", 12345L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("ID 12345 그룹을 찾을 수 없습니다."));
    }

    @Test
    void 이름이_비어있으면_생성할_수_없다() throws Exception {
        AdminGroupRequest request = new AdminGroupRequest(
                "   ",
                null,
                Province.SEOUL,
                null,
                null,
                null,
                null,
                "서울 어딘가",
                "지하 1층",
                null,
                37.0,
                127.0
        );

        mockMvc.perform(post("/api/admin/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
