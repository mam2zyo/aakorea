package io.step5.aakorea.modules.general.admin.meeting.api;

import io.step5.aakorea.modules.general.admin.meeting.domain.Meeting;
import io.step5.aakorea.modules.general.admin.meeting.domain.MeetingStatus;
import io.step5.aakorea.modules.general.admin.meeting.domain.MeetingType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.DayOfWeek;
import java.time.LocalTime;

public record AdminMeetingRequest(
        @NotNull(message = "筌뤴뫁???遺우뵬?? ?袁⑸땾??낅빍??")
        DayOfWeek dayOfWeek,

        @NotNull(message = "筌뤴뫁????뽰삂 ??볦퍢?? ?袁⑸땾??낅빍??")
        LocalTime startTime,

        @NotNull(message = "筌뤴뫁???醫륁굨?? ?袁⑸땾??낅빍??")
        MeetingType meetingType,

        @NotNull(message = "筌뤴뫁???怨밴묶???袁⑸땾??낅빍??")
        MeetingStatus status,

        @Size(max = 255, message = "?袁⑥쨮筌뤿굞竊???뮉 255????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String meetingRoadAddress,

        @Size(max = 255, message = "?怨멸쉭雅뚯눘???255????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String meetingDetailAddress,

        @Size(max = 500, message = "?關????덇땀?얜챷? 500????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String meetingGuide,

        @DecimalMin(value = "-90.0", message = "?袁⑤즲??-90 ??곴맒??곷선????몃빍??")
        @DecimalMax(value = "90.0", message = "?袁⑤즲??90 ??꾨릭??鍮???몃빍??")
        Double meetingLatitude,

        @DecimalMin(value = "-180.0", message = "野껋럥猷??-180 ??곴맒??곷선????몃빍??")
        @DecimalMax(value = "180.0", message = "野껋럥猷??180 ??꾨릭??鍮???몃빍??")
        Double meetingLongitude
) {
}

