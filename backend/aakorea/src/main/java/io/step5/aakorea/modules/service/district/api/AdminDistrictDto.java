package io.step5.aakorea.modules.service.district.api;

import io.step5.aakorea.modules.service.district.domain.District;
import io.step5.aakorea.modules.service.group.domain.Group;

public record AdminDistrictDto(
        Long id,
        String name,
        long groupCount
) {
}

