package io.step5.aakorea.modules.general.admin.gsr.application;

import io.step5.aakorea.modules.general.admin.gsr.domain.GSR;

public class AdminGsrNotFoundException extends RuntimeException {

    public AdminGsrNotFoundException(Long gsrId) {
        super("ID " + gsrId + " GSR??筌≪뼚??????곷뮸??덈뼄.");
    }
}

