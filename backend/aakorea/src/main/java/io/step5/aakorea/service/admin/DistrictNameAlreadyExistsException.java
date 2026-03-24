package io.step5.aakorea.service.admin;

public class DistrictNameAlreadyExistsException extends RuntimeException {

    public DistrictNameAlreadyExistsException(String name) {
        super("이미 사용 중인 지역연합 이름입니다: " + name);
    }
}
