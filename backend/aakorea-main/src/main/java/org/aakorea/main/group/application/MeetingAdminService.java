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
import org.aakorea.main.shared.Location;
import org.aakorea.main.shared.Province;
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
        Province normalizedProvince = MeetingFieldSupport.optionalProvince(province);

        Specification<Meeting> specification = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

        if (groupId != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("group").get("id"), groupId));
        }
        if (normalizedProvince != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("location").get("province"), normalizedProvince));
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
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude,
            String contactPhoneOverride,
            String dayOfWeek,
            String startTime,
            String type,
            boolean active
    ) {
        Group group = getGroup(groupId);
        String normalizedLocationDetail = MeetingFieldSupport.optionalText(locationDetail);
        String normalizedLocationAddress = MeetingFieldSupport.optionalText(locationAddress);
        Double normalizedLatitude = MeetingFieldSupport.optionalLatitude(latitude);
        Double normalizedLongitude = MeetingFieldSupport.optionalLongitude(longitude);
        String normalizedContactPhoneOverride = MeetingFieldSupport.optionalPhone(contactPhoneOverride);
        MeetingFieldSupport.validateLocation(normalizedLocationDetail, normalizedLocationAddress);
        MeetingFieldSupport.validateCoordinates(normalizedLatitude, normalizedLongitude);
        Meeting meeting = new Meeting(
                group,
                new Location(
                        MeetingFieldSupport.resolveProvince(normalizedLocationAddress),
                        normalizedLocationDetail,
                        normalizedLocationAddress,
                        normalizedLatitude,
                        normalizedLongitude),
                MeetingFieldSupport.requireDayOfWeek(dayOfWeek),
                MeetingFieldSupport.requireStartTime(startTime),
                MeetingFieldSupport.requireMeetingType(type),
                normalizedContactPhoneOverride,
                active);

        return toMeetingData(meetingRepository.save(meeting));
    }

    @Transactional
    public MeetingData updateMeeting(
            Long id,
            Long groupId,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude,
            String contactPhoneOverride,
            String dayOfWeek,
            String startTime,
            String type,
            boolean active
    ) {
        Meeting meeting = getMeeting(id);
        Group group = getGroup(groupId);
        String normalizedLocationDetail = MeetingFieldSupport.optionalText(locationDetail);
        String normalizedLocationAddress = MeetingFieldSupport.optionalText(locationAddress);
        Double normalizedLatitude = MeetingFieldSupport.optionalLatitude(latitude);
        Double normalizedLongitude = MeetingFieldSupport.optionalLongitude(longitude);
        String normalizedContactPhoneOverride = MeetingFieldSupport.optionalPhone(contactPhoneOverride);
        MeetingFieldSupport.validateLocation(normalizedLocationDetail, normalizedLocationAddress);
        MeetingFieldSupport.validateCoordinates(normalizedLatitude, normalizedLongitude);
        meeting.update(
                group,
                new Location(
                        MeetingFieldSupport.resolveProvince(normalizedLocationAddress),
                        normalizedLocationDetail,
                        normalizedLocationAddress,
                        normalizedLatitude,
                        normalizedLongitude),
                MeetingFieldSupport.requireDayOfWeek(dayOfWeek),
                MeetingFieldSupport.requireStartTime(startTime),
                MeetingFieldSupport.requireMeetingType(type),
                normalizedContactPhoneOverride,
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
                meeting.getProvince().getCode(),
                meeting.getLocationDetail(),
                meeting.getLocationAddress(),
                meeting.getLatitude(),
                meeting.getLongitude(),
                meeting.getContactPhoneOverride(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.isActive());
    }

    public record MeetingData(
            Long id,
            Long groupId,
            String province,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude,
            String contactPhoneOverride,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            boolean active
    ) {
    }
}
