package org.aakorea.main.meeting.api.publicapi;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.meeting.application.PublicMeetingQueryService;
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
    public ApiResponse<List<PublicMeetingQueryService.PublicMeetingSummary>> getMeetings(
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String dayOfWeek
    ) {
        return ApiResponse.success(publicMeetingQueryService.getMeetings(province, dayOfWeek));
    }

    @GetMapping("/{id}")
    public ApiResponse<PublicMeetingQueryService.PublicMeetingDetail> getMeeting(@PathVariable Long id) {
        return ApiResponse.success(publicMeetingQueryService.getMeeting(id));
    }
}
