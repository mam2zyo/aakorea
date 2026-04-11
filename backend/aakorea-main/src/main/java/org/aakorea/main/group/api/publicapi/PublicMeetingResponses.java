package org.aakorea.main.group.api.publicapi;

import java.time.DayOfWeek;
import java.util.List;
import org.aakorea.main.group.domain.MeetingType;

/**
 * Public HTTP response models for the group meeting APIs.
 *
 * <p>Keeping these records in the API package lets us refactor service-layer DTOs
 * without accidentally changing the JSON contract exposed to clients.
 */
public final class PublicMeetingResponses {

    private PublicMeetingResponses() {
    }

    public record MeetingSummary(
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
            Double longitude,
            Long districtId,
            Double distanceKm
    ) {
    }


    public record GroupDetail(
            Long id,
            String name,
            District district,
            String contactPhone,
            String notice,
            List<GroupMeeting> meetings
    ) {
    }

    public record District(
            Long id,
            String name
    ) {
    }

    public record GroupMeeting(
            Long id,
            String contactPhone,
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
