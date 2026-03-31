package org.aakorea.main.meeting.application;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.meeting.domain.Meeting;
import org.aakorea.main.meeting.domain.MeetingLocation;
import org.aakorea.main.meeting.domain.MeetingType;
import org.aakorea.main.meeting.infrastructure.MeetingRepository;
import org.aakorea.main.organization.domain.Group;
import org.aakorea.main.organization.infrastructure.GroupRepository;
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
            String dayOfWeek,
            String startTime,
            String type,
            LocationInput location,
            boolean active
    ) {
        Group group = getGroup(groupId);
        Meeting meeting = new Meeting(
                group,
                MeetingFieldSupport.requireProvince(province),
                MeetingFieldSupport.requireDayOfWeek(dayOfWeek),
                MeetingFieldSupport.requireStartTime(startTime),
                MeetingFieldSupport.requireMeetingType(type),
                toMeetingLocation(location),
                active);

        return toMeetingData(meetingRepository.save(meeting));
    }

    @Transactional
    public MeetingData updateMeeting(
            Long id,
            Long groupId,
            String province,
            String dayOfWeek,
            String startTime,
            String type,
            LocationInput location,
            boolean active
    ) {
        Meeting meeting = getMeeting(id);
        Group group = getGroup(groupId);
        meeting.update(
                group,
                MeetingFieldSupport.requireProvince(province),
                MeetingFieldSupport.requireDayOfWeek(dayOfWeek),
                MeetingFieldSupport.requireStartTime(startTime),
                MeetingFieldSupport.requireMeetingType(type),
                toMeetingLocation(location),
                active);

        return toMeetingData(meeting);
    }

    private Meeting getMeeting(Long id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "meeting not found"));
    }

    private Group getGroup(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "group not found"));
    }

    private MeetingLocation toMeetingLocation(LocationInput location) {
        return new MeetingLocation(
                MeetingFieldSupport.requireText(location.name(), "location.name"),
                MeetingFieldSupport.requireText(location.address(), "location.address"));
    }

    private MeetingData toMeetingData(Meeting meeting) {
        return new MeetingData(
                meeting.getId(),
                meeting.getGroup().getId(),
                meeting.getProvince(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                new LocationData(
                        meeting.getLocation().getName(),
                        meeting.getLocation().getAddress()),
                meeting.isActive());
    }

    public record MeetingData(
            Long id,
            Long groupId,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            LocationData location,
            boolean active
    ) {
    }

    public record LocationData(String name, String address) {
    }

    public record LocationInput(String name, String address) {
    }
}
