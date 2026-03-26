package io.step5.aakorea.modules.general.admin.notice.api;

import io.step5.aakorea.modules.general.admin.notice.domain.GroupNotice;
import io.step5.aakorea.modules.general.admin.notice.domain.NoticeType;
import java.time.LocalDateTime;

public record AdminNoticeDto(
        Long id,
        String title,
        String content,
        NoticeType type,
        boolean published,
        LocalDateTime displayStartAt,
        LocalDateTime displayEndAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean activeNow
) {

    public static AdminNoticeDto from(GroupNotice notice, LocalDateTime now) {
        boolean started = notice.getDisplayStartAt() == null || !notice.getDisplayStartAt().isAfter(now);
        boolean notEnded = notice.getDisplayEndAt() == null || !notice.getDisplayEndAt().isBefore(now);

        return new AdminNoticeDto(
                notice.getId(),
                notice.getTitle(),
                notice.getContent(),
                notice.getType(),
                notice.isPublished(),
                notice.getDisplayStartAt(),
                notice.getDisplayEndAt(),
                notice.getCreatedAt(),
                notice.getUpdatedAt(),
                notice.isPublished() && started && notEnded
        );
    }
}
