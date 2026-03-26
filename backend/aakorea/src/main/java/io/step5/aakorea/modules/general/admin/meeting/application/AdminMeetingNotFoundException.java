package io.step5.aakorea.modules.general.admin.meeting.application;

import io.step5.aakorea.modules.general.admin.meeting.domain.Meeting;

public class AdminMeetingNotFoundException extends RuntimeException {

    public AdminMeetingNotFoundException(Long meetingId) {
        super("ID " + meetingId + " 筌뤴뫁???筌≪뼚??????곷뮸??덈뼄.");
    }
}

