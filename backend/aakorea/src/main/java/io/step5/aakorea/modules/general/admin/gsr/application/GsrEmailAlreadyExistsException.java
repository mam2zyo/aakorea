package io.step5.aakorea.modules.general.admin.gsr.application;

import io.step5.aakorea.modules.general.admin.gsr.domain.GSR;

public class GsrEmailAlreadyExistsException extends RuntimeException {

    public GsrEmailAlreadyExistsException(String email) {
        super("??? ????餓λ쵐????李??깆뿯??덈뼄: " + email);
    }
}

