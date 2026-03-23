package io.step5.aakorea.service;

import io.step5.aakorea.domain.Meeting;
import io.step5.aakorea.domain.Province;
import io.step5.aakorea.dto.MeetingListItemDto;
import io.step5.aakorea.dto.MeetingSearchResponseDto;
import io.step5.aakorea.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingQueryService {

    private final MeetingRepository meetingRepository;

    public MeetingSearchResponseDto searchMeetings(Province province, DayOfWeek dayOfWeek) {
        List<Meeting> meetings = meetingRepository
                .findByGroup_ProvinceAndDayOfWeekOrderByStartTimeAsc(province, dayOfWeek);

        List<MeetingListItemDto> meetingDtos = meetings.stream()
                .map(MeetingListItemDto::from)
                .toList();

        return MeetingSearchResponseDto.of(province, dayOfWeek, meetingDtos);
    }
}