package io.step5.aakorea.modules.general.admin.meeting.api;

import io.step5.aakorea.modules.general.admin.group.domain.Group;
import io.step5.aakorea.modules.general.admin.meeting.domain.Meeting;
import io.step5.aakorea.modules.general.admin.meeting.domain.MeetingType;

public record AdminMeetingDto(
        Long id,
        String dayOfWeek,
        String startTime,
        String meetingType,
        String status,
        boolean usesGroupDefaultPlace,
        String meetingRoadAddress,
        String meetingDetailAddress,
        String meetingGuide,
        Double meetingLatitude,
        Double meetingLongitude
) {
}

