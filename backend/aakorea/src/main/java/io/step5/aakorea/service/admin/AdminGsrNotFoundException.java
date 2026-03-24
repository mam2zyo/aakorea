package io.step5.aakorea.service.admin;

public class AdminGsrNotFoundException extends RuntimeException {

    public AdminGsrNotFoundException(Long gsrId) {
        super("ID " + gsrId + " GSR을 찾을 수 없습니다.");
    }
}
