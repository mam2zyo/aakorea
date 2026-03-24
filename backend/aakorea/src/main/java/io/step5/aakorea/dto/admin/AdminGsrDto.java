package io.step5.aakorea.dto.admin;

public record AdminGsrDto(
        Long id,
        String nickname,
        String phone,
        String email,
        long groupCount
) {
}
