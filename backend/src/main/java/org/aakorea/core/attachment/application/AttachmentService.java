package org.aakorea.core.attachment.application;

import lombok.RequiredArgsConstructor;
import org.aakorea.core.attachment.domain.Attachment;
import org.aakorea.core.attachment.infrastructure.AttachmentRepository;
import org.aakorea.core.storage.application.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final StorageService storageService;

    /**
     * 파일을 업로드하고 메타데이터를 DB에 저장합니다.
     * filePath 필드에는 실제 물리 경로가 아닌, 클라이언트에서 접근 가능한 URL(/api/public/assets/...)이 저장됩니다.
     */
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
