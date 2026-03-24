package io.step5.aakorea.dto.admin;

import io.step5.aakorea.domain.MeetingStatus;
import io.step5.aakorea.domain.MeetingType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record AdminMeetingRequest(
        @NotNull(message = "모임 요일은 필수입니다.")
        DayOfWeek dayOfWeek,

        @NotNull(message = "모임 시작 시간은 필수입니다.")
        LocalTime startTime,

        @NotNull(message = "모임 유형은 필수입니다.")
        MeetingType meetingType,

        @NotNull(message = "모임 상태는 필수입니다.")
        MeetingStatus status,

        @Size(max = 255, message = "도로명주소는 255자 이하로 입력해주세요.")
        String meetingRoadAddress,

        @Size(max = 255, message = "상세주소는 255자 이하로 입력해주세요.")
        String meetingDetailAddress,

        @Size(max = 500, message = "장소 안내문은 500자 이하로 입력해주세요.")
        String meetingGuide,

        @DecimalMin(value = "-90.0", message = "위도는 -90 이상이어야 합니다.")
        @DecimalMax(value = "90.0", message = "위도는 90 이하여야 합니다.")
        Double meetingLatitude,

        @DecimalMin(value = "-180.0", message = "경도는 -180 이상이어야 합니다.")
        @DecimalMax(value = "180.0", message = "경도는 180 이하여야 합니다.")
        Double meetingLongitude
) {
}
