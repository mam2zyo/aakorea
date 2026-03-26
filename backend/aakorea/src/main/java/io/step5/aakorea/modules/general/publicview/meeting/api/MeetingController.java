package io.step5.aakorea.modules.general.publicview.meeting.api;

import io.step5.aakorea.modules.general.publicview.meeting.application.MeetingQueryService;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/basic/meetings")
public class MeetingController {

    private static final ZoneId KOREA_ZONE_ID = ZoneId.of("Asia/Seoul");

    private final MeetingQueryService meetingQueryService;

    /**
     * 공개용 모임 검색 API.
     *
     * GET /api/basic/meetings/search?province=SEOUL&dayOfWeek=MONDAY
     * dayOfWeek가 없으면 한국 시간 기준 오늘 요일을 사용한다.
     */
    @GetMapping("/search")
    public MeetingSearchResponseDto searchMeetings(
            @RequestParam(defaultValue = "SEOUL") Province province,
            @RequestParam(required = false) DayOfWeek dayOfWeek
    ) {
        DayOfWeek resolvedDayOfWeek = (dayOfWeek != null)
                ? dayOfWeek
                : LocalDate.now(KOREA_ZONE_ID).getDayOfWeek();

        return meetingQueryService.searchMeetings(province, resolvedDayOfWeek);
    }
}
