package io.step5.aakorea.modules.service.notice.api;

import io.step5.aakorea.modules.service.notice.domain.NoticeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record AdminNoticeRequest(
        @NotBlank(message = "공지 제목을 입력해주세요.")
        @Size(max = 100, message = "공지 제목은 100자 이하여야 합니다.")
        String title,

        @NotBlank(message = "공지 내용을 입력해주세요.")
        @Size(max = 5000, message = "공지 내용은 5000자 이하여야 합니다.")
        String content,

        @NotNull(message = "공지 유형을 선택해주세요.")
        NoticeType type,

        boolean published,

        LocalDateTime displayStartAt,
        LocalDateTime displayEndAt
) {
}
