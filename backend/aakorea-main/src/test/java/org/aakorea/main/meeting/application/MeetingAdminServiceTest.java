package org.aakorea.main.meeting.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.time.DayOfWeek;
import java.util.Optional;
import org.aakorea.main.meeting.domain.Meeting;
import org.aakorea.main.meeting.domain.MeetingType;
import org.aakorea.main.meeting.infrastructure.MeetingRepository;
import org.aakorea.main.organization.domain.District;
import org.aakorea.main.organization.domain.Group;
import org.aakorea.main.organization.infrastructure.GroupRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class MeetingAdminServiceTest {

    @Mock
    private MeetingRepository meetingRepository;

    @Mock
    private GroupRepository groupRepository;

    @InjectMocks
    private MeetingAdminService meetingAdminService;

    @Test
    void createMeetingNormalizesFieldsBeforeSaving() {
        District district = new District("서울", true);
        Group group = new Group(district, "강남그룹", true);
        ReflectionTestUtils.setField(group, "id", 20L);

        given(groupRepository.findById(20L)).willReturn(Optional.of(group));
        given(meetingRepository.save(any(Meeting.class))).willAnswer(invocation -> {
            Meeting meeting = invocation.getArgument(0);
            ReflectionTestUtils.setField(meeting, "id", 100L);
            return meeting;
        });

        MeetingAdminService.MeetingData result = meetingAdminService.createMeeting(
                20L,
                " Seoul ",
                "monday",
                "19:30",
                "open",
                new MeetingAdminService.LocationInput(" 강남역 인근 ", " 서울특별시 강남구 테헤란로 123 "),
                true);

        ArgumentCaptor<Meeting> captor = ArgumentCaptor.forClass(Meeting.class);
        verify(meetingRepository).save(captor.capture());
        Meeting savedMeeting = captor.getValue();

        assertThat(savedMeeting.getProvince()).isEqualTo("seoul");
        assertThat(savedMeeting.getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
        assertThat(savedMeeting.getStartTime().toString()).isEqualTo("19:30");
        assertThat(savedMeeting.getType()).isEqualTo(MeetingType.OPEN);
        assertThat(savedMeeting.getLocation().getName()).isEqualTo("강남역 인근");
        assertThat(savedMeeting.getLocation().getAddress()).isEqualTo("서울특별시 강남구 테헤란로 123");
        assertThat(result.id()).isEqualTo(100L);
        assertThat(result.startTime()).isEqualTo("19:30");
    }

    @Test
    void getMeetingsThrowsWhenProvinceIsInvalid() {
        assertThatThrownBy(() -> meetingAdminService.getMeetings(null, "invalid-province", null))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(responseStatusException.getReason()).isEqualTo("province is invalid");
                });
    }

    @Test
    void updateMeetingChangesAllFields() {
        District oldDistrict = new District("서울", true);
        District newDistrict = new District("부산", true);
        Group oldGroup = new Group(oldDistrict, "강남그룹", true);
        Group newGroup = new Group(newDistrict, "해운대그룹", true);
        Meeting meeting = new Meeting(
                oldGroup,
                "seoul",
                DayOfWeek.MONDAY,
                java.time.LocalTime.of(19, 30),
                MeetingType.OPEN,
                new org.aakorea.main.meeting.domain.MeetingLocation("강남역", "서울 주소"),
                true);

        ReflectionTestUtils.setField(newGroup, "id", 21L);
        ReflectionTestUtils.setField(meeting, "id", 100L);

        given(meetingRepository.findById(100L)).willReturn(Optional.of(meeting));
        given(groupRepository.findById(21L)).willReturn(Optional.of(newGroup));

        MeetingAdminService.MeetingData result = meetingAdminService.updateMeeting(
                100L,
                21L,
                "busan",
                "TUESDAY",
                "20:00",
                "NOTFIXED",
                new MeetingAdminService.LocationInput("해운대역 인근", "부산광역시 해운대구"),
                false);

        assertThat(meeting.getGroup()).isEqualTo(newGroup);
        assertThat(meeting.getProvince()).isEqualTo("busan");
        assertThat(meeting.getDayOfWeek()).isEqualTo(DayOfWeek.TUESDAY);
        assertThat(meeting.getStartTime().toString()).isEqualTo("20:00");
        assertThat(meeting.getType()).isEqualTo(MeetingType.NOTFIXED);
        assertThat(meeting.getLocation().getName()).isEqualTo("해운대역 인근");
        assertThat(meeting.isActive()).isFalse();
        assertThat(result.groupId()).isEqualTo(21L);
        assertThat(result.type()).isEqualTo(MeetingType.NOTFIXED);
    }
}
