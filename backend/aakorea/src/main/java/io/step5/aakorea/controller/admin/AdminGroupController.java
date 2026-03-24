package io.step5.aakorea.controller.admin;

import io.step5.aakorea.dto.admin.AdminGroupDto;
import io.step5.aakorea.dto.admin.AdminGroupListResponseDto;
import io.step5.aakorea.dto.admin.AdminGroupRequest;
import io.step5.aakorea.service.admin.AdminGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/groups")
public class AdminGroupController {

    private final AdminGroupService adminGroupService;

    @GetMapping
    public AdminGroupListResponseDto getGroups() {
        return adminGroupService.getGroups();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminGroupDto createGroup(@Valid @RequestBody AdminGroupRequest request) {
        return adminGroupService.createGroup(request);
    }

    @PutMapping("/{groupId}")
    public AdminGroupDto updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody AdminGroupRequest request
    ) {
        return adminGroupService.updateGroup(groupId, request);
    }

    @DeleteMapping("/{groupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGroup(@PathVariable Long groupId) {
        adminGroupService.deleteGroup(groupId);
    }
}
