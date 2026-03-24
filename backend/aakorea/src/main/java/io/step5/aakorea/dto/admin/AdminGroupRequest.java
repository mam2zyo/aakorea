package io.step5.aakorea.dto.admin;

import io.step5.aakorea.domain.Province;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record AdminGroupRequest(
        @NotBlank(message = "그룹 이름은 필수입니다.")
        @Size(max = 100, message = "그룹 이름은 100자 이하로 입력해주세요.")
        String name,

        LocalDate startDate,

        @NotNull(message = "행정구역(시/도)은 필수입니다.")
        Province province,

        Long districtId,

        Long gsrId,

        @Size(max = 255, message = "연락처 주소는 255자 이하로 입력해주세요.")
        String contactAddress,

        @Size(max = 255, message = "연락처 이메일은 255자 이하로 입력해주세요.")
        String contactEmail,

        @Size(max = 50, message = "연락처 전화번호는 50자 이하로 입력해주세요.")
        String contactPhone,

        @NotBlank(message = "기본 모임 장소 도로명주소는 필수입니다.")
        @Size(max = 255, message = "도로명주소는 255자 이하로 입력해주세요.")
        String meetingRoadAddress,

        @NotBlank(message = "기본 모임 장소 상세주소는 필수입니다.")
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
