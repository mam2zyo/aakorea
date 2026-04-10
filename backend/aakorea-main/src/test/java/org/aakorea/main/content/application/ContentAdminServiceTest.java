package org.aakorea.main.content.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.time.LocalDateTime;
import java.util.Optional;
import org.aakorea.main.content.domain.ContentPage;
import org.aakorea.main.content.domain.Notice;
import org.aakorea.main.content.infrastructure.ContentPageRepository;
import org.aakorea.main.content.infrastructure.NoticeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ContentAdminServiceTest {

    @Mock
    private ContentPageRepository contentPageRepository;

    @Mock
    private NoticeRepository noticeRepository;

    @InjectMocks
    private ContentAdminService contentAdminService;

    @Test
    void createContentPageTrimsFieldsBeforeSaving() {
        given(contentPageRepository.existsByKey("first-visitor-guide")).willReturn(false);
        given(contentPageRepository.save(org.mockito.ArgumentMatchers.any(ContentPage.class)))
                .willAnswer(invocation -> {
                    ContentPage contentPage = invocation.getArgument(0);
                    ReflectionTestUtils.setField(contentPage, "id", 1L);
                    return contentPage;
                });

        ContentAdminService.ContentPageData result = contentAdminService.createContentPage(
                " first-visitor-guide ",
                " 처음 오신 분 안내 ",
                " 페이지 본문 HTML ",
                " 페이지 본문 JSON ",
                true);

        ArgumentCaptor<ContentPage> captor = ArgumentCaptor.forClass(ContentPage.class);
        verify(contentPageRepository).save(captor.capture());

        assertThat(captor.getValue().getKey()).isEqualTo("first-visitor-guide");
        assertThat(captor.getValue().getTitle()).isEqualTo("처음 오신 분 안내");
        assertThat(captor.getValue().getBodyHtml()).isEqualTo("페이지 본문 HTML");
        assertThat(captor.getValue().getBodyJson()).isEqualTo("페이지 본문 JSON");
        assertThat(result.id()).isEqualTo(1L);
    }

    @Test
    void createContentPageThrowsConflictWhenKeyAlreadyExists() {
        given(contentPageRepository.existsByKey("first-visitor-guide")).willReturn(true);

        assertThatThrownBy(() -> contentAdminService.createContentPage(
                "first-visitor-guide",
                "처음 오신 분 안내",
                "본문 HTML",
                "본문 JSON",
                true))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(responseStatusException.getReason()).isEqualTo("content page key already exists");
                });
    }

    @Test
    void updateNoticeRequiresPublishedAtWhenPublished() {
        Notice notice = new Notice("기존 공지", "기존 본문 HTML", "기존 본문 JSON", false, null);
        given(noticeRepository.findById(10L)).willReturn(Optional.of(notice));

        assertThatThrownBy(() -> contentAdminService.updateNotice(10L, "새 공지", "본문 HTML", "본문 JSON", true, null))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(responseStatusException.getReason()).isEqualTo("publishedAt is required when published");
                });
    }

    @Test
    void updateNoticeTruncatesPublishedAtToSeconds() {
        Notice notice = new Notice("기존 공지", "기존 본문 HTML", "기존 본문 JSON", false, null);
        given(noticeRepository.findById(10L)).willReturn(Optional.of(notice));

        ContentAdminService.NoticeData result = contentAdminService.updateNotice(
                10L,
                " 수정된 공지 ",
                " 수정된 본문 HTML ",
                " 수정된 본문 JSON ",
                true,
                LocalDateTime.of(2026, 3, 31, 9, 0, 5, 123_000_000));

        assertThat(notice.getTitle()).isEqualTo("수정된 공지");
        assertThat(notice.getBodyHtml()).isEqualTo("수정된 본문 HTML");
        assertThat(notice.getBodyJson()).isEqualTo("수정된 본문 JSON");
        assertThat(notice.isPublished()).isTrue();
        assertThat(notice.getPublishedAt()).isEqualTo(LocalDateTime.of(2026, 3, 31, 9, 0, 5));
        assertThat(result.publishedAt()).isEqualTo(LocalDateTime.of(2026, 3, 31, 9, 0, 5));
    }

    @Test
    void deleteContentPageRemovesExistingPage() {
        ContentPage contentPage = new ContentPage("first-visitor-guide", "처음 오신 분 안내", "본문 HTML", "본문 JSON", true);
        given(contentPageRepository.findById(3L)).willReturn(Optional.of(contentPage));

        contentAdminService.deleteContentPage(3L);

        verify(contentPageRepository).delete(contentPage);
    }

    @Test
    void deleteNoticeRemovesExistingNotice() {
        Notice notice = new Notice("공지", "본문 HTML", "본문 JSON", true, LocalDateTime.of(2026, 4, 2, 9, 0));
        given(noticeRepository.findById(4L)).willReturn(Optional.of(notice));

        contentAdminService.deleteNotice(4L);

        verify(noticeRepository).delete(notice);
    }
}
