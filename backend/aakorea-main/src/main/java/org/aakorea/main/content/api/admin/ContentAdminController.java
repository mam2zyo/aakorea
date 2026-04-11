package org.aakorea.main.content.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.auth.application.OfficeAuthorizationService;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.content.application.ContentAdminService;
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
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ContentAdminController {

    private final ContentAdminService contentAdminService;
    private final OfficeAuthorizationService officeAuthorizationService;

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @GetMapping("/content-pages")
    public ApiResponse<List<ContentAdminService.ContentPageSummaryData>> getContentPages() {
        return ApiResponse.success(contentAdminService.getContentPages());
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PostMapping("/content-pages/upload")
    public ResponseEntity<ApiResponse<ContentAdminService.ContentPageData>> uploadContentPage(
            @RequestParam("key") String key,
            @RequestParam("title") String title,
            @RequestParam(value = "published", defaultValue = "false") boolean published,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(ApiResponse.success(contentAdminService.createContentPage(key, title, published, file, List.of())));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PostMapping("/content-pages/{id}")
    public ResponseEntity<ApiResponse<ContentAdminService.ContentPageData>> updateContentPage(
            @PathVariable Long id,
            @RequestParam("key") String key,
            @RequestParam("title") String title,
            @RequestParam("published") boolean published,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(ApiResponse.success(contentAdminService.updateContentPage(id, key, title, published, file, List.of())));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PatchMapping("/content-pages/{id}/metadata")
    public ResponseEntity<ApiResponse<ContentAdminService.ContentPageData>> updateContentMetadata(
            @PathVariable Long id,
            @RequestBody MetadataUpdateRequest request) {
        ContentAdminService.ContentPageData updated = contentAdminService.updateContentPage(
                id, request.key(), request.title(), request.published(), null, List.of());
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @DeleteMapping("/content-pages/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContentPage(@PathVariable Long id) {
        contentAdminService.deleteContentPage(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PutMapping("/content-pages/{id}/publish")
    public ResponseEntity<ApiResponse<Void>> togglePublishContentPage(
            @PathVariable Long id,
            @RequestParam("published") boolean published) {
        contentAdminService.updateContentPage(id, null, null, published, null, List.of());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    public record MetadataUpdateRequest(String key, String title, boolean published) {}

    @PreAuthorize("hasAuthority('PERM_notice.manage')")
    @GetMapping("/notices")
    public ApiResponse<List<ContentAdminService.NoticeSummaryData>> getNotices() {
        return ApiResponse.success(contentAdminService.getNotices());
    }

    @PreAuthorize("hasAuthority('PERM_notice.manage')")
    @GetMapping("/notices/{id}")
    public ApiResponse<ContentAdminService.NoticeData> getNotice(@PathVariable Long id) {
        return ApiResponse.success(contentAdminService.getNotice(id));
    }

    @PreAuthorize("hasAuthority('PERM_notice.manage')")
    @PostMapping("/notices")
    public ResponseEntity<ApiResponse<ContentAdminService.NoticeData>> createNotice(
            @Valid @RequestBody NoticeRequest request
    ) {
        officeAuthorizationService.assertCanSaveNotice(null, request.published());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(contentAdminService.createNotice(
                request.title(),
                request.bodyHtml(),
                request.bodyJson(),
                request.published(),
                request.publishedAt(),
                request.attachmentIds())));
    }

    @PreAuthorize("hasAuthority('PERM_notice.manage')")
    @PutMapping("/notices/{id}")
    public ApiResponse<ContentAdminService.NoticeData> updateNotice(
            @PathVariable Long id,
            @Valid @RequestBody NoticeRequest request
    ) {
        officeAuthorizationService.assertCanSaveNotice(id, request.published());
        return ApiResponse.success(contentAdminService.updateNotice(
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
        contentAdminService.deleteNotice(id);
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
