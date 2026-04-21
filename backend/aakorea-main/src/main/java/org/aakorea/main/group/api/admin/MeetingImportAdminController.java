package org.aakorea.main.group.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.group.application.MeetingImportAdminService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/meeting-imports")
@RequiredArgsConstructor
public class MeetingImportAdminController {

    private final MeetingImportAdminService meetingImportAdminService;

    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @PostMapping("/apply-html")
    public ApiResponse<MeetingImportAdminService.ImportApplyResult> applyHtmlImport(
            @Valid @RequestBody MeetingImportHtmlRequest request
    ) {
        return ApiResponse.success(meetingImportAdminService.applyHtml(request.html()));
    }

    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @PostMapping("/reset")
    public ApiResponse<MeetingImportAdminService.ImportResetResult> resetImportData() {
        return ApiResponse.success(meetingImportAdminService.resetImportData());
    }

    public record MeetingImportHtmlRequest(
            @NotBlank(message = "html is required") String html
    ) {
    }
}
