package io.step5.aakorea.modules.basic.meeting.application;

import io.step5.aakorea.modules.basic.meeting.api.MeetingListItemDto;
import io.step5.aakorea.modules.basic.meeting.api.MeetingSearchResponseDto;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.infrastructure.MeetingRepository;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.DayOfWeek;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
