package io.step5.aakorea.repository;

import io.step5.aakorea.domain.Group;
import io.step5.aakorea.domain.Meeting;
import io.step5.aakorea.domain.MeetingPlace;
import io.step5.aakorea.domain.MeetingStatus;
import io.step5.aakorea.domain.MeetingType;
import io.step5.aakorea.domain.Province;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class MeetingRepositoryTest {

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    MeetingRepository meetingRepository;

    @Test
    @Transactional
    void 모임_생성_및_요일별_조회_테스트() {
        Group group = new Group();
        group.setName("희망 그룹");
        group.setStartDate(LocalDate.of(2010, 5, 1));
        group.setProvince(Province.GYEONGGI);

        MeetingPlace meetingPlace = new MeetingPlace();
        meetingPlace.setName("AA 경기 회관");
        meetingPlace.setRoadAddress("경기도 수원시 팔달구 1");
        meetingPlace.setDetailAddress("3층");
        group.setMeetingPlace(meetingPlace);

        groupRepository.save(group);

        Meeting meeting = new Meeting();
        meeting.setDayOfWeek(DayOfWeek.FRIDAY);
        meeting.setStartTime(LocalTime.of(20, 0));
        meeting.setMeetingType(MeetingType.OPEN);
        meeting.setStatus(MeetingStatus.ACTIVE);
        meeting.setGroup(group);

        meetingRepository.save(meeting);

        List<Meeting> result = meetingRepository.findByGroup_ProvinceAndDayOfWeekOrderByStartTimeAsc(
                Province.GYEONGGI,
                DayOfWeek.FRIDAY
        );

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getGroup().getName()).isEqualTo("희망 그룹");
        assertThat(result.getFirst().getStartTime()).isEqualTo(LocalTime.of(20, 0));
    }
}
