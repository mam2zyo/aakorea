package io.step5.aakorea.modules.service.group.application;

import io.step5.aakorea.modules.basic.group.application.GroupNotFoundException;
import io.step5.aakorea.modules.service.group.domain.Group;

public class AdminGroupNotFoundException extends RuntimeException {

    public AdminGroupNotFoundException(Long groupId) {
        super("ID " + groupId + " 域밸챶竊??筌≪뼚??????곷뮸??덈뼄.");
    }
}

