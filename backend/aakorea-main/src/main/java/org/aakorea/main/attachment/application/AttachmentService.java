package org.aakorea.main.attachment.application;

import lombok.RequiredArgsConstructor;
import org.aakorea.main.attachment.domain.Attachment;
import org.aakorea.main.attachment.infrastructure.AttachmentRepository;
import org.aakorea.main.storage.application.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final StorageService storageService;

    @Transactional
    public Attachment uploadAttachment(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String url = storageService.store(file); // This returns /api/public/assets/...
        
        // We know store() uses UUID for saved name. 
        // Let's extract the saved name from URL for metadata.
        String savedName = url.substring(url.lastIndexOf('/') + 1);

        Attachment attachment = new Attachment(
                file.getOriginalFilename(),
                savedName,
                url, // Store the URL as filePath for easy access
                file.getSize(),
                file.getContentType()
        );

        return attachmentRepository.save(attachment);
    }
    
    public Attachment getAttachment(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
    }
}
