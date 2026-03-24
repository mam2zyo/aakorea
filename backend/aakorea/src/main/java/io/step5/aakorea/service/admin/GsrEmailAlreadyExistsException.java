package io.step5.aakorea.service.admin;

public class GsrEmailAlreadyExistsException extends RuntimeException {

    public GsrEmailAlreadyExistsException(String email) {
        super("이미 사용 중인 이메일입니다: " + email);
    }
}
