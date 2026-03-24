package io.step5.aakorea.modules.service.gsr.api;

import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.gsr.domain.GSR;

public record AdminGsrDto(
        Long id,
        String nickname,
        String phone,
        String mailingAddress,
        String email,
        long groupCount
) {
}

