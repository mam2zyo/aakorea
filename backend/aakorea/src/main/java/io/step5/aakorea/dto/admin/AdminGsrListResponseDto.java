package io.step5.aakorea.dto.admin;

import java.util.List;

public record AdminGsrListResponseDto(
        List<AdminGsrDto> gsrs,
        long totalCount
) {
}
