package io.step5.aakorea.modules.service.meeting.application;

import io.step5.aakorea.modules.basic.group.application.GroupNotFoundException;
import io.step5.aakorea.modules.service.group.application.AdminGroupNotFoundException;
import io.step5.aakorea.modules.service.group.application.GroupChangeLogService;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.group.infrastructure.GroupRepository;
import io.step5.aakorea.modules.service.meeting.api.AdminMeetingDto;
import io.step5.aakorea.modules.service.meeting.api.AdminMeetingRequest;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.service.meeting.domain.MeetingStatus;
import io.step5.aakorea.modules.service.meeting.domain.MeetingType;
import io.step5.aakorea.modules.service.meeting.infrastructure.MeetingRepository;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminMeetingService {

    private final GroupRepository groupRepository;
    private final MeetingRepository meetingRepository;
    private final GroupChangeLogService groupChangeLogService;

    public List<AdminMeetingDto> getMeetings(Long groupId) {
        findGroup(groupId);
        return meetingRepository.findByGroup_IdOrderByDayOfWeekAscStartTimeAsc(groupId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public AdminMeetingDto createMeeting(Long groupId, AdminMeetingRequest request) {
        Group group = findGroup(groupId);

        Meeting meeting = new Meeting();
        meeting.setGroup(group);
        apply(meeting, request);

        Meeting savedMeeting = meetingRepository.save(meeting);
        groupChangeLogService.record(
                group,
                "정기 모임이 추가되었습니다.",
                describeMeeting(savedMeeting)
        );

        return toDto(savedMeeting);
    }

    @Transactional
    public AdminMeetingDto updateMeeting(Long groupId, Long meetingId, AdminMeetingRequest request) {
        findGroup(groupId);
        Meeting meeting = findMeeting(meetingId, groupId);
        MeetingSnapshot before = MeetingSnapshot.from(meeting);

        apply(meeting, request);
        MeetingSnapshot after = MeetingSnapshot.from(meeting);

        if (!before.equals(after)) {
            groupChangeLogService.record(
                    meeting.getGroup(),
                    "정기 모임 일정이 수정되었습니다.",
                    "변경 전\n" + before.describe() + "\n\n변경 후\n" + after.describe()
            );
        }

        return toDto(meeting);
    }

    @Transactional
    public void deleteMeeting(Long groupId, Long meetingId) {
        findGroup(groupId);
        Meeting meeting = findMeeting(meetingId, groupId);
        String detail = describeMeeting(meeting);
        meetingRepository.delete(meeting);
        groupChangeLogService.record(
                meeting.getGroup(),
                "정기 모임이 삭제되었습니다.",
                detail
        );
    }

    private Group findGroup(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new AdminGroupNotFoundException(groupId));
    }

    private Meeting findMeeting(Long meetingId, Long groupId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new AdminMeetingNotFoundException(meetingId));

        if (!meeting.getGroup().getId().equals(groupId)) {
            throw new AdminMeetingNotFoundException(meetingId);
        }

        return meeting;
    }

    private void apply(Meeting meeting, AdminMeetingRequest request) {
        meeting.setDayOfWeek(request.dayOfWeek());
        meeting.setStartTime(request.startTime());
        meeting.setMeetingType(request.meetingType());
        meeting.setStatus(request.status());

        if (hasOverridePlace(request)) {
            MeetingPlace meetingPlace = meeting.getMeetingPlace() == null ? new MeetingPlace() : meeting.getMeetingPlace();
            meetingPlace.setRoadAddress(normalizeText(request.meetingRoadAddress()));
            meetingPlace.setDetailAddress(normalizeText(request.meetingDetailAddress()));
            meetingPlace.setGuide(normalizeNullableText(request.meetingGuide()));
            meetingPlace.setLatitude(request.meetingLatitude());
            meetingPlace.setLongitude(request.meetingLongitude());
            meeting.setMeetingPlace(meetingPlace);
            return;
        }

        meeting.setMeetingPlace(null);
    }

    private boolean hasOverridePlace(AdminMeetingRequest request) {
        boolean anyAddress = hasText(request.meetingRoadAddress()) || hasText(request.meetingDetailAddress())
                || hasText(request.meetingGuide());
        boolean anyCoordinate = request.meetingLatitude() != null || request.meetingLongitude() != null;

        if (!anyAddress && !anyCoordinate) {
            return false;
        }

        if (!hasText(request.meetingRoadAddress()) || !hasText(request.meetingDetailAddress())
                || request.meetingLatitude() == null || request.meetingLongitude() == null) {
            throw new MeetingPlaceValidationException("筌뤴뫁??揶쏆뮆???關?쇘몴??????롮젻筌??袁⑥쨮筌뤿굞竊?? ?怨멸쉭雅뚯눘?? ?袁⑤즲, 野껋럥猷꾤몴?筌뤴뫀紐???낆젾??곷튊 ??몃빍??");
        }

        return true;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String normalizeText(String text) {
        return text == null ? "" : text.trim().replaceAll("\\s+", " ");
    }

    private String normalizeNullableText(String text) {
        if (text == null) return null;
        String normalized = text.trim().replaceAll("\\s+", " ");
        return normalized.isEmpty() ? null : normalized;
    }

    private AdminMeetingDto toDto(Meeting meeting) {
        MeetingPlace place = meeting.getMeetingPlace();
        return new AdminMeetingDto(
                meeting.getId(),
                meeting.getDayOfWeek().name(),
                meeting.getStartTime().toString(),
                meeting.getMeetingType().name(),
                meeting.getStatus().name(),
                place == null,
                place != null ? place.getRoadAddress() : null,
                place != null ? place.getDetailAddress() : null,
                place != null ? place.getGuide() : null,
                place != null ? place.getLatitude() : null,
                place != null ? place.getLongitude() : null
        );
    }

    private String describeMeeting(Meeting meeting) {
        return MeetingSnapshot.from(meeting).describe();
    }

    private record MeetingSnapshot(
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType meetingType,
            MeetingStatus status,
            boolean usesGroupDefaultPlace,
            String meetingRoadAddress,
            String meetingDetailAddress,
            String meetingGuide
    ) {
        private static MeetingSnapshot from(Meeting meeting) {
            MeetingPlace place = meeting.getMeetingPlace() != null
                    ? meeting.getMeetingPlace()
                    : meeting.getGroup().getMeetingPlace();

            return new MeetingSnapshot(
                    meeting.getDayOfWeek(),
                    meeting.getStartTime(),
                    meeting.getMeetingType(),
                    meeting.getStatus(),
                    meeting.getMeetingPlace() == null,
                    place != null ? place.getRoadAddress() : null,
                    place != null ? place.getDetailAddress() : null,
                    place != null ? place.getGuide() : null
            );
        }

        private String describe() {
            return """
                    - 일정: %s %s
                    - 모임 형태: %s
                    - 상태: %s
                    - 장소 방식: %s
                    - 주소: %s %s
                    - 안내: %s
                    """.formatted(
                    formatDayOfWeek(dayOfWeek),
                    formatTime(startTime),
                    formatMeetingType(meetingType),
                    formatMeetingStatus(status),
                    usesGroupDefaultPlace ? "기본 장소 사용" : "개별 장소 사용",
                    meetingRoadAddress == null ? "-" : meetingRoadAddress,
                    meetingDetailAddress == null ? "" : meetingDetailAddress,
                    meetingGuide == null || meetingGuide.isBlank() ? "-" : meetingGuide
            ).trim();
        }

        private String formatDayOfWeek(DayOfWeek value) {
            return switch (value) {
                case MONDAY -> "월요일";
                case TUESDAY -> "화요일";
                case WEDNESDAY -> "수요일";
                case THURSDAY -> "목요일";
                case FRIDAY -> "금요일";
                case SATURDAY -> "토요일";
                case SUNDAY -> "일요일";
            };
        }

        private String formatMeetingType(MeetingType value) {
            return switch (value) {
                case OPEN -> "공개모임";
                case CLOSED -> "비공개모임";
                case MIX -> "혼합모임";
            };
        }

        private String formatMeetingStatus(MeetingStatus value) {
            return switch (value) {
                case ACTIVE -> "운영 중";
                case SUSPENDED -> "잠정 중단";
            };
        }

        private String formatTime(LocalTime value) {
            return value == null ? "-" : value.toString();
        }
    }
}

