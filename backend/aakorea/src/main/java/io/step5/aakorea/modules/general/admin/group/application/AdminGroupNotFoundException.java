package io.step5.aakorea.modules.general.admin.group.application;

import io.step5.aakorea.modules.general.publicview.group.application.GroupNotFoundException;
import io.step5.aakorea.modules.general.admin.group.domain.Group;

public class AdminGroupNotFoundException extends RuntimeException {

    public AdminGroupNotFoundException(Long groupId) {
        super("ID " + groupId + " 域밸챶竊??筌≪뼚??????곷뮸??덈뼄.");
    }
}

