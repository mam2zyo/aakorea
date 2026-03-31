package org.aakorea.main.meeting.application;

import java.time.DayOfWeek;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.meeting.domain.Meeting;
import org.aakorea.main.meeting.domain.MeetingType;
import org.aakorea.main.meeting.infrastructure.MeetingRepository;
import org.aakorea.main.organization.infrastructure.GroupContactRepository;
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
                criteriaBuilder.isTrue(root.get("group").get("active")),
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

        if (!meeting.isActive() || !meeting.getGroup().isActive()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "meeting not found");
        }

        String contactPhone = groupContactRepository.findFirstByGroup_IdAndActiveTrueOrderByIdAsc(meeting.getGroup().getId())
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
                new LocationData(meeting.getLocation().getName(), meeting.getLocation().getAddress()),
                contactPhone);
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
                new LocationData(meeting.getLocation().getName(), meeting.getLocation().getAddress()));
    }

    public record PublicMeetingSummary(
            Long id,
            Long groupId,
            String groupName,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            LocationData location
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
            LocationData location,
            String contactPhone
    ) {
    }

    public record LocationData(String name, String address) {
    }
}
