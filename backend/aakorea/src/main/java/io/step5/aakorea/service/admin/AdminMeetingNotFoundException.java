package io.step5.aakorea.service.admin;

public class AdminMeetingNotFoundException extends RuntimeException {

    public AdminMeetingNotFoundException(Long meetingId) {
        super("ID " + meetingId + " 모임을 찾을 수 없습니다.");
    }
}
