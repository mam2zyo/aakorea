package io.step5.aakorea.dto;

import io.step5.aakorea.domain.Province;
import lombok.Builder;
import lombok.Getter;

import java.time.DayOfWeek;
import java.util.List;

/**
 * 모임 검색 결과 응답 DTO.
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