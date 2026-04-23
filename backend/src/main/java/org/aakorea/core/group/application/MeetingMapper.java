package org.aakorea.core.group.application;

import java.util.List;
import org.aakorea.core.group.domain.Meeting;
import org.springframework.stereotype.Component;

@Component
public class MeetingMapper {

    public MeetingData toMeetingData(Meeting meeting) {
        return new MeetingData(
                meeting.getId(),
                meeting.getGroup().getId(),
                meeting.getGroup().getName(),
                meeting.getProvince().getCode(),
                meeting.getLocationDetail(),
                meeting.getLocationAddress(),
                meeting.getLatitude(),
                meeting.getLongitude(),
                meeting.getContactPhoneOverride(),
                meeting.getDayOfWeek().name(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType().name(),
                meeting.isActive()
        );
    }

    public List<MeetingData> toMeetingDataList(List<Meeting> meetings) {
        return meetings.stream()
                .map(this::toMeetingData)
                .toList();
    }

    public record MeetingData(
            Long id,
            Long groupId,
            String groupName,
            String province,
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
    }
}
