package io.step5.aakorea.modules.service.meeting.application;

import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;

public class MeetingPlaceValidationException extends RuntimeException {

    public MeetingPlaceValidationException(String message) {
        super(message);
    }
}

