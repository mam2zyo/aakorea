package io.step5.aakorea.modules.general.admin.notice.application;

import io.step5.aakorea.modules.general.admin.group.application.AdminGroupNotFoundException;
import io.step5.aakorea.modules.general.admin.group.application.GroupChangeLogService;
import io.step5.aakorea.modules.general.admin.group.domain.Group;
import io.step5.aakorea.modules.general.admin.group.infrastructure.GroupRepository;
import io.step5.aakorea.modules.general.admin.notice.api.AdminNoticeDto;
import io.step5.aakorea.modules.general.admin.notice.api.AdminNoticeRequest;
import io.step5.aakorea.modules.general.admin.notice.domain.GroupNotice;
import io.step5.aakorea.modules.general.admin.notice.domain.NoticeType;
import io.step5.aakorea.modules.general.admin.notice.infrastructure.GroupNoticeRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminNoticeService {

    private final GroupRepository groupRepository;
    private final GroupNoticeRepository groupNoticeRepository;
    private final GroupChangeLogService groupChangeLogService;

    public List<AdminNoticeDto> getNotices(Long groupId) {
        findGroup(groupId);
        LocalDateTime now = LocalDateTime.now();
        return groupNoticeRepository.findAllNoticesByGroupId(groupId).stream()
                .map(notice -> AdminNoticeDto.from(notice, now))
                .toList();
    }

    @Transactional
    public AdminNoticeDto createNotice(Long groupId, AdminNoticeRequest request) {
        Group group = findGroup(groupId);
        validateDisplayWindow(request);

        GroupNotice notice = new GroupNotice();
        notice.setGroup(group);
        apply(notice, request);

        GroupNotice savedNotice = groupNoticeRepository.save(notice);
        groupChangeLogService.record(
                group,
                "그룹 공지가 등록되었습니다.",
                describeNotice(savedNotice),
                savedNotice.isPublished()
        );

        return AdminNoticeDto.from(savedNotice, LocalDateTime.now());
    }

    @Transactional
    public AdminNoticeDto updateNotice(Long groupId, Long noticeId, AdminNoticeRequest request) {
        Group group = findGroup(groupId);
        GroupNotice notice = findNotice(noticeId, groupId);
        NoticeSnapshot before = NoticeSnapshot.from(notice);

        validateDisplayWindow(request);
        apply(notice, request);
        NoticeSnapshot after = NoticeSnapshot.from(notice);

        if (!before.equals(after)) {
            groupChangeLogService.record(
                    group,
                    "그룹 공지가 수정되었습니다.",
                    """
                    변경 전
                    %s

                    변경 후
                    %s
                    """.formatted(before.describe(), after.describe()).trim(),
                    notice.isPublished()
            );
        }

        return AdminNoticeDto.from(notice, LocalDateTime.now());
    }

    @Transactional
    public void deleteNotice(Long groupId, Long noticeId) {
        Group group = findGroup(groupId);
        GroupNotice notice = findNotice(noticeId, groupId);
        String detail = describeNotice(notice);
        boolean visibleToPublic = notice.isPublished();

        groupNoticeRepository.delete(notice);
        groupChangeLogService.record(
                group,
                "그룹 공지가 삭제되었습니다.",
                detail,
                visibleToPublic
        );
    }

    private Group findGroup(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new AdminGroupNotFoundException(groupId));
    }

    private GroupNotice findNotice(Long noticeId, Long groupId) {
        return groupNoticeRepository.findByIdAndGroup_Id(noticeId, groupId)
                .orElseThrow(() -> new AdminNoticeNotFoundException(noticeId));
    }

    private void apply(GroupNotice notice, AdminNoticeRequest request) {
        notice.setTitle(normalizeTitle(request.title()));
        notice.setContent(normalizeContent(request.content()));
        notice.setType(request.type());
        notice.setPublished(request.published());
        notice.setDisplayStartAt(request.displayStartAt());
        notice.setDisplayEndAt(request.displayEndAt());
    }

    private void validateDisplayWindow(AdminNoticeRequest request) {
        if (request.displayStartAt() != null
                && request.displayEndAt() != null
                && request.displayEndAt().isBefore(request.displayStartAt())) {
            throw new NoticeDisplayWindowInvalidException();
        }
    }

    private String describeNotice(GroupNotice notice) {
        return """
                - 제목: %s
                - 유형: %s
                - 공개 여부: %s
                - 노출 시작: %s
                - 노출 종료: %s
                """.formatted(
                notice.getTitle(),
                formatNoticeType(notice.getType()),
                notice.isPublished() ? "공개" : "비공개",
                formatDateTime(notice.getDisplayStartAt()),
                formatDateTime(notice.getDisplayEndAt())
        ).trim();
    }

    private String normalizeTitle(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }

    private String normalizeContent(String value) {
        if (value == null) {
            return "";
        }

        return value.lines()
                .map(String::trim)
                .reduce((left, right) -> left + "\n" + right)
                .orElse("");
    }

    private String formatNoticeType(NoticeType type) {
        return switch (type) {
            case GENERAL -> "일반";
            case TEMP_CHANGE -> "임시 변경";
            case CLOSED_INFO -> "휴무 안내";
        };
    }

    private String formatDateTime(LocalDateTime value) {
        return value == null ? "-" : value.toString();
    }

    private record NoticeSnapshot(
            String title,
            String content,
            NoticeType type,
            boolean published,
            LocalDateTime displayStartAt,
            LocalDateTime displayEndAt
    ) {
        private static NoticeSnapshot from(GroupNotice notice) {
            return new NoticeSnapshot(
                    notice.getTitle(),
                    notice.getContent(),
                    notice.getType(),
                    notice.isPublished(),
                    notice.getDisplayStartAt(),
                    notice.getDisplayEndAt()
            );
        }

        private String describe() {
            return """
                    - 제목: %s
                    - 유형: %s
                    - 공개 여부: %s
                    - 노출 시작: %s
                    - 노출 종료: %s
                    """.formatted(
                    title,
                    formatNoticeType(type),
                    published ? "공개" : "비공개",
                    displayStartAt == null ? "-" : displayStartAt,
                    displayEndAt == null ? "-" : displayEndAt
            ).trim();
        }

        private String formatNoticeType(NoticeType type) {
            return switch (type) {
                case GENERAL -> "일반";
                case TEMP_CHANGE -> "임시 변경";
                case CLOSED_INFO -> "휴무 안내";
            };
        }
    }
}
