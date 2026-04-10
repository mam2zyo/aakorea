package org.aakorea.main.attachment.api.publicly;

import lombok.RequiredArgsConstructor;
import org.aakorea.main.attachment.application.AttachmentService;
import org.aakorea.main.attachment.domain.Attachment;
import org.aakorea.main.storage.application.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.net.MalformedURLException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/public/attachments")
@RequiredArgsConstructor
public class PublicAttachmentController {

    private final AttachmentService attachmentService;
    private final StorageService storageService;

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Attachment attachment = attachmentService.getAttachment(id);
        
        // Extract filename from the URL/path stored in attachment
        String url = attachment.getFilePath(); // e.g. /api/public/assets/uuid.pdf
        String savedName = url.substring(url.lastIndexOf('/') + 1);
        
        Path file = storageService.load(savedName);
        try {
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                String originalName = attachment.getOriginalName();
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originalName + "\"")
                        .body(resource);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not read file: " + savedName);
            }
        } catch (MalformedURLException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error: " + e.getMessage());
        }
    }
}
