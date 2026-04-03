package org.aakorea.main.group.api.publicapi;

import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.group.application.PublicMeetingQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/groups")
@RequiredArgsConstructor
public class PublicGroupController {

    private final PublicMeetingQueryService publicMeetingQueryService;

    @GetMapping("/{id}")
    public ApiResponse<PublicMeetingResponses.GroupDetail> getGroup(@PathVariable Long id) {
        return ApiResponse.success(PublicMeetingResponseMapper.toGroupDetail(
                publicMeetingQueryService.getGroup(id)));
    }
}
