package org.aakorea.core.common.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app.auth.admin")
public record OfficeAuthProperties(
        @NotBlank String email,
        @NotBlank String password
) {
}
