package io.step5.aakorea.modules.service.district.application;

import io.step5.aakorea.modules.service.district.domain.District;

public class DistrictNameAlreadyExistsException extends RuntimeException {

    public DistrictNameAlreadyExistsException(String name) {
        super("??? ????餓λ쵐??筌왖??肉????已??낅빍?? " + name);
    }
}

