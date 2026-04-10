package org.aakorea.main.attachment.infrastructure;

import org.aakorea.main.attachment.domain.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
}
