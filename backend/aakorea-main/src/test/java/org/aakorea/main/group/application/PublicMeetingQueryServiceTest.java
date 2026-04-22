package org.aakorea.main.group.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.aakorea.main.generalservice.domain.District;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.GroupContact;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.group.infrastructure.GroupContactRepository;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import org.aakorea.main.shared.Location;
import org.aakorea.main.shared.Province;

@ExtendWith(MockitoExtension.class)
class PublicMeetingQueryServiceTest {

    @Mock
    private MeetingRepository meetingRepository;

    @Mock
    private GroupContactRepository groupContactRepository;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private DistanceCalculator distanceCalculator;

    @InjectMocks
    private PublicMeetingQueryService publicMeetingQueryService;

    @Test
    void getMeetingsRequiresProvince() {
        assertThatThrownBy(() -> publicMeetingQueryService.getMeetings((List<String>) null, null, null, null, null, null, null, null))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(responseStatusException.getReason()).isEqualTo("province is required");
                });
    }

    @Test
    void getMeetingsWithAllProvinceReturnsEverything() {
        District district = new District("전국");
        Meeting meeting = new Meeting(
                new Group(district, "전국그룹"),
                new Location(Province.BUSAN, "장소", "주소", 35.0, 129.0),
                DayOfWeek.MONDAY,
                LocalTime.of(10, 0),
                MeetingType.OPEN,
                null,
                true);
        ReflectionTestUtils.setField(district, "id", 15L);
        ReflectionTestUtils.setField(meeting, "id", 1L);

        given(meetingRepository.findAll(
                org.mockito.ArgumentMatchers.<org.springframework.data.jpa.domain.Specification<Meeting>>any()))
                .willReturn(List.of(meeting));

        List<PublicMeetingQueryService.PublicMeetingSummary> result =
                publicMeetingQueryService.getMeetings(List.of("all"), null, null, null, null, null, null, null);

        assertThat(result).hasSize(1);
    }

    @Test
    void getMeetingsMapsPublicSummaryResponse() {
        District district = new District("서울");
        ReflectionTestUtils.setField(district, "id", 15L);
        Group group = new Group(district, "강남그룹", "첫 방문자는 10분 전에 와 주세요.");
        ReflectionTestUtils.setField(group, "id", 20L);
        Meeting meeting = new Meeting(
                group,
                new Location(
                        Province.SEOUL,
                        "강남역 인근",
                        "서울특별시 강남구 테헤란로 123",
                        37.4979,
                        127.0276),
                DayOfWeek.MONDAY,
                LocalTime.of(19, 30),
                MeetingType.OPEN,
                null,
                true);

        ReflectionTestUtils.setField(group, "id", 20L);
        ReflectionTestUtils.setField(meeting, "id", 100L);

        given(meetingRepository.findAll(
                org.mockito.ArgumentMatchers.<org.springframework.data.jpa.domain.Specification<Meeting>>any()))
                .willReturn(List.of(meeting));

        List<PublicMeetingQueryService.PublicMeetingSummary> result =
                publicMeetingQueryService.getMeetings(List.of("Seoul"), "monday", null, null, null, null, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().groupName()).isEqualTo("강남그룹");
        assertThat(result.getFirst().startTime()).isEqualTo("19:30");
        assertThat(result.getFirst().type()).isEqualTo(MeetingType.OPEN);
        assertThat(result.getFirst().locationDetail()).isEqualTo("강남역 인근");
        assertThat(result.getFirst().locationAddress()).isEqualTo("서울특별시 강남구 테헤란로 123");
        assertThat(result.getFirst().latitude()).isEqualTo(37.4979);
        assertThat(result.getFirst().longitude()).isEqualTo(127.0276);
        assertThat(result.getFirst().distanceKm()).isNull();
    }

    @Test
    void getMeetingsSupportsNearbySearchAndSortsByDistance() {
        District district = new District("서울");
        ReflectionTestUtils.setField(district, "id", 15L);
        Group group = new Group(district, "강남그룹");
        ReflectionTestUtils.setField(group, "id", 20L);
        Meeting nearestMeeting = new Meeting(
                group,
                new Location(
                        Province.SEOUL,
                        "강남역 인근",
                        "서울특별시 강남구 테헤란로 123",
                        37.4979,
                        127.0276),
                DayOfWeek.MONDAY,
                LocalTime.of(19, 30),
                MeetingType.OPEN,
                null,
                true);
        Meeting fartherMeeting = new Meeting(
                group,
                new Location(
                        Province.INCHEON,
                        "인천시청 인근",
                        "인천광역시 남동구 정각로 29",
                        37.4563,
                        126.7052),
                DayOfWeek.MONDAY,
                LocalTime.of(20, 0),
                MeetingType.CLOSED,
                null,
                true);

        ReflectionTestUtils.setField(group, "id", 20L);
        ReflectionTestUtils.setField(nearestMeeting, "id", 100L);
        ReflectionTestUtils.setField(fartherMeeting, "id", 101L);

        given(meetingRepository.findAll(
                org.mockito.ArgumentMatchers.<org.springframework.data.jpa.domain.Specification<Meeting>>any()))
                .willReturn(List.of(fartherMeeting, nearestMeeting));

        given(distanceCalculator.calculateDistanceKm(any(Double.class), any(Double.class), org.mockito.ArgumentMatchers.eq(37.4563), org.mockito.ArgumentMatchers.eq(126.7052))).willReturn(20.0);
        given(distanceCalculator.calculateDistanceKm(any(Double.class), any(Double.class), org.mockito.ArgumentMatchers.eq(37.4979), org.mockito.ArgumentMatchers.eq(127.0276))).willReturn(0.1);

        List<PublicMeetingQueryService.PublicMeetingSummary> result =
                publicMeetingQueryService.getMeetings(null, "MONDAY", null, null, null, 37.4980, 127.0280, 10);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).id()).isEqualTo(100L); // nearest
        assertThat(result.get(1).id()).isEqualTo(101L); // farther
        assertThat(result.get(0).distanceKm()).isNotNull();
        assertThat(result.get(0).distanceKm()).isLessThan(1.0);
    }


    @Test
    void getGroupReturnsGroupDetailsForActiveMeetings() {
        District district = new District("서울");
        ReflectionTestUtils.setField(district, "id", 1L);
        Group group = new Group(district, "강남그룹", "첫 방문자는 10분 전에 와 주세요.");
        Meeting meeting = new Meeting(
                group,
                new Location(
                        Province.SEOUL,
                        "강남역 인근",
                        "서울특별시 강남구 테헤란로 123",
                        37.4979,
                        127.0276),
                DayOfWeek.MONDAY,
                LocalTime.of(19, 30),
                MeetingType.OPEN,
                "010-9999-0000",
                true);
        GroupContact groupContact = new GroupContact(group, "02-1234-5678", null, null);

        ReflectionTestUtils.setField(group, "id", 20L);
        ReflectionTestUtils.setField(meeting, "id", 100L);

        given(groupRepository.findById(20L)).willReturn(Optional.of(group));
        given(meetingRepository.findAllByGroup_IdAndActiveTrueOrderByIdAsc(20L))
                .willReturn(List.of(meeting));
        given(groupContactRepository.findFirstByGroup_IdOrderByIdAsc(20L))
                .willReturn(Optional.of(groupContact));

        PublicMeetingQueryService.PublicGroupDetail result = publicMeetingQueryService.getGroup(20L);

        assertThat(result.name()).isEqualTo("강남그룹");
        assertThat(result.district().name()).isEqualTo("서울");
        assertThat(result.contactPhone()).isEqualTo("02-1234-5678");
        assertThat(result.notice()).isEqualTo("첫 방문자는 10분 전에 와 주세요.");
        assertThat(result.meetings()).hasSize(1);
        assertThat(result.meetings().getFirst().contactPhone()).isEqualTo("010-9999-0000");
    }
}
