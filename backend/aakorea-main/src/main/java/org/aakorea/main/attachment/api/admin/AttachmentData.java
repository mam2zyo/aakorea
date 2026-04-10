package org.aakorea.main.attachment.api.admin;

import java.time.LocalDateTime;

public record AttachmentData(
        Long id,
        String originalName,
        String url,
        long fileSize,
        String contentType,
        LocalDateTime createdAt
) {
}
