package io.step5.aakorea.modules.basic.group.api;

import io.step5.aakorea.modules.basic.group.application.GroupQueryService;
import io.step5.aakorea.modules.service.group.domain.Group;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupQueryService groupQueryService;

    /**
     * ?잙갭梨띄쳥???⑤㈇???브퀗???
     *
     * ??
     * GET /api/groups/1
     */
    @GetMapping("/{groupId}")
    public GroupDetailDto getGroupDetail(@PathVariable Long groupId) {
        return groupQueryService.getGroupDetail(groupId);
    }
}
