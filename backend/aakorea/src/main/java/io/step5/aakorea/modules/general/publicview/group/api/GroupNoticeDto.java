package io.step5.aakorea.modules.general.publicview.group.api;

import io.step5.aakorea.modules.general.admin.notice.domain.GroupNotice;
import io.step5.aakorea.modules.general.admin.notice.domain.NoticeType;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

/**
 * 域밸챶竊??怨멸쉭 ??륁뵠筌왖 ?⑤벊? DTO.
 */
@Getter
@Builder
public class GroupNoticeDto {

    private Long id;
    private String title;
    private String content;
    private NoticeType type;
    private LocalDateTime displayStartAt;
    private LocalDateTime displayEndAt;
    private LocalDateTime createdAt;

    public static GroupNoticeDto from(GroupNotice notice) {
        return GroupNoticeDto.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .type(notice.getType())
                .displayStartAt(notice.getDisplayStartAt())
                .displayEndAt(notice.getDisplayEndAt())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}
