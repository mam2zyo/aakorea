package io.step5.aakorea.dto.admin;

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
