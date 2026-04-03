package org.aakorea.main.group.api.publicapi;

import java.util.List;
import org.aakorea.main.group.application.PublicMeetingQueryService.DistrictData;
import org.aakorea.main.group.application.PublicMeetingQueryService.GroupMeetingData;
import org.aakorea.main.group.application.PublicMeetingQueryService.PublicGroupDetail;
import org.aakorea.main.group.application.PublicMeetingQueryService.PublicMeetingDetail;
import org.aakorea.main.group.application.PublicMeetingQueryService.PublicMeetingSummary;

/**
 * Converts service-layer query results into API response models.
 */
final class PublicMeetingResponseMapper {

    private PublicMeetingResponseMapper() {
    }

    static List<PublicMeetingResponses.MeetingSummary> toMeetingSummaries(
            List<PublicMeetingSummary> meetingSummaries
    ) {
        return meetingSummaries.stream()
                .map(PublicMeetingResponseMapper::toMeetingSummary)
                .toList();
    }

    // This mapper is the boundary between internal service data and the public HTTP contract.
    static PublicMeetingResponses.MeetingDetail toMeetingDetail(PublicMeetingDetail meetingDetail) {
        return new PublicMeetingResponses.MeetingDetail(
                meetingDetail.id(),
                meetingDetail.groupId(),
                meetingDetail.groupName(),
                toDistrict(meetingDetail.district()),
                meetingDetail.contactPhone(),
                meetingDetail.province(),
                meetingDetail.dayOfWeek(),
                meetingDetail.startTime(),
                meetingDetail.type(),
                meetingDetail.locationName(),
                meetingDetail.locationAddress(),
                toGroupMeetings(meetingDetail.groupMeetings()));
    }

    static PublicMeetingResponses.GroupDetail toGroupDetail(PublicGroupDetail groupDetail) {
        return new PublicMeetingResponses.GroupDetail(
                groupDetail.id(),
                groupDetail.name(),
                toDistrict(groupDetail.district()),
                groupDetail.contactPhone(),
                toGroupMeetings(groupDetail.meetings()));
    }

    private static PublicMeetingResponses.MeetingSummary toMeetingSummary(PublicMeetingSummary meetingSummary) {
        return new PublicMeetingResponses.MeetingSummary(
                meetingSummary.id(),
                meetingSummary.groupId(),
                meetingSummary.groupName(),
                meetingSummary.province(),
                meetingSummary.dayOfWeek(),
                meetingSummary.startTime(),
                meetingSummary.type(),
                meetingSummary.locationName(),
                meetingSummary.locationAddress());
    }

    private static PublicMeetingResponses.District toDistrict(DistrictData districtData) {
        return new PublicMeetingResponses.District(districtData.id(), districtData.name());
    }

    private static List<PublicMeetingResponses.GroupMeeting> toGroupMeetings(List<GroupMeetingData> groupMeetings) {
        return groupMeetings.stream()
                .map(PublicMeetingResponseMapper::toGroupMeeting)
                .toList();
    }

    private static PublicMeetingResponses.GroupMeeting toGroupMeeting(GroupMeetingData groupMeeting) {
        return new PublicMeetingResponses.GroupMeeting(
                groupMeeting.id(),
                groupMeeting.province(),
                groupMeeting.dayOfWeek(),
                groupMeeting.startTime(),
                groupMeeting.type(),
                groupMeeting.locationName(),
                groupMeeting.locationAddress());
    }
}
