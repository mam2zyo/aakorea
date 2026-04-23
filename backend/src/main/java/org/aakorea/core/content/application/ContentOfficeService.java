package org.aakorea.core.content.application;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.core.common.error.FieldValidationException;
import org.aakorea.core.content.domain.ContentPage;
import org.aakorea.core.content.domain.Notice;
import org.aakorea.core.content.infrastructure.ContentPageRepository;
import org.aakorea.core.content.infrastructure.NoticeRepository;
import org.aakorea.core.attachment.domain.Attachment;
import org.aakorea.core.attachment.domain.ContentAttachment;
import org.aakorea.core.attachment.domain.NoticeAttachment;
import org.aakorea.core.attachment.infrastructure.AttachmentRepository;
import org.aakorea.core.attachment.infrastructure.ContentAttachmentRepository;
import org.aakorea.core.attachment.infrastructure.NoticeAttachmentRepository;
import org.aakorea.core.common.audit.ChangeLogService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentOfficeService {

    private final ContentPageRepository contentPageRepository;
    private final NoticeRepository noticeRepository;
    private final AttachmentRepository attachmentRepository;
    private final NoticeAttachmentRepository noticeAttachmentRepository;
    private final ContentAttachmentRepository contentAttachmentRepository;
    private final FileSystemContentService fileSystemContentService;
    private final ChangeLogService changeLogService;

    public List<ContentPageSummaryData> getContentPages() {
        return contentPageRepository.findAllByOrderByIdAsc().stream()
                .map(this::toContentPageSummaryData)
                .toList();
    }

    public ContentPageData getContentPage(Long id) {
        return toContentPageData(getContentPageEntity(id));
    }

    @Transactional
    public ContentPageData createContentPage(String key, String title, boolean published, MultipartFile file, List<Long> attachmentIds) {
        String normalizedKey = normalizeKey(key);
        ensureUniqueContentPageKey(normalizedKey, null);

        String originalFileName = file != null ? file.getOriginalFilename() : null;
        ContentPage contentPage = contentPageRepository.save(new ContentPage(
                normalizedKey,
                normalizeText(title, "title"),
                published,
                originalFileName));

        if (file != null) {
            fileSystemContentService.uploadContentFile(normalizedKey, file);
        }

        syncContentAttachments(contentPage, attachmentIds);

        changeLogService.logCreate(contentPage, contentPage.getId());

        return toContentPageData(contentPage);
    }

    @Transactional
    public ContentPageData updateContentPage(Long id, String key, String title, boolean published, MultipartFile file, List<Long> attachmentIds) {
        ContentPage contentPage = getContentPageEntity(id);
        
        // Snapshot old state
        ContentPage oldState = new ContentPage(
            contentPage.getKey(),
            contentPage.getTitle(),
            contentPage.isPublished(),
            contentPage.getOriginalFileName()
        );

        String normalizedKey = normalizeKey(key);
        ensureUniqueContentPageKey(normalizedKey, id);

        String originalFileName = file != null ? file.getOriginalFilename() : null;
        contentPage.update(
                normalizedKey,
                normalizeText(title, "title"),
                published,
                originalFileName);

        if (file != null) {
            fileSystemContentService.uploadContentFile(normalizedKey, file);
        }

        syncContentAttachments(contentPage, attachmentIds);

        changeLogService.logUpdate(oldState, contentPage, id);

        return toContentPageData(contentPage);
    }



    public List<NoticeSummaryData> getNotices() {
        return noticeRepository.findAllByOrderByPublishedAtDescIdDesc().stream()
                .map(this::toNoticeSummaryData)
                .toList();
    }

    public NoticeData getNotice(Long id) {
        return toNoticeData(getNoticeEntity(id));
    }

    @Transactional
    public NoticeData createNotice(String title, String bodyHtml, String bodyJson, boolean published, LocalDateTime publishedAt, List<Long> attachmentIds) {
        Notice notice = noticeRepository.save(new Notice(
                normalizeText(title, "title"),
                normalizeText(bodyHtml, "bodyHtml"),
                normalizeText(bodyJson, "bodyJson"),
                published,
                normalizePublishedAt(published, publishedAt)));

        syncNoticeAttachments(notice, attachmentIds);

        changeLogService.logCreate(notice, notice.getId());

        return toNoticeData(notice);
    }

    @Transactional
    public NoticeData updateNotice(Long id, String title, String bodyHtml, String bodyJson, boolean published, LocalDateTime publishedAt, List<Long> attachmentIds) {
        Notice notice = getNoticeEntity(id);
        
        // Snapshot old state
        Notice oldState = new Notice(
            notice.getTitle(),
            notice.getBodyHtml(),
            notice.getBodyJson(),
            notice.isPublished(),
            notice.getPublishedAt()
        );

        notice.update(
                normalizeText(title, "title"),
                normalizeText(bodyHtml, "bodyHtml"),
                normalizeText(bodyJson, "bodyJson"),
                published,
                normalizePublishedAt(published, publishedAt));

        syncNoticeAttachments(notice, attachmentIds);

        changeLogService.logUpdate(oldState, notice, id);

        return toNoticeData(notice);
    }

    @Transactional
    public void deleteNotice(Long id) {
        Notice notice = getNoticeEntity(id);
        noticeAttachmentRepository.deleteAllByNotice_Id(id);
        noticeRepository.delete(notice);
        changeLogService.logDelete(Notice.class, id, notice.getTitle());
    }

    @Transactional
    public void deleteContentPage(Long id) {
        ContentPage contentPage = getContentPageEntity(id);
        fileSystemContentService.deleteContentFile(contentPage.getKey());
        contentAttachmentRepository.deleteAllByContentPage_Id(id);
        contentPageRepository.delete(contentPage);
        changeLogService.logDelete(ContentPage.class, id, contentPage.getTitle());
    }

    private void syncNoticeAttachments(Notice notice, List<Long> attachmentIds) {
        noticeAttachmentRepository.deleteAllByNotice_Id(notice.getId());
        if (attachmentIds != null) {
            for (int i = 0; i < attachmentIds.size(); i++) {
                if (attachmentIds != null && attachmentIds.get(i) != null) {
                    Attachment attachment = attachmentRepository.findById(attachmentIds.get(i))
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "attachment not found"));
                    noticeAttachmentRepository.save(new NoticeAttachment(notice, attachment, i));
                }
            }
        }
    }

    private void syncContentAttachments(ContentPage contentPage, List<Long> attachmentIds) {
        contentAttachmentRepository.deleteAllByContentPage_Id(contentPage.getId());
        if (attachmentIds != null) {
            for (int i = 0; i < attachmentIds.size(); i++) {
                if (attachmentIds != null && attachmentIds.get(i) != null) {
                    Attachment attachment = attachmentRepository.findById(attachmentIds.get(i))
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "attachment not found"));
                    contentAttachmentRepository.save(new ContentAttachment(contentPage, attachment, i));
                }
            }
        }
    }

    private ContentPage getContentPageEntity(Long id) {
        return contentPageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "content page not found"));
    }

    private Notice getNoticeEntity(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "notice not found"));
    }

    private void ensureUniqueContentPageKey(String key, Long currentId) {
        boolean exists = currentId == null
                ? contentPageRepository.existsByKey(key)
                : contentPageRepository.existsByKeyAndIdNot(key, currentId);

        if (exists) {
            throw FieldValidationException.conflict("key", "content page key already exists");
        }
    }

    private String normalizeKey(String key) {
        return normalizeText(key, "key");
    }

    private String normalizeText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw FieldValidationException.badRequest(fieldName, fieldName + " is required");
        }

        return value.trim();
    }

    private LocalDateTime normalizePublishedAt(boolean published, LocalDateTime publishedAt) {
        if (published && publishedAt == null) {
            throw FieldValidationException.badRequest("publishedAt", "publishedAt is required when published");
        }

        if (publishedAt == null) {
            return null;
        }

        return publishedAt.truncatedTo(ChronoUnit.SECONDS);
    }

    private ContentPageSummaryData toContentPageSummaryData(ContentPage contentPage) {
        return new ContentPageSummaryData(
                contentPage.getId(),
                contentPage.getKey(),
                contentPage.getTitle(),
                contentPage.isPublished(),
                contentPage.getOriginalFileName());
    }

    private ContentPageData toContentPageData(ContentPage contentPage) {
        List<AttachmentSummaryData> attachments = contentAttachmentRepository.findAllByContentPage_IdOrderByOrderIndexAsc(contentPage.getId())
                .stream()
                .map(ca -> toAttachmentSummaryData(ca.getAttachment()))
                .toList();

        return new ContentPageData(
                contentPage.getId(),
                contentPage.getKey(),
                contentPage.getTitle(),
                contentPage.isPublished(),
                contentPage.getOriginalFileName(),
                attachments);
    }

    private NoticeSummaryData toNoticeSummaryData(Notice notice) {
        return new NoticeSummaryData(
                notice.getId(),
                notice.getTitle(),
                notice.isPublished(),
                notice.getPublishedAt());
    }

    private NoticeData toNoticeData(Notice notice) {
        List<AttachmentSummaryData> attachments = noticeAttachmentRepository.findAllByNotice_IdOrderByOrderIndexAsc(notice.getId())
                .stream()
                .map(na -> toAttachmentSummaryData(na.getAttachment()))
                .toList();

        return new NoticeData(
                notice.getId(),
                notice.getTitle(),
                notice.getBodyHtml(),
                notice.getBodyJson(),
                notice.isPublished(),
                notice.getPublishedAt(),
                attachments);
    }

    private AttachmentSummaryData toAttachmentSummaryData(Attachment attachment) {
        return new AttachmentSummaryData(
                attachment.getId(),
                attachment.getOriginalName(),
                attachment.getFilePath(),
                attachment.getFileSize());
    }

    public record ContentPageSummaryData(Long id, String key, String title, boolean published, String originalFileName) {
    }

    public record ContentPageData(Long id, String key, String title, boolean published, String originalFileName, List<AttachmentSummaryData> attachments) {
    }

    public record NoticeSummaryData(Long id, String title, boolean published, LocalDateTime publishedAt) {
    }

    public record NoticeData(Long id, String title, String bodyHtml, String bodyJson, boolean published, LocalDateTime publishedAt, List<AttachmentSummaryData> attachments) {
    }

    public record AttachmentSummaryData(Long id, String originalName, String url, long fileSize) {
    }
}
