package io.step5.aakorea.modules.general.admin.gsr.api;

import io.step5.aakorea.modules.general.admin.group.domain.Group;
import io.step5.aakorea.modules.general.admin.gsr.domain.GSR;

public record AdminGsrDto(
        Long id,
        String nickname,
        String phone,
        String mailingAddress,
        String email,
        long groupCount
) {
}

