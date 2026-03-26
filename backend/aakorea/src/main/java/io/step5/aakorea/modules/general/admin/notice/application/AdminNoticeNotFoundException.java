package io.step5.aakorea.modules.general.admin.notice.application;

public class AdminNoticeNotFoundException extends RuntimeException {

    public AdminNoticeNotFoundException(Long noticeId) {
        super("공지 정보를 찾을 수 없습니다. noticeId=" + noticeId);
    }
}
