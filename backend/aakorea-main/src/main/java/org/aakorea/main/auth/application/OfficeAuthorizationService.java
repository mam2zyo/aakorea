package org.aakorea.main.auth.application;

import lombok.RequiredArgsConstructor;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.content.domain.ContentPage;
import org.aakorea.main.content.domain.Notice;
import org.aakorea.main.content.infrastructure.ContentPageRepository;
import org.aakorea.main.content.infrastructure.NoticeRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OfficeAuthorizationService {

    private final ContentPageRepository contentPageRepository;
    private final NoticeRepository noticeRepository;

    public void assertCanSaveContentPage(Long contentPageId, boolean requestedPublished) {
        requirePermission(AdminPermission.CONTENT_PAGE_MANAGE);
        requirePublishPermissionIfNeeded(requestedPublished, currentContentPagePublished(contentPageId));
    }

    public void assertCanDeleteContentPage(Long contentPageId) {
        requirePermission(AdminPermission.CONTENT_PAGE_MANAGE);
        requirePublishPermissionIfNeeded(false, currentContentPagePublished(contentPageId));
    }

    public void assertCanSaveNotice(Long noticeId, boolean requestedPublished) {
        requirePermission(AdminPermission.NOTICE_MANAGE);
        requirePublishPermissionIfNeeded(requestedPublished, currentNoticePublished(noticeId));
    }

    public void assertCanDeleteNotice(Long noticeId) {
        requirePermission(AdminPermission.NOTICE_MANAGE);
        requirePublishPermissionIfNeeded(false, currentNoticePublished(noticeId));
    }

    private void requirePermission(AdminPermission permission) {
        if (!hasPermission(permission)) {
            throw forbidden();
        }
    }

    private void requirePublishPermissionIfNeeded(boolean requestedPublished, boolean currentlyPublished) {
        if (hasPermission(AdminPermission.CONTENT_PUBLISH)) {
            return;
        }

        if (requestedPublished || currentlyPublished) {
            throw forbidden();
        }
    }

    private boolean hasPermission(AdminPermission permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .anyMatch(authority -> permission.authority().equals(authority.getAuthority()));
    }

    private boolean currentContentPagePublished(Long contentPageId) {
        if (contentPageId == null) {
            return false;
        }

        return contentPageRepository.findById(contentPageId)
                .map(ContentPage::isPublished)
                .orElse(false);
    }

    private boolean currentNoticePublished(Long noticeId) {
        if (noticeId == null) {
            return false;
        }

        return noticeRepository.findById(noticeId)
                .map(Notice::isPublished)
                .orElse(false);
    }

    private AccessDeniedException forbidden() {
        return new AccessDeniedException("forbidden");
    }
}
