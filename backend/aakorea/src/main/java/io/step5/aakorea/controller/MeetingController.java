package io.step5.aakorea.controller;

import io.step5.aakorea.domain.Province;
import io.step5.aakorea.dto.MeetingSearchResponseDto;
import io.step5.aakorea.service.MeetingQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/meetings")
public class MeetingController {

    private static final ZoneId KOREA_ZONE_ID = ZoneId.of("Asia/Seoul");

    private final MeetingQueryService meetingQueryService;

    /**
     * 모임 검색.
     * 예:
     * GET /api/meetings/search?province=SEOUL&dayOfWeek=MONDAY
     * dayOfWeek를 생략하면 한국 시간 기준 오늘 요일을 기본값으로 사용한다.
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