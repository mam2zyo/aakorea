package io.step5.aakorea.service.admin;

public class AdminGroupNotFoundException extends RuntimeException {

    public AdminGroupNotFoundException(Long groupId) {
        super("ID " + groupId + " 그룹을 찾을 수 없습니다.");
    }
}
