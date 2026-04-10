package org.aakorea.main.attachment.api.admin;

import lombok.RequiredArgsConstructor;
import org.aakorea.main.attachment.application.AttachmentService;
import org.aakorea.main.attachment.domain.Attachment;
import org.aakorea.main.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/attachments")
@RequiredArgsConstructor
public class AdminAttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AttachmentData> upload(@RequestParam("file") MultipartFile file) {
        Attachment attachment = attachmentService.uploadAttachment(file);
        return ApiResponse.success(toAttachmentData(attachment));
    }

    private AttachmentData toAttachmentData(Attachment attachment) {
        return new AttachmentData(
                attachment.getId(),
                attachment.getOriginalName(),
                attachment.getFilePath(), // This is the URL
                attachment.getFileSize(),
                attachment.getContentType(),
                attachment.getCreatedAt()
        );
    }
}
