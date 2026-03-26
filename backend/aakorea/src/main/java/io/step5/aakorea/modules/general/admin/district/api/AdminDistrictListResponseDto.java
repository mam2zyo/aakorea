package io.step5.aakorea.modules.general.admin.district.api;

import io.step5.aakorea.modules.general.admin.district.domain.District;
import java.util.List;

public record AdminDistrictListResponseDto(
        List<AdminDistrictDto> districts,
        long totalCount
) {
}

