package org.aakorea.core.content.api.office;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.auth.application.OfficeAuthorizationService;
import org.aakorea.core.common.response.ApiResponse;
import org.aakorea.core.content.application.ContentOfficeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/office")
@RequiredArgsConstructor
public class ContentOfficeController {

    private final ContentOfficeService contentOfficeService;
    private final OfficeAuthorizationService officeAuthorizationService;

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @GetMapping("/content-pages")
    public ApiResponse<List<ContentOfficeService.ContentPageSummaryData>> getContentPages() {
        return ApiResponse.success(contentOfficeService.getContentPages());
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PostMapping("/content-pages/upload")
    public ResponseEntity<ApiResponse<ContentOfficeService.ContentPageData>> uploadContentPage(
            @RequestParam("key") String key,
            @RequestParam("title") String title,
            @RequestParam(value = "published", defaultValue = "false") boolean published,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        officeAuthorizationService.assertCanSaveContentPage(null, published);
        return ResponseEntity.ok(ApiResponse.success(contentOfficeService.createContentPage(key, title, published, file, List.of())));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PostMapping("/content-pages/{id}")
    public ResponseEntity<ApiResponse<ContentOfficeService.ContentPageData>> updateContentPage(
            @PathVariable Long id,
            @RequestParam("key") String key,
            @RequestParam("title") String title,
            @RequestParam("published") boolean published,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        officeAuthorizationService.assertCanSaveContentPage(id, published);
        return ResponseEntity.ok(ApiResponse.success(contentOfficeService.updateContentPage(id, key, title, published, file, List.of())));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PatchMapping("/content-pages/{id}/metadata")
    public ResponseEntity<ApiResponse<ContentOfficeService.ContentPageData>> updateContentMetadata(
            @PathVariable Long id,
            @RequestBody MetadataUpdateRequest request) {
        officeAuthorizationService.assertCanSaveContentPage(id, request.published());
        ContentOfficeService.ContentPageData updated = contentOfficeService.updateContentPage(
                id, request.key(), request.title(), request.published(), null, List.of());
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @DeleteMapping("/content-pages/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContentPage(@PathVariable Long id) {
        officeAuthorizationService.assertCanDeleteContentPage(id);
        contentOfficeService.deleteContentPage(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PutMapping("/content-pages/{id}/publish")
    public ResponseEntity<ApiResponse<Void>> togglePublishContentPage(
            @PathVariable Long id,
            @RequestParam("published") boolean published) {
        officeAuthorizationService.assertCanSaveContentPage(id, published);
        contentOfficeService.updateContentPage(id, null, null, published, null, List.of());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    public record MetadataUpdateRequest(String key, String title, boolean published) {}

    @PreAuthorize("hasAuthority('PERM_notice.manage')")
    @GetMapping("/notices")
    public ApiResponse<List<ContentOfficeService.NoticeSummaryData>> getNotices() {
        return ApiResponse.success(contentOfficeService.getNotices());
    }

    @PreAuthorize("hasAuthority('PERM_notice.manage')")
    @GetMapping("/notices/{id}")
    public ApiResponse<ContentOfficeService.NoticeData> getNotice(@PathVariable Long id) {
        return ApiResponse.success(contentOfficeService.getNotice(id));
    }

    @PreAuthorize("hasAuthority('PERM_notice.manage')")
    @PostMapping("/notices")
    public ResponseEntity<ApiResponse<ContentOfficeService.NoticeData>> createNotice(
            @Valid @RequestBody NoticeRequest request
    ) {
        officeAuthorizationService.assertCanSaveNotice(null, request.published());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(contentOfficeService.createNotice(
                request.title(),
                request.bodyHtml(),
                request.bodyJson(),
                request.published(),
                request.publishedAt(),
                request.attachmentIds())));
    }

    @PreAuthorize("hasAuthority('PERM_notice.manage')")
    @PutMapping("/notices/{id}")
    public ApiResponse<ContentOfficeService.NoticeData> updateNotice(
            @PathVariable Long id,
            @Valid @RequestBody NoticeRequest request
    ) {
        officeAuthorizationService.assertCanSaveNotice(id, request.published());
        return ApiResponse.success(contentOfficeService.updateNotice(
                id,
                request.title(),
                request.bodyHtml(),
                request.bodyJson(),
                request.published(),
                request.publishedAt(),
                request.attachmentIds()));
    }

    @PreAuthorize("hasAuthority('PERM_notice.manage')")
    @DeleteMapping("/notices/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        officeAuthorizationService.assertCanDeleteNotice(id);
        contentOfficeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }

    public record NoticeRequest(
            @NotBlank(message = "title is required") String title,
            @NotBlank(message = "bodyHtml is required") String bodyHtml,
            @NotBlank(message = "bodyJson is required") String bodyJson,
            @NotNull(message = "published is required") Boolean published,
            LocalDateTime publishedAt,
            List<Long> attachmentIds
    ) {
    }
}
