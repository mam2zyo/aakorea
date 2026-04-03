package org.aakorea.main.group.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.group.application.GroupAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class GroupAdminController {

    private final GroupAdminService groupAdminService;

    @GetMapping("/groups")
    public ApiResponse<List<GroupAdminService.GroupData>> getGroups(
            @RequestParam(required = false) Long districtId
    ) {
        return ApiResponse.success(groupAdminService.getGroups(districtId));
    }

    @PostMapping("/groups")
    public ResponseEntity<ApiResponse<GroupAdminService.GroupData>> createGroup(
            @Valid @RequestBody GroupRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                groupAdminService.createGroup(
                        request.districtId(),
                        request.name())));
    }

    @PutMapping("/groups/{id}")
    public ApiResponse<GroupAdminService.GroupData> updateGroup(
            @PathVariable Long id,
            @Valid @RequestBody GroupRequest request
    ) {
        return ApiResponse.success(groupAdminService.updateGroup(
                id,
                request.districtId(),
                request.name()));
    }

    @DeleteMapping("/groups/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupAdminService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/group-contacts")
    public ApiResponse<List<GroupAdminService.GroupContactData>> getGroupContacts(
            @RequestParam(required = false) Long groupId
    ) {
        return ApiResponse.success(groupAdminService.getGroupContacts(groupId));
    }

    @PostMapping("/group-contacts")
    public ResponseEntity<ApiResponse<GroupAdminService.GroupContactData>> createGroupContact(
            @Valid @RequestBody CreateGroupContactRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                groupAdminService.createGroupContact(request.groupId(), request.phone())));
    }

    @PutMapping("/group-contacts/{id}")
    public ApiResponse<GroupAdminService.GroupContactData> updateGroupContact(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGroupContactRequest request
    ) {
        return ApiResponse.success(groupAdminService.updateGroupContact(id, request.phone()));
    }

    public record GroupRequest(
            @NotNull(message = "districtId is required") Long districtId,
            @NotBlank(message = "name is required") String name
    ) {
    }

    public record CreateGroupContactRequest(
            @NotNull(message = "groupId is required") Long groupId,
            @NotBlank(message = "phone is required") String phone
    ) {
    }

    public record UpdateGroupContactRequest(
            @NotBlank(message = "phone is required") String phone
    ) {
    }
}
