package org.aakorea.main.content.application;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.content.domain.ContentPage;
import org.aakorea.main.content.domain.Notice;
import org.aakorea.main.content.infrastructure.ContentPageRepository;
import org.aakorea.main.content.infrastructure.NoticeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentAdminService {

    private final ContentPageRepository contentPageRepository;
    private final NoticeRepository noticeRepository;

    public List<ContentPageSummaryData> getContentPages() {
        return contentPageRepository.findAllByOrderByIdAsc().stream()
                .map(this::toContentPageSummaryData)
                .toList();
    }

    public ContentPageData getContentPage(Long id) {
        return toContentPageData(getContentPageEntity(id));
    }

    @Transactional
    public ContentPageData createContentPage(String key, String title, String bodyHtml, String bodyJson, boolean published) {
        String normalizedKey = normalizeKey(key);
        ensureUniqueContentPageKey(normalizedKey, null);

        ContentPage contentPage = contentPageRepository.save(new ContentPage(
                normalizedKey,
                normalizeText(title, "title"),
                normalizeText(bodyHtml, "bodyHtml"),
                normalizeText(bodyJson, "bodyJson"),
                published));

        return toContentPageData(contentPage);
    }

    @Transactional
    public ContentPageData updateContentPage(Long id, String key, String title, String bodyHtml, String bodyJson, boolean published) {
        ContentPage contentPage = getContentPageEntity(id);
        String normalizedKey = normalizeKey(key);
        ensureUniqueContentPageKey(normalizedKey, id);

        contentPage.update(
                normalizedKey,
                normalizeText(title, "title"),
                normalizeText(bodyHtml, "bodyHtml"),
                normalizeText(bodyJson, "bodyJson"),
                published);

        return toContentPageData(contentPage);
    }

    @Transactional
    public void deleteContentPage(Long id) {
        contentPageRepository.delete(getContentPageEntity(id));
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
    public NoticeData createNotice(String title, String bodyHtml, String bodyJson, boolean published, LocalDateTime publishedAt) {
        Notice notice = noticeRepository.save(new Notice(
                normalizeText(title, "title"),
                normalizeText(bodyHtml, "bodyHtml"),
                normalizeText(bodyJson, "bodyJson"),
                published,
                normalizePublishedAt(published, publishedAt)));

        return toNoticeData(notice);
    }

    @Transactional
    public NoticeData updateNotice(Long id, String title, String bodyHtml, String bodyJson, boolean published, LocalDateTime publishedAt) {
        Notice notice = getNoticeEntity(id);
        notice.update(
                normalizeText(title, "title"),
                normalizeText(bodyHtml, "bodyHtml"),
                normalizeText(bodyJson, "bodyJson"),
                published,
                normalizePublishedAt(published, publishedAt));

        return toNoticeData(notice);
    }

    @Transactional
    public void deleteNotice(Long id) {
        noticeRepository.delete(getNoticeEntity(id));
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
                contentPage.isPublished());
    }

    private ContentPageData toContentPageData(ContentPage contentPage) {
        return new ContentPageData(
                contentPage.getId(),
                contentPage.getKey(),
                contentPage.getTitle(),
                contentPage.getBodyHtml(),
                contentPage.getBodyJson(),
                contentPage.isPublished());
    }

    private NoticeSummaryData toNoticeSummaryData(Notice notice) {
        return new NoticeSummaryData(
                notice.getId(),
                notice.getTitle(),
                notice.isPublished(),
                notice.getPublishedAt());
    }

    private NoticeData toNoticeData(Notice notice) {
        return new NoticeData(
                notice.getId(),
                notice.getTitle(),
                notice.getBodyHtml(),
                notice.getBodyJson(),
                notice.isPublished(),
                notice.getPublishedAt());
    }

    public record ContentPageSummaryData(Long id, String key, String title, boolean published) {
    }

    public record ContentPageData(Long id, String key, String title, String bodyHtml, String bodyJson, boolean published) {
    }

    public record NoticeSummaryData(Long id, String title, boolean published, LocalDateTime publishedAt) {
    }

    public record NoticeData(Long id, String title, String bodyHtml, String bodyJson, boolean published, LocalDateTime publishedAt) {
    }
}
