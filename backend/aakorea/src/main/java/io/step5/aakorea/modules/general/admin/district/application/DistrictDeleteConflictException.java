package io.step5.aakorea.modules.general.admin.district.application;

import io.step5.aakorea.modules.general.admin.district.domain.District;
import io.step5.aakorea.modules.general.admin.group.domain.Group;

public class DistrictDeleteConflictException extends RuntimeException {

    public DistrictDeleteConflictException(String name, long groupCount) {
        super("'" + name + "' 筌왖??肉??밸퓠 ???꺗??域밸챶竊?" + groupCount + "揶쏆뮄? ??됰선 ?????????곷뮸??덈뼄.");
    }
}

