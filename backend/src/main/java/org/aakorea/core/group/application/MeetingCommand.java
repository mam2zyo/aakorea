package org.aakorea.core.group.application;

import java.time.DayOfWeek;
import java.time.LocalTime;
import org.aakorea.core.group.domain.MeetingType;

public record MeetingCommand(
        Long groupId,
        String locationDetail,
        String locationAddress,
        Double latitude,
        Double longitude,
        String contactPhoneOverride,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        MeetingType type,
        boolean active
) {
    public static MeetingCommand from(
            Long groupId,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude,
            String contactPhoneOverride,
            String dayOfWeek,
            String startTime,
            String type,
            boolean active
    ) {
        return new MeetingCommand(
                groupId,
                locationDetail,
                locationAddress,
                latitude,
                longitude,
                contactPhoneOverride,
                MeetingFieldSupport.requireDayOfWeek(dayOfWeek),
                MeetingFieldSupport.requireStartTime(startTime),
                MeetingFieldSupport.requireMeetingType(type),
                active
        );
    }
}
