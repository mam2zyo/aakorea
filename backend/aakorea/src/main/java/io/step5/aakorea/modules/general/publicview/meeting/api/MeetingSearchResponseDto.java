package io.step5.aakorea.modules.general.publicview.meeting.api;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.DayOfWeek;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

/**
 * 공개용 모임 검색 결과 DTO.
 */
@Getter
@Builder
public class MeetingSearchResponseDto {

    private Province province;
    private DayOfWeek dayOfWeek;
    private int count;
    private List<MeetingListItemDto> meetings;

    public static MeetingSearchResponseDto of(
            Province province,
            DayOfWeek dayOfWeek,
            List<MeetingListItemDto> meetings
    ) {
        return MeetingSearchResponseDto.builder()
                .province(province)
                .dayOfWeek(dayOfWeek)
                .count(meetings.size())
                .meetings(meetings)
                .build();
    }
}
