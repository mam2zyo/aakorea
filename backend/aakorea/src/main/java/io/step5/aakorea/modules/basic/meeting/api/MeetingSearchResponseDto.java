package io.step5.aakorea.modules.basic.meeting.api;

import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingType;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.DayOfWeek;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

/**
 * 筌뤴뫁??野꺜??野껉퀗???臾먮뼗 DTO.
 */
@Getter
@Builder
public class MeetingSearchResponseDto {

    private Province province;
    private DayOfWeek dayOfWeek;
    private MeetingType meetingType;
    private int count;
    private List<MeetingListItemDto> meetings;

    public static MeetingSearchResponseDto of(
            Province province,
            DayOfWeek dayOfWeek,
            MeetingType meetingType,
            List<MeetingListItemDto> meetings
    ) {
        return MeetingSearchResponseDto.builder()
                .province(province)
                .dayOfWeek(dayOfWeek)
                .meetingType(meetingType)
                .count(meetings.size())
                .meetings(meetings)
                .build();
    }
}
