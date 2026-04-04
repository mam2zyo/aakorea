package org.aakorea.main.group.application;

import java.time.DayOfWeek;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.group.infrastructure.GroupContactRepository;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
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
public class PublicMeetingQueryService {

    private final MeetingRepository meetingRepository;
    private final GroupRepository groupRepository;
    private final GroupContactRepository groupContactRepository;

    public List<PublicMeetingSummary> getMeetings(String province, String dayOfWeek) {
        Province normalizedProvince = MeetingFieldSupport.requireProvince(province);
        DayOfWeek normalizedDayOfWeek = MeetingFieldSupport.optionalDayOfWeek(dayOfWeek);

        Specification<Meeting> specification = (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isTrue(root.get("active")),
                criteriaBuilder.equal(root.get("location").get("province"), normalizedProvince));

        if (normalizedDayOfWeek != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("dayOfWeek"), normalizedDayOfWeek));
        }

        return meetingRepository.findAll(specification, Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(this::toSummary)
                .toList();
    }

    public PublicMeetingDetail getMeeting(Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "meeting not found"));

        if (!meeting.isActive()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "meeting not found");
        }

        return new PublicMeetingDetail(
                meeting.getId(),
                meeting.getGroup().getId(),
                meeting.getGroup().getName(),
                toDistrictData(meeting.getGroup()),
                findContactPhone(meeting.getGroup().getId()),
                meeting.getProvince().getCode(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.getLocationDetail(),
                meeting.getLocationAddress(),
                meeting.getLatitude(),
                meeting.getLongitude(),
                getActiveGroupMeetings(meeting.getGroup().getId()));
    }

    public PublicGroupDetail getGroup(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "group not found"));

        List<GroupMeetingData> activeMeetings = getActiveGroupMeetings(id);
        if (activeMeetings.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "group not found");
        }

        return new PublicGroupDetail(
                group.getId(),
                group.getName(),
                toDistrictData(group),
                findContactPhone(group.getId()),
                activeMeetings);
    }

    private PublicMeetingSummary toSummary(Meeting meeting) {
        return new PublicMeetingSummary(
                meeting.getId(),
                meeting.getGroup().getId(),
                meeting.getGroup().getName(),
                meeting.getProvince().getCode(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.getLocationDetail(),
                meeting.getLocationAddress(),
                meeting.getLatitude(),
                meeting.getLongitude());
    }

    private DistrictData toDistrictData(Group group) {
        return new DistrictData(group.getDistrict().getId(), group.getDistrict().getName());
    }

    private String findContactPhone(Long groupId) {
        return groupContactRepository.findFirstByGroup_IdOrderByIdAsc(groupId)
                .map(groupContact -> groupContact.getPhone())
                .orElse(null);
    }

    private List<GroupMeetingData> getActiveGroupMeetings(Long groupId) {
        return meetingRepository.findAllByGroup_IdAndActiveTrueOrderByIdAsc(groupId).stream()
                .sorted(Comparator
                        .comparingInt((Meeting item) -> item.getDayOfWeek().getValue())
                        .thenComparing(Meeting::getStartTime)
                        .thenComparing(Meeting::getId))
                .map(this::toGroupMeetingData)
                .toList();
    }

    private GroupMeetingData toGroupMeetingData(Meeting meeting) {
        return new GroupMeetingData(
                meeting.getId(),
                meeting.getProvince().getCode(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.getLocationDetail(),
                meeting.getLocationAddress(),
                meeting.getLatitude(),
                meeting.getLongitude());
    }

    public record PublicMeetingSummary(
            Long id,
            Long groupId,
            String groupName,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude
    ) {
    }

    public record PublicMeetingDetail(
            Long id,
            Long groupId,
            String groupName,
            DistrictData district,
            String contactPhone,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude,
            List<GroupMeetingData> groupMeetings
    ) {
    }

    public record PublicGroupDetail(
            Long id,
            String name,
            DistrictData district,
            String contactPhone,
            List<GroupMeetingData> meetings
    ) {
    }

    public record DistrictData(
            Long id,
            String name
    ) {
    }

    public record GroupMeetingData(
            Long id,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude
    ) {
    }
}
