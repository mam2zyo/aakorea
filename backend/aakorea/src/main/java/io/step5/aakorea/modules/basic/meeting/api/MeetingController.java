package io.step5.aakorea.modules.basic.meeting.api;

import io.step5.aakorea.modules.basic.meeting.application.MeetingQueryService;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
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
@RequestMapping("/api/meetings")
public class MeetingController {

    private static final ZoneId KOREA_ZONE_ID = ZoneId.of("Asia/Seoul");

    private final MeetingQueryService meetingQueryService;

    /**
     * 筌뤴뫁??野꺜??
     * ??
     * GET /api/meetings/search?province=SEOUL&dayOfWeek=MONDAY
     * dayOfWeek????몄셽??롢늺 ??볥럢 ??볦퍢 疫꿸퀣? ??삳뮎 ?遺우뵬??疫꿸퀡??첎誘れ몵嚥??????뺣뼄.
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
