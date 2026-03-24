package io.step5.aakorea.modules.service.meeting.infrastructure;

import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.group.infrastructure.GroupRepository;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.service.meeting.domain.MeetingStatus;
import io.step5.aakorea.modules.service.meeting.domain.MeetingType;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class MeetingRepositoryTest {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private MeetingRepository meetingRepository;

    @Test
    @Transactional
    void findsMeetingsByProvinceAndDayOfWeek() {
        Group group = new Group();
        group.setName("Hope Group");
        group.setStartDate(LocalDate.of(2010, 5, 1));
        group.setProvince(Province.GYEONGGI);

        MeetingPlace meetingPlace = new MeetingPlace();
        meetingPlace.setRoadAddress("1 Suwon-ro, Gyeonggi");
        meetingPlace.setDetailAddress("3F");
        meetingPlace.setLatitude(37.2636);
        meetingPlace.setLongitude(127.0286);
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
        assertThat(result.getFirst().getGroup().getName()).isEqualTo("Hope Group");
        assertThat(result.getFirst().getStartTime()).isEqualTo(LocalTime.of(20, 0));
    }
}