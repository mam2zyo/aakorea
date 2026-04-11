package org.aakorea.main.content.application;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileSystemContentService {

    private final ResourceLoader resourceLoader;
    private static final String CONTENTS_PATH = "classpath:contents/";
    
    @Value("${app.content.physical-root}")
    private String physicalRoot;

    /**
     * 콘텐츠 파일을 업로드하고 물리적 경로에 저장합니다.
     * 메타데이터는 DB에서 관리하므로 순수 내용만 저장합니다.
     */
    public void uploadContentFile(String key, MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        String filename = key + ".html";
        try {
            byte[] bytes = file.getBytes();
            Path targetPath = Paths.get(physicalRoot, filename);
            Files.createDirectories(targetPath.getParent());
            Files.write(targetPath, bytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            log.info("Successfully uploaded content: {}", targetPath.toAbsolutePath());
        } catch (IOException e) {
            log.error("Failed to upload content file: {}", filename, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save file: " + e.getMessage());
        }
    }

    /**
     * 물리적 경로에서 콘텐츠 파일 내용을 읽어옵니다.
     */
    public String getContentPage(String key) {
        String filename = key + ".html";
        
        // Priority 1: Read from physical path
        Path physicalPath = Paths.get(physicalRoot, filename);
        if (Files.exists(physicalPath)) {
            try {
                return Files.readString(physicalPath, StandardCharsets.UTF_8);
            } catch (IOException e) {
                log.error("Failed to read physical content file: {}", physicalPath, e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read content");
            }
        }

        // Priority 2: Fallback to classpath
        Resource resource = resourceLoader.getResource(CONTENTS_PATH + filename);
        if (!resource.exists()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Content page not found: " + key);
        }
        try {
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("Failed to read classpath content file: {}", filename, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read content");
        }
    }

    /**
     * 물리적 경로의 콘텐츠 파일을 삭제합니다.
     */
    public void deleteContentFile(String key) {
        String filename = key + ".html";
        try {
            Path targetPath = Paths.get(physicalRoot, filename);
            boolean deleted = Files.deleteIfExists(targetPath);
            if (deleted) {
                log.info("Successfully deleted physical content file: {}", targetPath.toAbsolutePath());
            } else {
                log.warn("Attempted to delete file but it was not found: {}", targetPath.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to delete content file: {}", filename, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete file: " + e.getMessage());
        }
    }
}
