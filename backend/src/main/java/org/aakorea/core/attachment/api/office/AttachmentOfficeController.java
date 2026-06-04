package org.aakorea.core.attachment.api.office;

import lombok.RequiredArgsConstructor;
import org.aakorea.core.attachment.application.AttachmentService;
import org.aakorea.core.attachment.domain.Attachment;
import org.aakorea.core.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/office/attachments")
@RequiredArgsConstructor
public class AttachmentOfficeController {

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
