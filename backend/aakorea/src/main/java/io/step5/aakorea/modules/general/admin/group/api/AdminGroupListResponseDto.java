package io.step5.aakorea.modules.general.admin.group.api;

import io.step5.aakorea.modules.general.admin.group.domain.Group;
import java.util.List;

public record AdminGroupListResponseDto(
        List<AdminGroupDto> groups,
        long totalCount
) {
}

