package io.step5.aakorea.modules.general.admin.district.api;

import io.step5.aakorea.modules.general.admin.district.domain.District;
import io.step5.aakorea.modules.general.admin.group.domain.Group;

public record AdminDistrictDto(
        Long id,
        String name,
        long groupCount
) {
}

