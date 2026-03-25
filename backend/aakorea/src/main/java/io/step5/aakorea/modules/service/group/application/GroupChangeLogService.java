package io.step5.aakorea.modules.service.group.application;

import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.group.domain.GroupChangeLog;
import io.step5.aakorea.modules.service.group.infrastructure.GroupChangeLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GroupChangeLogService {

    private final GroupChangeLogRepository groupChangeLogRepository;

    @Transactional
    public void record(Group group, String summary, String detail) {
        record(group, summary, detail, true);
    }

    @Transactional
    public void record(Group group, String summary, String detail, boolean visibleToPublic) {
        GroupChangeLog changeLog = new GroupChangeLog();
        changeLog.setGroup(group);
        changeLog.setSummary(summary);
        changeLog.setDetail(normalizeNullableText(detail));
        changeLog.setChangedBy("관리자");
        changeLog.setVisibleToPublic(visibleToPublic);
        groupChangeLogRepository.save(changeLog);
    }

    private String normalizeNullableText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
