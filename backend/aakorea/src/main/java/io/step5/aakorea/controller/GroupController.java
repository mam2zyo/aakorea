package io.step5.aakorea.controller;

import io.step5.aakorea.dto.GroupDetailDto;
import io.step5.aakorea.service.GroupQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupQueryService groupQueryService;

    /**
     * 그룹 상세 조회.
     *
     * 예:
     * GET /api/groups/1
     */
    @GetMapping("/{groupId}")
    public GroupDetailDto getGroupDetail(@PathVariable Long groupId) {
        return groupQueryService.getGroupDetail(groupId);
    }
}