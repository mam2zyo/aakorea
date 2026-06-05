package org.aakorea.core.group.api.publicapi;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.core.common.response.ApiResponse;
import org.aakorea.core.group.application.PublicMeetingQueryService;
import org.aakorea.core.group.domain.MeetingType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/meetings")
@RequiredArgsConstructor
public class PublicMeetingController {

    private final PublicMeetingQueryService publicMeetingQueryService;

    @GetMapping
    public ApiResponse<List<PublicMeetingResponses.MeetingSummary>> getMeetings(
            @RequestParam(required = false) List<String> province,
            @RequestParam(required = false) String dayOfWeek,
            @RequestParam(required = false) MeetingType type,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude
    ) {
        return ApiResponse.success(PublicMeetingResponseMapper.toMeetingSummaries(
                publicMeetingQueryService.getMeetings(province, dayOfWeek, type, districtId, keyword, latitude, longitude)));
    }

}
