package org.aakorea.main.group.application;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingAdminService {

    private final MeetingRepository meetingRepository;
    private final GroupRepository groupRepository;

    public List<MeetingData> getMeetings(Long groupId, String province, Boolean active) {
        String normalizedProvince = MeetingFieldSupport.optionalProvince(province);

        Specification<Meeting> specification = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

        if (groupId != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("group").get("id"), groupId));
        }
        if (normalizedProvince != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("province"), normalizedProvince));
        }
        if (active != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("active"), active));
        }

        return meetingRepository.findAll(specification, Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(this::toMeetingData)
                .toList();
    }

    @Transactional
    public MeetingData createMeeting(
            Long groupId,
            String province,
            String locationName,
            String locationAddress,
            String dayOfWeek,
            String startTime,
            String type,
            boolean active
    ) {
        Group group = getGroup(groupId);
        String normalizedLocationName = MeetingFieldSupport.optionalText(locationName);
        String normalizedLocationAddress = MeetingFieldSupport.optionalText(locationAddress);
        MeetingFieldSupport.validateLocation(normalizedLocationName, normalizedLocationAddress);
        Meeting meeting = new Meeting(
                group,
                MeetingFieldSupport.requireProvince(province),
                normalizedLocationName,
                normalizedLocationAddress,
                MeetingFieldSupport.requireDayOfWeek(dayOfWeek),
                MeetingFieldSupport.requireStartTime(startTime),
                MeetingFieldSupport.requireMeetingType(type),
                active);

        return toMeetingData(meetingRepository.save(meeting));
    }

    @Transactional
    public MeetingData updateMeeting(
            Long id,
            Long groupId,
            String province,
            String locationName,
            String locationAddress,
            String dayOfWeek,
            String startTime,
            String type,
            boolean active
    ) {
        Meeting meeting = getMeeting(id);
        Group group = getGroup(groupId);
        String normalizedLocationName = MeetingFieldSupport.optionalText(locationName);
        String normalizedLocationAddress = MeetingFieldSupport.optionalText(locationAddress);
        MeetingFieldSupport.validateLocation(normalizedLocationName, normalizedLocationAddress);
        meeting.update(
                group,
                MeetingFieldSupport.requireProvince(province),
                normalizedLocationName,
                normalizedLocationAddress,
                MeetingFieldSupport.requireDayOfWeek(dayOfWeek),
                MeetingFieldSupport.requireStartTime(startTime),
                MeetingFieldSupport.requireMeetingType(type),
                active);

        return toMeetingData(meeting);
    }

    @Transactional
    public void deleteMeeting(Long id) {
        Meeting meeting = getMeeting(id);
        meetingRepository.delete(meeting);
    }

    private Meeting getMeeting(Long id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "meeting not found"));
    }

    private Group getGroup(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "group not found"));
    }

    private MeetingData toMeetingData(Meeting meeting) {
        return new MeetingData(
                meeting.getId(),
                meeting.getGroup().getId(),
                meeting.getProvince(),
                meeting.getLocationName(),
                meeting.getLocationAddress(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.isActive());
    }

    public record MeetingData(
            Long id,
            Long groupId,
            String province,
            String locationName,
            String locationAddress,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            boolean active
    ) {
    }
}
