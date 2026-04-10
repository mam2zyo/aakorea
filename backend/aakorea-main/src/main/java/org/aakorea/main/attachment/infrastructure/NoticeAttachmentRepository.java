package org.aakorea.main.attachment.infrastructure;

import org.aakorea.main.attachment.domain.NoticeAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoticeAttachmentRepository extends JpaRepository<NoticeAttachment, Long> {
    List<NoticeAttachment> findAllByNotice_IdOrderByOrderIndexAsc(Long noticeId);
    void deleteAllByNotice_Id(Long noticeId);
}
