package org.aakorea.main.content.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.content.application.ContentAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ContentAdminController {

    private final ContentAdminService contentAdminService;

    @GetMapping("/content-pages")
    public ApiResponse<List<ContentAdminService.ContentPageSummaryData>> getContentPages() {
        return ApiResponse.success(contentAdminService.getContentPages());
    }

    @GetMapping("/content-pages/{id}")
    public ApiResponse<ContentAdminService.ContentPageData> getContentPage(@PathVariable Long id) {
        return ApiResponse.success(contentAdminService.getContentPage(id));
    }

    @PostMapping("/content-pages")
    public ResponseEntity<ApiResponse<ContentAdminService.ContentPageData>> createContentPage(
            @Valid @RequestBody ContentPageRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(contentAdminService.createContentPage(
                request.key(),
                request.title(),
                request.body(),
                request.published())));
    }

    @PutMapping("/content-pages/{id}")
    public ApiResponse<ContentAdminService.ContentPageData> updateContentPage(
            @PathVariable Long id,
            @Valid @RequestBody ContentPageRequest request
    ) {
        return ApiResponse.success(contentAdminService.updateContentPage(
                id,
                request.key(),
                request.title(),
                request.body(),
                request.published()));
    }

    @GetMapping("/notices")
    public ApiResponse<List<ContentAdminService.NoticeSummaryData>> getNotices() {
        return ApiResponse.success(contentAdminService.getNotices());
    }

    @GetMapping("/notices/{id}")
    public ApiResponse<ContentAdminService.NoticeData> getNotice(@PathVariable Long id) {
        return ApiResponse.success(contentAdminService.getNotice(id));
    }

    @PostMapping("/notices")
    public ResponseEntity<ApiResponse<ContentAdminService.NoticeData>> createNotice(
            @Valid @RequestBody NoticeRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(contentAdminService.createNotice(
                request.title(),
                request.body(),
                request.published(),
                request.publishedAt())));
    }

    @PutMapping("/notices/{id}")
    public ApiResponse<ContentAdminService.NoticeData> updateNotice(
            @PathVariable Long id,
            @Valid @RequestBody NoticeRequest request
    ) {
        return ApiResponse.success(contentAdminService.updateNotice(
                id,
                request.title(),
                request.body(),
                request.published(),
                request.publishedAt()));
    }

    public record ContentPageRequest(
            @NotBlank(message = "key is required") String key,
            @NotBlank(message = "title is required") String title,
            @NotBlank(message = "body is required") String body,
            @NotNull(message = "published is required") Boolean published
    ) {
    }

    public record NoticeRequest(
            @NotBlank(message = "title is required") String title,
            @NotBlank(message = "body is required") String body,
            @NotNull(message = "published is required") Boolean published,
            LocalDateTime publishedAt
    ) {
    }
}
