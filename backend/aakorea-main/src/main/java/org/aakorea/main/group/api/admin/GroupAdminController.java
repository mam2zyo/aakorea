package org.aakorea.main.group.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.group.application.GroupAdminService;
import org.aakorea.main.group.application.GroupCompositeRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasAuthority('PERM_group.manage')")
    @GetMapping("/groups")
    public ApiResponse<List<GroupAdminService.GroupData>> getGroups(
            @RequestParam(required = false) Long districtId
    ) {
        return ApiResponse.success(groupAdminService.getGroups(districtId));
    }

    @PreAuthorize("hasAuthority('PERM_group.manage')")
    @PostMapping("/groups")
    public ResponseEntity<ApiResponse<GroupAdminService.GroupData>> createGroup(
            @Valid @RequestBody GroupRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                groupAdminService.createGroup(
                        request.districtId(),
                        request.name(),
                        request.notice())));
    }

    @PreAuthorize("hasAuthority('PERM_group.manage')")
    @PostMapping("/groups/bulk")
    public ResponseEntity<ApiResponse<Long>> createGroupBulk(
            @Valid @RequestBody GroupCompositeRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                groupAdminService.createGroupComposite(request)));
    }

    @PreAuthorize("hasAuthority('PERM_group.manage')")
    @PutMapping("/groups/{id}")
    public ApiResponse<GroupAdminService.GroupData> updateGroup(
            @PathVariable Long id,
            @Valid @RequestBody GroupRequest request
    ) {
        return ApiResponse.success(groupAdminService.updateGroup(
                id,
                request.districtId(),
                request.name(),
                request.notice()));
    }

    @PreAuthorize("hasAuthority('PERM_group.manage')")
    @DeleteMapping("/groups/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupAdminService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('PERM_group.manage')")
    @GetMapping("/group-contacts")
    public ApiResponse<List<GroupAdminService.GroupContactData>> getGroupContacts(
            @RequestParam(required = false) Long groupId
    ) {
        return ApiResponse.success(groupAdminService.getGroupContacts(groupId));
    }

    @PreAuthorize("hasAuthority('PERM_group.manage')")
    @PostMapping("/group-contacts")
    public ResponseEntity<ApiResponse<GroupAdminService.GroupContactData>> createGroupContact(
            @Valid @RequestBody CreateGroupContactRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                groupAdminService.createGroupContact(
                        request.groupId(),
                        request.phone(),
                        request.email(),
                        toPostalContactInput(request.postalContact()))));
    }

    @PreAuthorize("hasAuthority('PERM_group.manage')")
    @PutMapping("/group-contacts/{id}")
    public ApiResponse<GroupAdminService.GroupContactData> updateGroupContact(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGroupContactRequest request
    ) {
        return ApiResponse.success(groupAdminService.updateGroupContact(
                id,
                request.phone(),
                request.email(),
                toPostalContactInput(request.postalContact())));
    }

    private GroupAdminService.PostalContactInput toPostalContactInput(PostalContactRequest postalContact) {
        if (postalContact == null) {
            return null;
        }

        return new GroupAdminService.PostalContactInput(
                postalContact.recipient(),
                postalContact.postalCode(),
                postalContact.roadAddress(),
                postalContact.detailAddress());
    }

    public record GroupRequest(
            @NotNull(message = "districtId is required") Long districtId,
            @NotBlank(message = "name is required") String name,
            String notice
    ) {
    }

    public record CreateGroupContactRequest(
            @NotNull(message = "groupId is required") Long groupId,
            @NotBlank(message = "phone is required") String phone,
            String email,
            PostalContactRequest postalContact
    ) {
    }

    public record UpdateGroupContactRequest(
            @NotBlank(message = "phone is required") String phone,
            String email,
            PostalContactRequest postalContact
    ) {
    }

    public record PostalContactRequest(
            String recipient,
            String postalCode,
            String roadAddress,
            String detailAddress
    ) {
    }
}
