package org.aakorea.main.attachment.infrastructure;

import org.aakorea.main.attachment.domain.ContentAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContentAttachmentRepository extends JpaRepository<ContentAttachment, Long> {
    List<ContentAttachment> findAllByContentPage_IdOrderByOrderIndexAsc(Long contentPageId);
    void deleteAllByContentPage_Id(Long contentPageId);
}
