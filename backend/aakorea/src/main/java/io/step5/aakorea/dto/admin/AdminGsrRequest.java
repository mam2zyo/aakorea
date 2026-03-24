package io.step5.aakorea.dto.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminGsrRequest(
        @NotBlank(message = "GSR 닉네임은 필수입니다.")
        @Size(max = 100, message = "GSR 닉네임은 100자 이하로 입력해주세요.")
        String nickname,

        @Size(max = 50, message = "전화번호는 50자 이하로 입력해주세요.")
        String phone,

        @Size(max = 255, message = "우편 수신 주소는 255자 이하로 입력해주세요.")
        String mailingAddress,

        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @Size(max = 255, message = "이메일은 255자 이하로 입력해주세요.")
        String email
) {
}
