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
import org.aakorea.main.content.application.FileSystemContentService;
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
    private final FileSystemContentService fileSystemContentService;
    private final OfficeAuthorizationService officeAuthorizationService;

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @GetMapping("/content-pages")
    public ApiResponse<List<FileSystemContentService.ContentPageSummary>> getContentPages() {
        return ApiResponse.success(fileSystemContentService.getAllContentPages());
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PostMapping("/content-pages/upload")
    public ResponseEntity<ApiResponse<Void>> uploadContentPage(
            @RequestParam("key") String key,
            @RequestParam("title") String title,
            @RequestParam(value = "published", defaultValue = "false") boolean published,
            @RequestParam("file") MultipartFile file
    ) {
        fileSystemContentService.uploadContentFile(key, title, published, file);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PatchMapping("/content-pages/{key}/metadata")
    public ResponseEntity<ApiResponse<Void>> updateContentMetadata(
            @PathVariable String key,
            @RequestBody MetadataUpdateRequest request) {
        fileSystemContentService.updateContentMetadata(key, request.title(), request.published());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @DeleteMapping("/content-pages/{key}")
    public ResponseEntity<ApiResponse<Void>> deleteContentPage(@PathVariable String key) {
        fileSystemContentService.deleteContentFile(key);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PreAuthorize("hasAuthority('PERM_content_page.manage')")
    @PutMapping("/content-pages/{key}/publish")
    public ResponseEntity<ApiResponse<Void>> togglePublishContentPage(
            @PathVariable String key,
            @RequestParam("published") boolean published) {
        fileSystemContentService.setPublishStatus(key, published);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    public record MetadataUpdateRequest(String title, boolean published) {}

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

    public record ContentPageRequest(
            @NotBlank(message = "key is required") String key,
            @NotBlank(message = "title is required") String title,
            @NotBlank(message = "bodyHtml is required") String bodyHtml,
            @NotBlank(message = "bodyJson is required") String bodyJson,
            @NotNull(message = "published is required") Boolean published,
            List<Long> attachmentIds
    ) {
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
