package org.aakorea.main.group.application;

import java.util.List;

public record GroupCompositeRequest(
        String name,
        Long districtId,
        String notice,
        GroupContactRequest contact,
        List<MeetingCompositeRequest> meetings
) {
    public record GroupContactRequest(
            String phone,
            String email,
            GroupAdminService.PostalContactInput postalContact
    ) {
    }

    public record MeetingCompositeRequest(
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
