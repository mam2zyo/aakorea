package io.step5.aakorea.modules.service.group.api;

import io.step5.aakorea.modules.service.district.domain.District;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.gsr.domain.GSR;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.LocalDate;

public record AdminGroupDto(
        Long id,
        String name,
        LocalDate startDate,
        String province,
        Long districtId,
        String districtName,
        Long gsrId,
        String gsrNickname,
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

