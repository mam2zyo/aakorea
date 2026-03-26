package io.step5.aakorea.modules.general.publicview.group.api;

import io.step5.aakorea.modules.general.publicview.group.application.GroupQueryService;
import io.step5.aakorea.modules.general.admin.group.domain.Group;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/basic/groups")
public class GroupController {

    private final GroupQueryService groupQueryService;

    /**
     * ?잙갭梨띄쳥???⑤㈇???브퀗???
     *
     * ??
     * GET /api/basic/groups/1
     */
    @GetMapping("/{groupId}")
    public GroupDetailDto getGroupDetail(@PathVariable Long groupId) {
        return groupQueryService.getGroupDetail(groupId);
    }
}
