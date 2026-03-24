package io.step5.aakorea.dto.admin;

import java.util.List;

public record AdminDistrictListResponseDto(
        List<AdminDistrictDto> districts,
        long totalCount
) {
}
