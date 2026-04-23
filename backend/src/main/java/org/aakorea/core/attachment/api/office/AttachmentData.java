package org.aakorea.core.attachment.api.office;

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
