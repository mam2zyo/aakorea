package org.aakorea.main.content.api.publicapi;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.content.application.FileSystemContentService;
import org.aakorea.main.content.application.PublicContentQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicContentController {

    private final PublicContentQueryService publicContentQueryService;
    private final FileSystemContentService fileSystemContentService;

    @GetMapping("/content-pages/{key}")
    public ApiResponse<PublicContentQueryService.PublicContentPageData> getContentPage(@PathVariable String key) {
        return ApiResponse.success(fileSystemContentService.getContentPage(key));
    }

    @GetMapping("/notices")
    public ApiResponse<List<PublicContentQueryService.PublicNoticeSummary>> getNotices() {
        return ApiResponse.success(publicContentQueryService.getNotices());
    }

    @GetMapping("/notices/{id}")
    public ApiResponse<PublicContentQueryService.PublicNoticeData> getNotice(@PathVariable Long id) {
        return ApiResponse.success(publicContentQueryService.getNotice(id));
    }
}
