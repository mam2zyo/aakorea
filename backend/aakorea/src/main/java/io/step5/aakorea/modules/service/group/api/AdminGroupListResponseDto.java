package io.step5.aakorea.modules.service.group.api;

import io.step5.aakorea.modules.service.group.domain.Group;
import java.util.List;

public record AdminGroupListResponseDto(
        List<AdminGroupDto> groups,
        long totalCount
) {
}

