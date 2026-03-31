package org.aakorea.main.content.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.aakorea.main.content.domain.ContentPage;
import org.aakorea.main.content.domain.Notice;
import org.aakorea.main.content.infrastructure.ContentPageRepository;
import org.aakorea.main.content.infrastructure.NoticeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class PublicContentQueryServiceTest {

    @Mock
    private ContentPageRepository contentPageRepository;

    @Mock
    private NoticeRepository noticeRepository;

    @InjectMocks
    private PublicContentQueryService publicContentQueryService;

    @Test
    void getContentPageRequiresExistingPublishedPage() {
        given(contentPageRepository.findByKeyAndPublishedTrue("first-visitor-guide")).willReturn(Optional.empty());

        assertThatThrownBy(() -> publicContentQueryService.getContentPage("first-visitor-guide"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(responseStatusException.getReason()).isEqualTo("content page not found");
                });
    }

    @Test
    void getNoticesMapsPublishedSummaries() {
        Notice notice = new Notice(
                "공지 제목",
                "공지 본문",
                true,
                LocalDateTime.of(2026, 3, 30, 9, 0));
        ReflectionTestUtils.setField(notice, "id", 10L);

        given(noticeRepository.findAllByPublishedTrueOrderByPublishedAtDescIdDesc()).willReturn(List.of(notice));

        List<PublicContentQueryService.PublicNoticeSummary> result = publicContentQueryService.getNotices();

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().id()).isEqualTo(10L);
        assertThat(result.getFirst().title()).isEqualTo("공지 제목");
        assertThat(result.getFirst().publishedAt()).isEqualTo(LocalDateTime.of(2026, 3, 30, 9, 0));
    }

    @Test
    void getNoticeReturnsPublishedDetail() {
        Notice notice = new Notice(
                "공지 제목",
                "공지 본문",
                true,
                LocalDateTime.of(2026, 3, 30, 9, 0));
        ReflectionTestUtils.setField(notice, "id", 10L);

        given(noticeRepository.findByIdAndPublishedTrue(10L)).willReturn(Optional.of(notice));

        PublicContentQueryService.PublicNoticeData result = publicContentQueryService.getNotice(10L);

        assertThat(result.id()).isEqualTo(10L);
        assertThat(result.title()).isEqualTo("공지 제목");
        assertThat(result.body()).isEqualTo("공지 본문");
    }
}
