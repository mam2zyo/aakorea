package io.step5.aakorea.modules.service.gsr.api;

import io.step5.aakorea.modules.service.gsr.domain.GSR;
import java.util.List;

public record AdminGsrListResponseDto(
        List<AdminGsrDto> gsrs,
        long totalCount
) {
}

