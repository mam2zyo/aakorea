package io.step5.aakorea.modules.general.admin.gsr.api;

import io.step5.aakorea.modules.general.admin.gsr.domain.GSR;
import java.util.List;

public record AdminGsrListResponseDto(
        List<AdminGsrDto> gsrs,
        long totalCount
) {
}

