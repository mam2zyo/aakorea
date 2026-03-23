package io.step5.aakorea.dto;

import io.step5.aakorea.domain.GroupNotice;
import io.step5.aakorea.domain.NoticeType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 그룹 상세 페이지 공지 DTO.
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