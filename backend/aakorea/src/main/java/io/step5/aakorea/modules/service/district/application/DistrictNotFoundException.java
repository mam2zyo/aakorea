package io.step5.aakorea.modules.service.district.application;

import io.step5.aakorea.modules.service.district.domain.District;

public class DistrictNotFoundException extends RuntimeException {

    public DistrictNotFoundException(Long districtId) {
        super("筌왖??肉??뱀뱽 筌≪뼚??????곷뮸??덈뼄. id=" + districtId);
    }
}

