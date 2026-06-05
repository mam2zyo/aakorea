package org.aakorea.auth.api.office;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.auth.application.UserOfficeService;
import org.aakorea.auth.domain.Role;
import org.aakorea.auth.domain.UserStatus;
import org.aakorea.core.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/office/admin-users")
@RequiredArgsConstructor
public class UserOfficeController {

    private final UserOfficeService userOfficeService;

    @PreAuthorize("hasAnyAuthority('PERM_staff.manage', 'PERM_manager.manage')")
    @GetMapping
    public ApiResponse<UserOfficeService.UserWorkspaceData> getUsers() {
        return ApiResponse.success(userOfficeService.getWorkspace());
    }

    @PreAuthorize("hasAuthority('PERM_manager.manage')")
    @PostMapping
    public ResponseEntity<ApiResponse<UserOfficeService.UserData>> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(userOfficeService.createUser(new UserOfficeService.CreateUserCommand(
                        request.email(),
                        request.displayName(),
                        request.role(),
                        request.password(),
                        request.grantedPermissions()))));
    }

    @PreAuthorize("hasAnyAuthority('PERM_staff.manage', 'PERM_manager.manage')")
    @PutMapping("/{id}")
    public ApiResponse<UserOfficeService.UserData> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ApiResponse.success(userOfficeService.updateUser(
                id,
                new UserOfficeService.UpdateUserCommand(
                        request.displayName(),
                        request.role(),
                        request.status(),
                        request.password(),
                        request.grantedPermissions())));
    }

    @PreAuthorize("hasAuthority('PERM_manager.manage')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userOfficeService.deleteUser(id);
        return ApiResponse.success(null);
    }

    public record CreateUserRequest(
            @NotBlank(message = "email is required") @Email(message = "email must be valid") String email,
            @NotBlank(message = "displayName is required") String displayName,
            @NotNull(message = "role is required") Role role,
            @NotBlank(message = "password is required") String password,
            List<String> grantedPermissions
    ) {
    }

    public record UpdateUserRequest(
            @NotBlank(message = "displayName is required") String displayName,
            @NotNull(message = "role is required") Role role,
            @NotNull(message = "status is required") UserStatus status,
            String password,
            List<String> grantedPermissions
    ) {
    }
}
