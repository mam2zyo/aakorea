package io.step5.aakorea.modules.service.district.api;

import io.step5.aakorea.modules.service.district.domain.District;
import java.util.List;

public record AdminDistrictListResponseDto(
        List<AdminDistrictDto> districts,
        long totalCount
) {
}

