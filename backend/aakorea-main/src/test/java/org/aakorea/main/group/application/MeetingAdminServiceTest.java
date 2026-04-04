package org.aakorea.main.group.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.time.DayOfWeek;
import java.util.Optional;
import org.aakorea.main.generalservice.domain.District;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
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
        District district = new District("서울");
        Group group = new Group(district, "강남그룹");
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
                "  강남역 인근  ",
                "  서울특별시 강남구 테헤란로 123  ",
                "monday",
                "19:30",
                "open",
                true);

        ArgumentCaptor<Meeting> captor = ArgumentCaptor.forClass(Meeting.class);
        verify(meetingRepository).save(captor.capture());
        Meeting savedMeeting = captor.getValue();

        assertThat(savedMeeting.getProvince()).isEqualTo("seoul");
        assertThat(savedMeeting.getLocationName()).isEqualTo("강남역 인근");
        assertThat(savedMeeting.getLocationAddress()).isEqualTo("서울특별시 강남구 테헤란로 123");
        assertThat(savedMeeting.getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
        assertThat(savedMeeting.getStartTime().toString()).isEqualTo("19:30");
        assertThat(savedMeeting.getType()).isEqualTo(MeetingType.OPEN);
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
        District oldDistrict = new District("서울");
        District newDistrict = new District("부산");
        Group oldGroup = new Group(oldDistrict, "강남그룹");
        Group newGroup = new Group(newDistrict, "해운대그룹");
        Meeting meeting = new Meeting(
                oldGroup,
                "seoul",
                "강남역 인근",
                "서울특별시 강남구 테헤란로 123",
                DayOfWeek.MONDAY,
                java.time.LocalTime.of(19, 30),
                MeetingType.OPEN,
                true);

        ReflectionTestUtils.setField(newGroup, "id", 21L);
        ReflectionTestUtils.setField(meeting, "id", 100L);

        given(meetingRepository.findById(100L)).willReturn(Optional.of(meeting));
        given(groupRepository.findById(21L)).willReturn(Optional.of(newGroup));

        MeetingAdminService.MeetingData result = meetingAdminService.updateMeeting(
                100L,
                21L,
                "busan",
                "해운대역 인근",
                "부산광역시 해운대구 우동 123",
                "TUESDAY",
                "20:00",
                "NOTFIXED",
                false);

        assertThat(meeting.getGroup()).isEqualTo(newGroup);
        assertThat(meeting.getProvince()).isEqualTo("busan");
        assertThat(meeting.getLocationName()).isEqualTo("해운대역 인근");
        assertThat(meeting.getLocationAddress()).isEqualTo("부산광역시 해운대구 우동 123");
        assertThat(meeting.getDayOfWeek()).isEqualTo(DayOfWeek.TUESDAY);
        assertThat(meeting.getStartTime().toString()).isEqualTo("20:00");
        assertThat(meeting.getType()).isEqualTo(MeetingType.NOTFIXED);
        assertThat(meeting.isActive()).isFalse();
        assertThat(result.groupId()).isEqualTo(21L);
        assertThat(result.type()).isEqualTo(MeetingType.NOTFIXED);
    }

    @Test
    void deleteMeetingRemovesMeeting() {
        District district = new District("서울");
        Group group = new Group(district, "강남그룹");
        Meeting meeting = new Meeting(
                group,
                "seoul",
                "강남역 인근",
                "서울특별시 강남구 테헤란로 123",
                DayOfWeek.MONDAY,
                java.time.LocalTime.of(19, 30),
                MeetingType.OPEN,
                true);

        ReflectionTestUtils.setField(meeting, "id", 100L);

        given(meetingRepository.findById(100L)).willReturn(Optional.of(meeting));

        meetingAdminService.deleteMeeting(100L);

        verify(meetingRepository).delete(meeting);
    }
}
