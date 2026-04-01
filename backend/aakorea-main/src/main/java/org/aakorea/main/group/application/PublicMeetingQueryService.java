package org.aakorea.main.group.application;

import java.time.DayOfWeek;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.group.infrastructure.GroupContactRepository;
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
public class PublicMeetingQueryService {

    private final MeetingRepository meetingRepository;
    private final GroupContactRepository groupContactRepository;

    public List<PublicMeetingSummary> getMeetings(String province, String dayOfWeek) {
        String normalizedProvince = MeetingFieldSupport.requireProvince(province);
        DayOfWeek normalizedDayOfWeek = MeetingFieldSupport.optionalDayOfWeek(dayOfWeek);

        Specification<Meeting> specification = (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isTrue(root.get("active")),
                criteriaBuilder.equal(root.get("province"), normalizedProvince));

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

        String contactPhone = groupContactRepository.findFirstByGroup_IdOrderByIdAsc(meeting.getGroup().getId())
                .map(groupContact -> groupContact.getPhone())
                .orElse(null);

        return new PublicMeetingDetail(
                meeting.getId(),
                meeting.getGroup().getId(),
                meeting.getGroup().getName(),
                meeting.getProvince(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.getMeetingPlaceNote(),
                contactPhone,
                toGroupProfile(meeting.getGroup()),
                meetingRepository.findAllByGroup_IdAndActiveTrueOrderByIdAsc(meeting.getGroup().getId()).stream()
                        .sorted(Comparator
                                .comparingInt((Meeting item) -> item.getDayOfWeek().getValue())
                                .thenComparing(Meeting::getStartTime))
                        .map(this::toScheduleData)
                        .toList());
    }

    private PublicMeetingSummary toSummary(Meeting meeting) {
        return new PublicMeetingSummary(
                meeting.getId(),
                meeting.getGroup().getId(),
                meeting.getGroup().getName(),
                meeting.getProvince(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.getMeetingPlaceNote(),
                toGroupLocation(meeting.getGroup()));
    }

    private GroupLocationData toGroupLocation(Group group) {
        return new GroupLocationData(group.getLocationName(), group.getLocationAddress());
    }

    private GroupProfileData toGroupProfile(Group group) {
        return new GroupProfileData(
                group.getId(),
                group.getName(),
                group.getLocationName(),
                group.getLocationAddress(),
                group.getIntroduction(),
                group.getNotice(),
                group.getChangeSummary());
    }

    private MeetingScheduleData toScheduleData(Meeting meeting) {
        return new MeetingScheduleData(
                meeting.getId(),
                meeting.getProvince(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.getMeetingPlaceNote());
    }

    public record PublicMeetingSummary(
            Long id,
            Long groupId,
            String groupName,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            String meetingPlaceNote,
            GroupLocationData groupLocation
    ) {
    }

    public record PublicMeetingDetail(
            Long id,
            Long groupId,
            String groupName,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            String meetingPlaceNote,
            String contactPhone,
            GroupProfileData group,
            List<MeetingScheduleData> groupMeetings
    ) {
    }

    public record GroupLocationData(String name, String address) {
    }

    public record GroupProfileData(
            Long id,
            String name,
            String locationName,
            String locationAddress,
            String introduction,
            String notice,
            String changeSummary
    ) {
    }

    public record MeetingScheduleData(
            Long id,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            String meetingPlaceNote
    ) {
    }
}
