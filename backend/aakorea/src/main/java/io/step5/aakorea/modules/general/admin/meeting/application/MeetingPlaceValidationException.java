package io.step5.aakorea.modules.general.admin.meeting.application;

import io.step5.aakorea.modules.general.admin.meeting.domain.Meeting;
import io.step5.aakorea.modules.general.admin.meeting.domain.MeetingPlace;

public class MeetingPlaceValidationException extends RuntimeException {

    public MeetingPlaceValidationException(String message) {
        super(message);
    }
}

