package org.aakorea.main.group.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.GroupContact;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingLocation;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.group.infrastructure.GroupContactRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
import org.aakorea.main.organization.domain.District;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class PublicMeetingQueryServiceTest {

    @Mock
    private MeetingRepository meetingRepository;

    @Mock
    private GroupContactRepository groupContactRepository;

    @InjectMocks
    private PublicMeetingQueryService publicMeetingQueryService;

    @Test
    void getMeetingsRequiresProvince() {
        assertThatThrownBy(() -> publicMeetingQueryService.getMeetings(null, null))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(responseStatusException.getReason()).isEqualTo("province is required");
                });
    }

    @Test
    void getMeetingsMapsPublicSummaryResponse() {
        District district = new District("서울");
        Group group = new Group(district, "강남그룹");
        Meeting meeting = new Meeting(
                group,
                "seoul",
                DayOfWeek.MONDAY,
                LocalTime.of(19, 30),
                MeetingType.OPEN,
                new MeetingLocation("강남역 인근", "서울특별시 강남구 테헤란로 123"),
                true);

        ReflectionTestUtils.setField(group, "id", 20L);
        ReflectionTestUtils.setField(meeting, "id", 100L);

        given(meetingRepository.findAll(
                org.mockito.ArgumentMatchers.<org.springframework.data.jpa.domain.Specification<Meeting>>any(),
                any(org.springframework.data.domain.Sort.class)))
                .willReturn(List.of(meeting));

        List<PublicMeetingQueryService.PublicMeetingSummary> result =
                publicMeetingQueryService.getMeetings("Seoul", "monday");

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().groupName()).isEqualTo("강남그룹");
        assertThat(result.getFirst().startTime()).isEqualTo("19:30");
        assertThat(result.getFirst().type()).isEqualTo(MeetingType.OPEN);
    }

    @Test
    void getMeetingReturnsRepresentativeContact() {
        District district = new District("서울");
        Group group = new Group(district, "강남그룹");
        Meeting meeting = new Meeting(
                group,
                "seoul",
                DayOfWeek.MONDAY,
                LocalTime.of(19, 30),
                MeetingType.OPEN,
                new MeetingLocation("강남역 인근", "서울특별시 강남구 테헤란로 123"),
                true);
        GroupContact groupContact = new GroupContact(group, "02-1234-5678");

        ReflectionTestUtils.setField(group, "id", 20L);
        ReflectionTestUtils.setField(meeting, "id", 100L);

        given(meetingRepository.findById(100L)).willReturn(Optional.of(meeting));
        given(groupContactRepository.findFirstByGroup_IdOrderByIdAsc(20L))
                .willReturn(Optional.of(groupContact));

        PublicMeetingQueryService.PublicMeetingDetail result = publicMeetingQueryService.getMeeting(100L);

        assertThat(result.groupName()).isEqualTo("강남그룹");
        assertThat(result.contactPhone()).isEqualTo("02-1234-5678");
    }
}
