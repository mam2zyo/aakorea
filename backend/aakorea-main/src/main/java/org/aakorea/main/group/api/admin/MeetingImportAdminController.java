package org.aakorea.main.group.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.group.application.MeetingImportAdminService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/meeting-imports")
@RequiredArgsConstructor
public class MeetingImportAdminController {

    private final MeetingImportAdminService meetingImportAdminService;

    @PostMapping("/normalize")
    public ApiResponse<MeetingImportAdminService.NormalizedMeetingImport> normalizeImport(
            @Valid @RequestBody MeetingImportHtmlRequest request
    ) {
        return ApiResponse.success(meetingImportAdminService.normalizeHtml(request.html()));
    }

    @PostMapping("/preview")
    public ApiResponse<MeetingImportAdminService.ImportPreview> previewImport(
            @RequestBody MeetingImportAdminService.NormalizedMeetingImport request
    ) {
        return ApiResponse.success(meetingImportAdminService.previewImport(request));
    }

    @PostMapping("/apply")
    public ApiResponse<MeetingImportAdminService.ImportApplyResult> applyImport(
            @RequestBody MeetingImportAdminService.NormalizedMeetingImport request
    ) {
        return ApiResponse.success(meetingImportAdminService.applyImport(request));
    }

    @PostMapping("/reset")
    public ApiResponse<MeetingImportAdminService.ImportResetResult> resetImportData() {
        return ApiResponse.success(meetingImportAdminService.resetImportData());
    }

    public record MeetingImportHtmlRequest(
            @NotBlank(message = "html is required") String html
    ) {
    }
}
