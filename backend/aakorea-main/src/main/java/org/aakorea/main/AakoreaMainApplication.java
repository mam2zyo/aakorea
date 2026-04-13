package org.aakorea.main;

import org.aakorea.main.storage.infrastructure.StorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(StorageProperties.class)
public class AakoreaMainApplication {

    public static void main(String[] args) {
        SpringApplication.run(AakoreaMainApplication.class, args);
    }
}
