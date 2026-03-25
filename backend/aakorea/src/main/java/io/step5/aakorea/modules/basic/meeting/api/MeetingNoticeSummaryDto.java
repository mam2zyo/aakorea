package io.step5.aakorea.modules.basic.meeting.api;

import io.step5.aakorea.modules.service.notice.domain.GroupNotice;
import io.step5.aakorea.modules.service.notice.domain.NoticeType;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MeetingNoticeSummaryDto {

    private Long id;
    private String title;
    private String content;
    private NoticeType type;
    private LocalDateTime displayStartAt;
    private LocalDateTime displayEndAt;

    public static MeetingNoticeSummaryDto from(GroupNotice notice) {
        if (notice == null) {
            return null;
        }

        return MeetingNoticeSummaryDto.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .type(notice.getType())
                .displayStartAt(notice.getDisplayStartAt())
                .displayEndAt(notice.getDisplayEndAt())
                .build();
    }
}
