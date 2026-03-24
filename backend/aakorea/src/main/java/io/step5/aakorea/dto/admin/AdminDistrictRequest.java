package io.step5.aakorea.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminDistrictRequest(
        @NotBlank(message = "지역연합 이름은 필수입니다.")
        @Size(max = 100, message = "지역연합 이름은 100자 이하로 입력해주세요.")
        String name
) {
}
