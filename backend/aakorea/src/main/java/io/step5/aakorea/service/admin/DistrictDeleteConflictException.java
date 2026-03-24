package io.step5.aakorea.service.admin;

public class DistrictDeleteConflictException extends RuntimeException {

    public DistrictDeleteConflictException(String name, long groupCount) {
        super("'" + name + "' 지역연합에 소속된 그룹 " + groupCount + "개가 있어 삭제할 수 없습니다.");
    }
}
