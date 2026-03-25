package io.step5.aakorea.modules.service.notice.api;

import io.step5.aakorea.modules.service.notice.application.AdminNoticeService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/groups/{groupId}/notices")
public class AdminNoticeController {

    private final AdminNoticeService adminNoticeService;

    @GetMapping
    public List<AdminNoticeDto> getNotices(@PathVariable Long groupId) {
        return adminNoticeService.getNotices(groupId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminNoticeDto createNotice(
            @PathVariable Long groupId,
            @Valid @RequestBody AdminNoticeRequest request
    ) {
        return adminNoticeService.createNotice(groupId, request);
    }

    @PutMapping("/{noticeId}")
    public AdminNoticeDto updateNotice(
            @PathVariable Long groupId,
            @PathVariable Long noticeId,
            @Valid @RequestBody AdminNoticeRequest request
    ) {
        return adminNoticeService.updateNotice(groupId, noticeId, request);
    }

    @DeleteMapping("/{noticeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNotice(
            @PathVariable Long groupId,
            @PathVariable Long noticeId
    ) {
        adminNoticeService.deleteNotice(groupId, noticeId);
    }
}
