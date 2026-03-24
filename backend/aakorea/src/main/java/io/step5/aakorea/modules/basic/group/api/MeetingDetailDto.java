package io.step5.aakorea.modules.basic.group.api;

import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.service.meeting.domain.MeetingStatus;
import io.step5.aakorea.modules.service.meeting.domain.MeetingType;
import java.time.DayOfWeek;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Getter;

/**
 * 域밸챶竊??怨멸쉭 ?遺얇늺 ??됰퓠??癰귣똻肉т빳??類?┛ 筌뤴뫁??DTO.
 */
@Getter
@Builder
public class MeetingDetailDto {

    private Long meetingId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private MeetingType meetingType;
    private MeetingStatus status;

    /**
     * true筌???筌뤴뫁??? 域밸챶竊?疫꿸퀡???關?쇔첎? ?袁⑤빒 揶쏆뮆???關?쇘몴??????뺣뼄.
     */
    private boolean placeOverridden;

    /**
     * ????癒?퓠野???쇱젫嚥???덇땀???關??
     */
    private MeetingPlaceDto meetingPlace;

    public static MeetingDetailDto from(Meeting meeting) {
        boolean overridden = meeting.getMeetingPlace() != null;
        MeetingPlace actualPlace = overridden
                ? meeting.getMeetingPlace()
                : meeting.getGroup().getMeetingPlace();

        return MeetingDetailDto.builder()
                .meetingId(meeting.getId())
                .dayOfWeek(meeting.getDayOfWeek())
                .startTime(meeting.getStartTime())
                .meetingType(meeting.getMeetingType())
                .status(meeting.getStatus())
                .placeOverridden(overridden)
                .meetingPlace(MeetingPlaceDto.from(actualPlace))
                .build();
    }
}
