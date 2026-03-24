package io.step5.aakorea.dto.admin;

import java.time.LocalDate;

public record AdminGroupDto(
        Long id,
        String name,
        LocalDate startDate,
        String province,
        Long districtId,
        String districtName,
        String contactAddress,
        String contactEmail,
        String contactPhone,
        String meetingRoadAddress,
        String meetingDetailAddress,
        String meetingGuide,
        Double meetingLatitude,
        Double meetingLongitude,
        long meetingCount
) {
}
