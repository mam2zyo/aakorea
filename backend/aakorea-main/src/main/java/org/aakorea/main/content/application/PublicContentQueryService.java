package org.aakorea.main.content.application;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
public class PublicContentQueryService {

    private final ContentPageRepository contentPageRepository;
    private final NoticeRepository noticeRepository;

    public PublicContentPageData getContentPage(String key) {
        ContentPage contentPage = contentPageRepository.findByKeyAndPublishedTrue(normalizeKey(key))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "content page not found"));

        return new PublicContentPageData(
                contentPage.getId(),
                contentPage.getKey(),
                contentPage.getTitle(),
                contentPage.getBodyHtml());
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

        return new PublicNoticeData(
                notice.getId(),
                notice.getTitle(),
                notice.getBodyHtml(),
                notice.getPublishedAt());
    }

    private String normalizeKey(String key) {
        if (key == null || key.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "key is required");
        }

        return key.trim();
    }

    public record PublicContentPageData(Long id, String key, String title, String bodyHtml) {
    }

    public record PublicNoticeSummary(Long id, String title, LocalDateTime publishedAt) {
    }

    public record PublicNoticeData(Long id, String title, String bodyHtml, LocalDateTime publishedAt) {
    }
}
