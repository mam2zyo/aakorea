package io.step5.aakorea.modules.general.admin.notice.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.step5.aakorea.modules.general.admin.group.domain.Group;
import io.step5.aakorea.modules.general.admin.group.infrastructure.GroupRepository;
import io.step5.aakorea.modules.general.admin.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.general.admin.notice.infrastructure.GroupNoticeRepository;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.LocalDateTime;
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
class AdminNoticeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private GroupNoticeRepository groupNoticeRepository;

    @BeforeEach
    void setUp() {
        groupNoticeRepository.deleteAll();
        groupRepository.deleteAll();
    }

    @Test
    void managesNoticeCrudAndPublicExposure() throws Exception {
        Group group = createGroup("공지 테스트 그룹");

        AdminNoticeRequest createRequest = new AdminNoticeRequest(
                "이번 주 장소 변경",
                "서울역 인근 회의실로 이동합니다.",
                io.step5.aakorea.modules.general.admin.notice.domain.NoticeType.TEMP_CHANGE,
                true,
                LocalDateTime.now().minusHours(2),
                LocalDateTime.now().plusDays(1)
        );

        mockMvc.perform(post("/api/admin/service/groups/{groupId}/notices", group.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("이번 주 장소 변경"))
                .andExpect(jsonPath("$.activeNow").value(true));

        Long noticeId = groupNoticeRepository.findAll().getFirst().getId();

        mockMvc.perform(get("/api/basic/groups/{groupId}", group.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notices", hasSize(1)))
                .andExpect(jsonPath("$.notices[0].title").value("이번 주 장소 변경"));

        AdminNoticeRequest updateRequest = new AdminNoticeRequest(
                "이번 주 장소 변경",
                "공지 숨김 처리",
                io.step5.aakorea.modules.general.admin.notice.domain.NoticeType.TEMP_CHANGE,
                false,
                LocalDateTime.now().minusHours(2),
                LocalDateTime.now().plusDays(1)
        );

        mockMvc.perform(put("/api/admin/service/groups/{groupId}/notices/{noticeId}", group.getId(), noticeId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.published").value(false));

        mockMvc.perform(get("/api/basic/groups/{groupId}", group.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notices", hasSize(0)));

        mockMvc.perform(delete("/api/admin/service/groups/{groupId}/notices/{noticeId}", group.getId(), noticeId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/admin/service/groups/{groupId}/notices", group.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void rejectsInvalidDisplayWindow() throws Exception {
        Group group = createGroup("공지 검증 그룹");

        AdminNoticeRequest request = new AdminNoticeRequest(
                "잘못된 공지",
                "종료 시각이 더 빠른 경우",
                io.step5.aakorea.modules.general.admin.notice.domain.NoticeType.GENERAL,
                true,
                LocalDateTime.of(2026, 3, 26, 9, 0),
                LocalDateTime.of(2026, 3, 25, 9, 0)
        );

        mockMvc.perform(post("/api/admin/service/groups/{groupId}/notices", group.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("공지 노출 종료 시각은 시작 시각보다 빠를 수 없습니다."));
    }

    private Group createGroup(String name) {
        Group group = new Group();
        group.setName(name);
        group.setProvince(Province.SEOUL);

        MeetingPlace place = new MeetingPlace();
        place.setRoadAddress("서울시 중구 테스트로 1");
        place.setDetailAddress("4층");
        place.setLatitude(37.5665);
        place.setLongitude(126.9780);
        group.setMeetingPlace(place);

        return groupRepository.save(group);
    }
}
