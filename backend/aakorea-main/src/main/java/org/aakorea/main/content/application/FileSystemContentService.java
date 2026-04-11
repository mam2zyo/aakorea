package org.aakorea.main.content.application;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
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

    private static final Pattern TITLE_PATTERN = Pattern.compile("<!--\\s*title:\\s*(.*?)\\s*-->");
    private static final Pattern PUBLISHED_PATTERN = Pattern.compile("<!--\\s*published:\\s*(.*?)\\s*-->");

    public void uploadContentFile(String key, String title, boolean published, MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        String filename = key + ".html";
        try {
            // Read content and prepend metadata comments
            String originalContent = StreamUtils.copyToString(file.getInputStream(), StandardCharsets.UTF_8);
            // Remove existing metadata if any (prevent duplication on re-upload)
            String strippedContent = originalContent
                    .replaceAll("<!--\\s*title:.*?-->", "")
                    .replaceAll("<!--\\s*key:.*?-->", "")
                    .replaceAll("<!--\\s*published:.*?-->", "")
                    .trim();

            String metadata = String.format("<!-- title: %s --><!-- key: %s --><!-- published: %s -->\n", 
                    title.trim(), key.trim(), published);
            String finalContent = metadata + strippedContent;

            Path targetPath = Paths.get(physicalRoot, filename);
            Files.createDirectories(targetPath.getParent());
            Files.writeString(targetPath, finalContent, StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            log.info("Successfully uploaded content: {}", targetPath.toAbsolutePath());
        } catch (IOException e) {
            log.error("Failed to upload content file: {}", filename, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save file: " + e.getMessage());
        }
    }

    public void updateContentMetadata(String key, String newTitle, boolean newPublished) {
        String filename = key + ".html";
        try {
            Path targetPath = Paths.get(physicalRoot, filename);
            if (!Files.exists(targetPath)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Content file not found for metadata update: " + key);
            }

            String content = Files.readString(targetPath, StandardCharsets.UTF_8);
            
            // Replace or insert metadata
            String updatedContent = content;
            if (TITLE_PATTERN.matcher(updatedContent).find()) {
                updatedContent = TITLE_PATTERN.matcher(updatedContent).replaceFirst("<!-- title: " + newTitle.trim() + " -->");
            } else {
                updatedContent = "<!-- title: " + newTitle.trim() + " -->\n" + updatedContent;
            }

            if (PUBLISHED_PATTERN.matcher(updatedContent).find()) {
                updatedContent = PUBLISHED_PATTERN.matcher(updatedContent).replaceFirst("<!-- published: " + newPublished + " -->");
            } else {
                updatedContent = "<!-- published: " + newPublished + " -->\n" + updatedContent;
            }

            Files.writeString(targetPath, updatedContent, StandardCharsets.UTF_8, StandardOpenOption.TRUNCATE_EXISTING);
            log.info("Successfully updated metadata for: {}", key);
        } catch (IOException e) {
            log.error("Failed to update metadata for: {}", key, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update metadata");
        }
    }

    public void publishContentPage(String key) {
        updateContentMetadata(key, null, true); // Partial update placeholder (if title not null)
    }

    // Overload for publishContentPage to just toggle status if title known or read
    public void setPublishStatus(String key, boolean published) {
        try {
            Path targetPath = Paths.get(physicalRoot, key + ".html");
            String content = Files.readString(targetPath, StandardCharsets.UTF_8);
            String title = extractMetadata(content, TITLE_PATTERN, key);
            updateContentMetadata(key, title, published);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read file for status change");
        }
    }

    public void deleteContentFile(String key) {
        String filename = key + ".html";
        try {
            Path targetPath = Paths.get(physicalRoot, filename);
            boolean deleted = Files.deleteIfExists(targetPath);
            if (deleted) {
                log.info("Successfully deleted physical content file: {}", targetPath.toAbsolutePath());
            } else {
                log.warn("Attempted to delete file but it was not found in physical path: {}", targetPath.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to delete content file: {}", filename, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete file: " + e.getMessage());
        }
    }

    public PublicContentQueryService.PublicContentPageData getContentPage(String key) {
        String filename = key + ".html";
        String content;
        
        // Priority 1: Read from physical path (Real-time reflection)
        Path physicalPath = Paths.get(physicalRoot, filename);
        if (Files.exists(physicalPath)) {
            try {
                content = Files.readString(physicalPath, StandardCharsets.UTF_8);
            } catch (IOException e) {
                log.error("Failed to read physical content file: {}", physicalPath, e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read content");
            }
        } else {
            // Priority 2: Fallback to classpath
            Resource resource = resourceLoader.getResource(CONTENTS_PATH + filename);
            if (!resource.exists()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Content page not found: " + key);
            }
            try {
                content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            } catch (IOException e) {
                log.error("Failed to read classpath content file: {}", filename, e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read content");
            }
        }

        String title = extractMetadata(content, TITLE_PATTERN, key);
        boolean published = "true".equalsIgnoreCase(extractMetadata(content, PUBLISHED_PATTERN, "false"));

        // If called from Public API, enforce published check
        if (!published) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Content is not published yet: " + key);
        }

        return new PublicContentQueryService.PublicContentPageData(
                null, 
                key,
                title,
                content,
                List.of()
        );
    }

    public List<ContentPageSummary> getAllContentPages() {
        try {
            // Only scan physical root for testing from scratch
            Path root = Paths.get(physicalRoot);
            if (Files.exists(root)) {
                try (var stream = Files.list(root)) {
                    List<ContentPageSummary> summaries = stream
                            .filter(path -> path.toString().endsWith(".html"))
                            .map(this::pathToSummary)
                            .filter(Optional::isPresent)
                            .map(Optional::get)
                            .collect(Collectors.toList());
                    log.info("Found {} content pages in physical root", summaries.size());
                    return summaries;
                }
            }
            log.info("Physical root is empty or does not exist. Returning empty list.");
            return List.of();
        } catch (IOException e) {
            log.error("Failed to list content files", e);
            return List.of();
        }
    }

    private Optional<ContentPageSummary> pathToSummary(Path path) {
        try {
            String filename = path.getFileName().toString();
            String key = filename.replace(".html", "");
            String content = Files.readString(path, StandardCharsets.UTF_8);
            String title = extractMetadata(content, TITLE_PATTERN, key);
            boolean published = "true".equalsIgnoreCase(extractMetadata(content, PUBLISHED_PATTERN, "false"));

            return Optional.of(new ContentPageSummary(null, key, title, published));
        } catch (IOException e) {
            return Optional.empty();
        }
    }

    private String extractMetadata(String content, Pattern pattern, String defaultValue) {
        Matcher matcher = pattern.matcher(content);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return defaultValue;
    }

    public record ContentPageSummary(Long id, String key, String title, boolean published) {
    }
}
