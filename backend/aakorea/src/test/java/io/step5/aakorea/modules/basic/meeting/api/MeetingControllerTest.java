package io.step5.aakorea.modules.basic.meeting.api;

import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.group.infrastructure.GroupRepository;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.service.meeting.domain.MeetingStatus;
import io.step5.aakorea.modules.service.meeting.domain.MeetingType;
import io.step5.aakorea.modules.service.meeting.infrastructure.MeetingRepository;
import io.step5.aakorea.modules.service.notice.domain.GroupNotice;
import io.step5.aakorea.modules.service.notice.domain.NoticeType;
import io.step5.aakorea.modules.service.notice.infrastructure.GroupNoticeRepository;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MeetingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private MeetingRepository meetingRepository;

    @Autowired
    private GroupNoticeRepository groupNoticeRepository;

    @BeforeEach
    void setUp() {
        groupNoticeRepository.deleteAll();
        meetingRepository.deleteAll();
        groupRepository.deleteAll();
    }

    @Test
    void sortsPublicMeetingsAndShowsPriorityNotice() throws Exception {
        Group highlightedGroup = createGroup("중앙 열린모임", Province.SEOUL);
        createMeeting(highlightedGroup, DayOfWeek.MONDAY, LocalTime.of(19, 0), MeetingType.OPEN, MeetingStatus.ACTIVE);

        Group laterGroup = createGroup("희망 열린모임", Province.SEOUL);
        createMeeting(laterGroup, DayOfWeek.MONDAY, LocalTime.of(20, 0), MeetingType.OPEN, MeetingStatus.ACTIVE);

        Group closedGroup = createGroup("비공개 모임", Province.SEOUL);
        createMeeting(closedGroup, DayOfWeek.MONDAY, LocalTime.of(18, 0), MeetingType.CLOSED, MeetingStatus.ACTIVE);

        Group suspendedGroup = createGroup("중단 모임", Province.SEOUL);
        createMeeting(suspendedGroup, DayOfWeek.MONDAY, LocalTime.of(17, 0), MeetingType.OPEN, MeetingStatus.SUSPENDED);

        createNotice(
                highlightedGroup,
                "일반 안내",
                "일반 공지",
                NoticeType.GENERAL,
                true,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(3)
        );
        createNotice(
                highlightedGroup,
                "장소 변경 안내",
                "이번 주는 임시로 장소가 바뀝니다.",
                NoticeType.TEMP_CHANGE,
                true,
                LocalDateTime.now().minusHours(1),
                LocalDateTime.now().plusDays(1)
        );
        createNotice(
                laterGroup,
                "지난 공지",
                "이미 종료된 공지",
                NoticeType.CLOSED_INFO,
                true,
                LocalDateTime.now().minusDays(5),
                LocalDateTime.now().minusDays(1)
        );

        mockMvc.perform(get("/api/meetings/search")
                        .param("province", "SEOUL")
                        .param("dayOfWeek", "MONDAY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.meetingType").doesNotExist())
                .andExpect(jsonPath("$.count").value(3))
                .andExpect(jsonPath("$.meetings[0].groupName").value("비공개 모임"))
                .andExpect(jsonPath("$.meetings[0].startTime").value("18:00:00"))
                .andExpect(jsonPath("$.meetings[0].highlightNotice").doesNotExist())
                .andExpect(jsonPath("$.meetings[1].groupName").value("중앙 열린모임"))
                .andExpect(jsonPath("$.meetings[1].highlightNotice.title").value("장소 변경 안내"))
                .andExpect(jsonPath("$.meetings[1].highlightNotice.type").value("TEMP_CHANGE"))
                .andExpect(jsonPath("$.meetings[2].groupName").value("희망 열린모임"))
                .andExpect(jsonPath("$.meetings[2].highlightNotice").doesNotExist());
    }

    private Group createGroup(String name, Province province) {
        Group group = new Group();
        group.setName(name);
        group.setProvince(province);

        MeetingPlace place = new MeetingPlace();
        place.setRoadAddress("서울시 중구 테스트로 1");
        place.setDetailAddress("3층");
        place.setLatitude(37.5665);
        place.setLongitude(126.9780);
        group.setMeetingPlace(place);

        return groupRepository.save(group);
    }

    private void createMeeting(
            Group group,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType meetingType,
            MeetingStatus status
    ) {
        Meeting meeting = new Meeting();
        meeting.setGroup(group);
        meeting.setDayOfWeek(dayOfWeek);
        meeting.setStartTime(startTime);
        meeting.setMeetingType(meetingType);
        meeting.setStatus(status);
        meetingRepository.save(meeting);
    }

    private void createNotice(
            Group group,
            String title,
            String content,
            NoticeType type,
            boolean published,
            LocalDateTime displayStartAt,
            LocalDateTime displayEndAt
    ) {
        GroupNotice notice = new GroupNotice();
        notice.setGroup(group);
        notice.setTitle(title);
        notice.setContent(content);
        notice.setType(type);
        notice.setPublished(published);
        notice.setDisplayStartAt(displayStartAt);
        notice.setDisplayEndAt(displayEndAt);
        groupNoticeRepository.save(notice);
    }
}
