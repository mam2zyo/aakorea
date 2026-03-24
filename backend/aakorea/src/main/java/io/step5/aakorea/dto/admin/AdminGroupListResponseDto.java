package io.step5.aakorea.dto.admin;

import java.util.List;

public record AdminGroupListResponseDto(
        List<AdminGroupDto> groups,
        long totalCount
) {
}
