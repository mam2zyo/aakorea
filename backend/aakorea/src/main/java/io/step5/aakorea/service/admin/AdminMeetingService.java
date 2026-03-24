package io.step5.aakorea.service.admin;

import io.step5.aakorea.domain.Group;
import io.step5.aakorea.domain.Meeting;
import io.step5.aakorea.domain.MeetingPlace;
import io.step5.aakorea.dto.admin.AdminMeetingDto;
import io.step5.aakorea.dto.admin.AdminMeetingRequest;
import io.step5.aakorea.repository.GroupRepository;
import io.step5.aakorea.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminMeetingService {

    private final GroupRepository groupRepository;
    private final MeetingRepository meetingRepository;

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

        return toDto(meetingRepository.save(meeting));
    }

    @Transactional
    public AdminMeetingDto updateMeeting(Long groupId, Long meetingId, AdminMeetingRequest request) {
        findGroup(groupId);
        Meeting meeting = findMeeting(meetingId, groupId);

        apply(meeting, request);

        return toDto(meeting);
    }

    @Transactional
    public void deleteMeeting(Long groupId, Long meetingId) {
        findGroup(groupId);
        Meeting meeting = findMeeting(meetingId, groupId);
        meetingRepository.delete(meeting);
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
            throw new MeetingPlaceValidationException("모임 개별 장소를 사용하려면 도로명주소, 상세주소, 위도, 경도를 모두 입력해야 합니다.");
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
}
