package io.step5.aakorea.service.admin;

public class DistrictNotFoundException extends RuntimeException {

    public DistrictNotFoundException(Long districtId) {
        super("지역연합을 찾을 수 없습니다. id=" + districtId);
    }
}
