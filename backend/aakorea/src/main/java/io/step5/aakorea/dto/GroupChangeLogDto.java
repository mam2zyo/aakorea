package io.step5.aakorea.dto;

import io.step5.aakorea.domain.GroupChangeLog;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 그룹 상세 페이지 최근 변경사항 DTO.
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