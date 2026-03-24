package io.step5.aakorea.dto.admin;

public record AdminGsrDto(
        Long id,
        String nickname,
        String phone,
        String mailingAddress,
        String email,
        long groupCount
) {
}
