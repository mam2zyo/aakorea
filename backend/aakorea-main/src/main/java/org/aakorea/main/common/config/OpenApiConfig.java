package org.aakorea.main.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI aakoreaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AAKorea API Specification")
                        .description("AAKorea Main 서비스의 백엔드 API 명세서입니다.")
                        .version("v0.0.1")
                        .contact(new Contact()
                                .name("AAKorea Admin")
                                .email("admin@aakorea.org")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .name("bearerAuth")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
