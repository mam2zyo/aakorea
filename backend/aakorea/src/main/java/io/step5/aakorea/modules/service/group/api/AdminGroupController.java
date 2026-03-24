package io.step5.aakorea.modules.service.group.api;

import io.step5.aakorea.modules.basic.group.api.GroupController;
import io.step5.aakorea.modules.service.group.application.AdminGroupService;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.meeting.api.AdminMeetingDto;
import io.step5.aakorea.modules.service.meeting.api.AdminMeetingRequest;
import io.step5.aakorea.modules.service.meeting.application.AdminMeetingService;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/groups")
public class AdminGroupController {

    private final AdminGroupService adminGroupService;
    private final AdminMeetingService adminMeetingService;

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


    @GetMapping("/{groupId}/meetings")
    public java.util.List<AdminMeetingDto> getMeetings(@PathVariable Long groupId) {
        return adminMeetingService.getMeetings(groupId);
    }

    @PostMapping("/{groupId}/meetings")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminMeetingDto createMeeting(
            @PathVariable Long groupId,
            @Valid @RequestBody AdminMeetingRequest request
    ) {
        return adminMeetingService.createMeeting(groupId, request);
    }

    @PutMapping("/{groupId}/meetings/{meetingId}")
    public AdminMeetingDto updateMeeting(
            @PathVariable Long groupId,
            @PathVariable Long meetingId,
            @Valid @RequestBody AdminMeetingRequest request
    ) {
        return adminMeetingService.updateMeeting(groupId, meetingId, request);
    }

    @DeleteMapping("/{groupId}/meetings/{meetingId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMeeting(
            @PathVariable Long groupId,
            @PathVariable Long meetingId
    ) {
        adminMeetingService.deleteMeeting(groupId, meetingId);
    }

    @DeleteMapping("/{groupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGroup(@PathVariable Long groupId) {
        adminGroupService.deleteGroup(groupId);
    }
}

