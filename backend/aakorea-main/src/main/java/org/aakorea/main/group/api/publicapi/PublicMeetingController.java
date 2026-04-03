package org.aakorea.main.group.api.publicapi;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.group.application.PublicMeetingQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String dayOfWeek
    ) {
        return ApiResponse.success(PublicMeetingResponseMapper.toMeetingSummaries(
                publicMeetingQueryService.getMeetings(province, dayOfWeek)));
    }

    @GetMapping("/{id}")
    public ApiResponse<PublicMeetingResponses.MeetingDetail> getMeeting(@PathVariable Long id) {
        return ApiResponse.success(PublicMeetingResponseMapper.toMeetingDetail(
                publicMeetingQueryService.getMeeting(id)));
    }
}
