package io.step5.aakorea.modules.basic.meeting.api;

import io.step5.aakorea.modules.basic.group.api.MeetingPlaceDto;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.service.meeting.domain.MeetingStatus;
import io.step5.aakorea.modules.service.meeting.domain.MeetingType;
import io.step5.aakorea.modules.service.notice.domain.GroupNotice;
import java.time.DayOfWeek;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Getter;

/**
 * 筌뤴뫁??野꺜??野껉퀗??筌뤴뫖以??DTO.
 *
 * ????癒?뮉 "筌뤴뫁??????????筌???쇱젫 ?怨멸쉭??域밸챶竊??怨멸쉭 ??륁뵠筌왖嚥???猷???嚥?
 * 域밸챶竊???명??類ｋ궖?? ??쇱젫 ??뽯뻻 ?關?쇘몴???ｍ뜞 ????빳???
 */
@Getter
@Builder
public class MeetingListItemDto {

    private Long meetingId;
    private Long groupId;
    private String groupName;

    private DayOfWeek dayOfWeek;
    private LocalTime startTime;

    private MeetingType meetingType;
    private MeetingStatus status;

    /**
     * ??쇱젫 ??뽯뻻 ?關??
     * meeting.meetingPlace揶쎛 ??됱몵筌?域밸㈇苡???????랁?
     * ??곸몵筌?group.meetingPlace???????뺣뼄.
     */
    private MeetingPlaceDto meetingPlace;

    private MeetingNoticeSummaryDto highlightNotice;

    public static MeetingListItemDto from(Meeting meeting, GroupNotice highlightNotice) {
        MeetingPlace actualPlace = resolveActualPlace(meeting);

        return MeetingListItemDto.builder()
                .meetingId(meeting.getId())
                .groupId(meeting.getGroup().getId())
                .groupName(meeting.getGroup().getName())
                .dayOfWeek(meeting.getDayOfWeek())
                .startTime(meeting.getStartTime())
                .meetingType(meeting.getMeetingType())
                .status(meeting.getStatus())
                .meetingPlace(MeetingPlaceDto.from(actualPlace))
                .highlightNotice(MeetingNoticeSummaryDto.from(highlightNotice))
                .build();
    }

    private static MeetingPlace resolveActualPlace(Meeting meeting) {
        return meeting.getMeetingPlace() != null
                ? meeting.getMeetingPlace()
                : meeting.getGroup().getMeetingPlace();
    }
}
