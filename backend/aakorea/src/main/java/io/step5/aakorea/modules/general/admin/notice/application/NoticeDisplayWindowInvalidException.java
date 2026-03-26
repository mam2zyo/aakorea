package io.step5.aakorea.modules.general.admin.notice.application;

public class NoticeDisplayWindowInvalidException extends RuntimeException {

    public NoticeDisplayWindowInvalidException() {
        super("공지 노출 종료 시각은 시작 시각보다 빠를 수 없습니다.");
    }
}
