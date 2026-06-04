package org.aakorea.core.attachment.infrastructure;

import org.aakorea.core.attachment.domain.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
}
