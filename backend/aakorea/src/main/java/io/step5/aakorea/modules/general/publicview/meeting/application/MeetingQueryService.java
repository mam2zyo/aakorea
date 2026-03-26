package io.step5.aakorea.modules.general.publicview.meeting.application;

import io.step5.aakorea.modules.general.publicview.meeting.api.MeetingListItemDto;
import io.step5.aakorea.modules.general.publicview.meeting.api.MeetingSearchResponseDto;
import io.step5.aakorea.modules.general.admin.meeting.domain.Meeting;
import io.step5.aakorea.modules.general.admin.meeting.infrastructure.MeetingRepository;
import io.step5.aakorea.modules.general.admin.notice.domain.GroupNotice;
import io.step5.aakorea.modules.general.admin.notice.infrastructure.GroupNoticeRepository;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingQueryService {

    private final MeetingRepository meetingRepository;
    private final GroupNoticeRepository groupNoticeRepository;

    public MeetingSearchResponseDto searchMeetings(
            Province province,
            DayOfWeek dayOfWeek
    ) {
        List<Meeting> meetings = meetingRepository
                .findPublicSearchResults(province, dayOfWeek);

        Map<Long, GroupNotice> highlightNoticeByGroupId = findHighlightNoticeByGroupId(meetings);

        List<MeetingListItemDto> meetingDtos = meetings.stream()
                .map(meeting -> MeetingListItemDto.from(
                        meeting,
                        highlightNoticeByGroupId.get(meeting.getGroup().getId())
                ))
                .toList();

        return MeetingSearchResponseDto.of(province, dayOfWeek, meetingDtos);
    }

    private Map<Long, GroupNotice> findHighlightNoticeByGroupId(List<Meeting> meetings) {
        List<Long> groupIds = meetings.stream()
                .map(meeting -> meeting.getGroup().getId())
                .distinct()
                .toList();

        if (groupIds.isEmpty()) {
            return Map.of();
        }

        List<GroupNotice> notices = groupNoticeRepository.findActiveNoticesByGroupIds(
                groupIds,
                LocalDateTime.now()
        );

        Map<Long, GroupNotice> noticeByGroupId = new LinkedHashMap<>();
        for (GroupNotice notice : notices) {
            noticeByGroupId.putIfAbsent(notice.getGroup().getId(), notice);
        }

        return noticeByGroupId;
    }
}
