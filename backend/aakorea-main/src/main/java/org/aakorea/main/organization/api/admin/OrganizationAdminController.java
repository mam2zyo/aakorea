package org.aakorea.main.organization.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.organization.application.OrganizationAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
public class OrganizationAdminController {

    private final OrganizationAdminService organizationAdminService;

    @GetMapping("/districts")
    public ApiResponse<List<OrganizationAdminService.DistrictData>> getDistricts() {
        return ApiResponse.success(organizationAdminService.getDistricts());
    }

    @PostMapping("/districts")
    public ResponseEntity<ApiResponse<OrganizationAdminService.DistrictData>> createDistrict(
            @Valid @RequestBody DistrictRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                organizationAdminService.createDistrict(request.name(), request.active())));
    }

    @PutMapping("/districts/{id}")
    public ApiResponse<OrganizationAdminService.DistrictData> updateDistrict(
            @PathVariable Long id,
            @Valid @RequestBody DistrictRequest request
    ) {
        return ApiResponse.success(organizationAdminService.updateDistrict(id, request.name(), request.active()));
    }

    @GetMapping("/groups")
    public ApiResponse<List<OrganizationAdminService.GroupData>> getGroups(
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) Boolean active
    ) {
        return ApiResponse.success(organizationAdminService.getGroups(districtId, active));
    }

    @PostMapping("/groups")
    public ResponseEntity<ApiResponse<OrganizationAdminService.GroupData>> createGroup(
            @Valid @RequestBody GroupRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                organizationAdminService.createGroup(request.districtId(), request.name(), request.active())));
    }

    @PutMapping("/groups/{id}")
    public ApiResponse<OrganizationAdminService.GroupData> updateGroup(
            @PathVariable Long id,
            @Valid @RequestBody GroupRequest request
    ) {
        return ApiResponse.success(organizationAdminService.updateGroup(
                id,
                request.districtId(),
                request.name(),
                request.active()));
    }

    @GetMapping("/group-contacts")
    public ApiResponse<List<OrganizationAdminService.GroupContactData>> getGroupContacts(
            @RequestParam(required = false) Long groupId,
            @RequestParam(required = false) Boolean active
    ) {
        return ApiResponse.success(organizationAdminService.getGroupContacts(groupId, active));
    }

    @PostMapping("/group-contacts")
    public ResponseEntity<ApiResponse<OrganizationAdminService.GroupContactData>> createGroupContact(
            @Valid @RequestBody CreateGroupContactRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                organizationAdminService.createGroupContact(request.groupId(), request.phone(), request.active())));
    }

    @PutMapping("/group-contacts/{id}")
    public ApiResponse<OrganizationAdminService.GroupContactData> updateGroupContact(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGroupContactRequest request
    ) {
        return ApiResponse.success(organizationAdminService.updateGroupContact(
                id,
                request.phone(),
                request.active()));
    }

    public record DistrictRequest(
            @NotBlank(message = "name is required") String name,
            @NotNull(message = "active is required") Boolean active
    ) {
    }

    public record GroupRequest(
            @NotNull(message = "districtId is required") Long districtId,
            @NotBlank(message = "name is required") String name,
            @NotNull(message = "active is required") Boolean active
    ) {
    }

    public record CreateGroupContactRequest(
            @NotNull(message = "groupId is required") Long groupId,
            @NotBlank(message = "phone is required") String phone,
            @NotNull(message = "active is required") Boolean active
    ) {
    }

    public record UpdateGroupContactRequest(
            @NotBlank(message = "phone is required") String phone,
            @NotNull(message = "active is required") Boolean active
    ) {
    }
}
