package org.aakorea.main.auth.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.auth.application.AdminUserAdminService;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.domain.AdminUserStatus;
import org.aakorea.main.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/admin-users")
@RequiredArgsConstructor
public class AdminUserAdminController {

    private final AdminUserAdminService adminUserAdminService;

    @PreAuthorize("hasAnyAuthority('PERM_staff.manage', 'PERM_manager.manage')")
    @GetMapping
    public ApiResponse<AdminUserAdminService.AdminUserWorkspaceData> getAdminUsers() {
        return ApiResponse.success(adminUserAdminService.getWorkspace());
    }

    @PreAuthorize("hasAuthority('PERM_manager.manage')")
    @PostMapping
    public ResponseEntity<ApiResponse<AdminUserAdminService.AdminUserData>> createAdminUser(
            @Valid @RequestBody CreateAdminUserRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(adminUserAdminService.createAdminUser(new AdminUserAdminService.CreateAdminUserCommand(
                        request.email(),
                        request.displayName(),
                        request.role(),
                        request.password(),
                        request.grantedPermissions()))));
    }

    @PreAuthorize("hasAnyAuthority('PERM_staff.manage', 'PERM_manager.manage')")
    @PutMapping("/{id}")
    public ApiResponse<AdminUserAdminService.AdminUserData> updateAdminUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAdminUserRequest request
    ) {
        return ApiResponse.success(adminUserAdminService.updateAdminUser(
                id,
                new AdminUserAdminService.UpdateAdminUserCommand(
                        request.displayName(),
                        request.role(),
                        request.status(),
                        request.password(),
                        request.grantedPermissions())));
    }

    public record CreateAdminUserRequest(
            @NotBlank(message = "email is required") @Email(message = "email must be valid") String email,
            @NotBlank(message = "displayName is required") String displayName,
            @NotNull(message = "role is required") AdminRole role,
            @NotBlank(message = "password is required") String password,
            List<String> grantedPermissions
    ) {
    }

    public record UpdateAdminUserRequest(
            @NotBlank(message = "displayName is required") String displayName,
            @NotNull(message = "role is required") AdminRole role,
            @NotNull(message = "status is required") AdminUserStatus status,
            String password,
            List<String> grantedPermissions
    ) {
    }
}
