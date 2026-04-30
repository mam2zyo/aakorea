package org.aakorea.core.global.config;

import org.aakorea.core.storage.infrastructure.StorageProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableConfigurationProperties(StorageProperties.class)
public class WebMvcConfig implements WebMvcConfigurer {

    private final StorageProperties storageProperties;

    public WebMvcConfig(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String location = storageProperties.getLocation();
        if (!location.endsWith("/")) {
            location += "/";
        }
        
        // Use "file:" prefix directly, which is more reliable than toUri().toString() 
        // across different environments including Termux.
        String uploadPath = location.startsWith("/") ? "file:" + location : "file:./" + location;

        registry.addResourceHandler("/api/public/assets/**")
                .addResourceLocations(uploadPath);
    }
}
