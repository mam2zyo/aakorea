package org.aakorea.main.content.application;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.content.domain.ContentPage;
import org.aakorea.main.content.domain.Notice;
import org.aakorea.main.content.infrastructure.ContentPageRepository;
import org.aakorea.main.content.infrastructure.NoticeRepository;
import org.aakorea.main.attachment.domain.Attachment;
import org.aakorea.main.attachment.infrastructure.ContentAttachmentRepository;
import org.aakorea.main.attachment.infrastructure.NoticeAttachmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicContentQueryService {

    private final ContentPageRepository contentPageRepository;
    private final NoticeRepository noticeRepository;
    private final NoticeAttachmentRepository noticeAttachmentRepository;
    private final ContentAttachmentRepository contentAttachmentRepository;

    public PublicContentPageData getContentPage(String key) {
        ContentPage contentPage = contentPageRepository.findByKeyAndPublishedTrue(normalizeKey(key))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "content page not found"));

        return toContentPageData(contentPage);
    }

    private PublicContentPageData toContentPageData(ContentPage contentPage) {
        List<AttachmentSummary> attachments = contentAttachmentRepository.findAllByContentPage_IdOrderByOrderIndexAsc(contentPage.getId())
                .stream()
                .map(ca -> toAttachmentSummary(ca.getAttachment()))
                .toList();

        return new PublicContentPageData(
                contentPage.getId(),
                contentPage.getKey(),
                contentPage.getTitle(),
                contentPage.getBodyHtml(),
                attachments);
    }

    public List<PublicNoticeSummary> getNotices() {
        return noticeRepository.findAllByPublishedTrueOrderByPublishedAtDescIdDesc().stream()
                .map(notice -> new PublicNoticeSummary(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getPublishedAt()))
                .toList();
    }

    public PublicNoticeData getNotice(Long id) {
        Notice notice = noticeRepository.findByIdAndPublishedTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "notice not found"));

        return toNoticeData(notice);
    }

    private PublicNoticeData toNoticeData(Notice notice) {
        List<AttachmentSummary> attachments = noticeAttachmentRepository.findAllByNotice_IdOrderByOrderIndexAsc(notice.getId())
                .stream()
                .map(na -> toAttachmentSummary(na.getAttachment()))
                .toList();

        return new PublicNoticeData(
                notice.getId(),
                notice.getTitle(),
                notice.getBodyHtml(),
                notice.getPublishedAt(),
                attachments);
    }

    private String normalizeKey(String key) {
        if (key == null || key.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "key is required");
        }

        return key.trim();
    }

    private AttachmentSummary toAttachmentSummary(Attachment attachment) {
        return new AttachmentSummary(
                attachment.getId(),
                attachment.getOriginalName(),
                attachment.getFilePath(),
                attachment.getFileSize());
    }

    public record PublicContentPageData(Long id, String key, String title, String bodyHtml, List<AttachmentSummary> attachments) {
    }

    public record PublicNoticeSummary(Long id, String title, LocalDateTime publishedAt) {
    }

    public record PublicNoticeData(Long id, String title, String bodyHtml, LocalDateTime publishedAt, List<AttachmentSummary> attachments) {
    }

    public record AttachmentSummary(Long id, String originalName, String url, long fileSize) {
    }
}
