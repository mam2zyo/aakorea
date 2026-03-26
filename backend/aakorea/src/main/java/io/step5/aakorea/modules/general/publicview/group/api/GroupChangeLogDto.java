package io.step5.aakorea.modules.general.publicview.group.api;

import io.step5.aakorea.modules.general.admin.group.domain.Group;
import io.step5.aakorea.modules.general.admin.group.domain.GroupChangeLog;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

/**
 * 域밸챶竊??怨멸쉭 ??륁뵠筌왖 筌ㅼ뮄??癰궰野껋럩沅??DTO.
 */
@Getter
@Builder
public class GroupChangeLogDto {

    private Long id;
    private String summary;
    private String detail;
    private String changedBy;
    private LocalDateTime createdAt;

    public static GroupChangeLogDto from(GroupChangeLog log) {
        return GroupChangeLogDto.builder()
                .id(log.getId())
                .summary(log.getSummary())
                .detail(log.getDetail())
                .changedBy(log.getChangedBy())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
