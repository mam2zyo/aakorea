package org.aakorea.main.group.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.group.application.MeetingAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/meetings")
@RequiredArgsConstructor
public class MeetingAdminController {

    private final MeetingAdminService meetingAdminService;

    @GetMapping
    public ApiResponse<List<MeetingAdminService.MeetingData>> getMeetings(
            @RequestParam(required = false) Long groupId,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) Boolean active
    ) {
        return ApiResponse.success(meetingAdminService.getMeetings(groupId, province, active));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MeetingAdminService.MeetingData>> createMeeting(
            @Valid @RequestBody MeetingRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(meetingAdminService.createMeeting(
                request.groupId(),
                request.locationDetail(),
                request.locationAddress(),
                request.latitude(),
                request.longitude(),
                request.contactPhoneOverride(),
                request.dayOfWeek(),
                request.startTime(),
                request.type(),
                request.active())));
    }

    @PutMapping("/{id}")
    public ApiResponse<MeetingAdminService.MeetingData> updateMeeting(
            @PathVariable Long id,
            @Valid @RequestBody MeetingRequest request
    ) {
        return ApiResponse.success(meetingAdminService.updateMeeting(
                id,
                request.groupId(),
                request.locationDetail(),
                request.locationAddress(),
                request.latitude(),
                request.longitude(),
                request.contactPhoneOverride(),
                request.dayOfWeek(),
                request.startTime(),
                request.type(),
                request.active()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable Long id) {
        meetingAdminService.deleteMeeting(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/backfill-coordinates")
    public ApiResponse<MeetingAdminService.CoordinateBackfillResult> backfillMissingCoordinates(
            @RequestParam(defaultValue = "true") boolean dryRun
    ) {
        return ApiResponse.success(meetingAdminService.backfillMissingCoordinates(dryRun));
    }

    public record MeetingRequest(
            @NotNull(message = "groupId is required") Long groupId,
            @NotBlank(message = "locationDetail is required") String locationDetail,
            @NotBlank(message = "locationAddress is required") String locationAddress,
            Double latitude,
            Double longitude,
            String contactPhoneOverride,
            @NotBlank(message = "dayOfWeek is required") String dayOfWeek,
            @NotBlank(message = "startTime is required") String startTime,
            @NotBlank(message = "type is required") String type,
            @NotNull(message = "active is required") Boolean active
    ) {
    }
}
