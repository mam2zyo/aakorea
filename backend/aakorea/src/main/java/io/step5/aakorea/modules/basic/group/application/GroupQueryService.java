package io.step5.aakorea.modules.basic.group.application;

import io.step5.aakorea.modules.basic.group.api.GroupChangeLogDto;
import io.step5.aakorea.modules.basic.group.api.GroupDetailDto;
import io.step5.aakorea.modules.basic.group.api.GroupNoticeDto;
import io.step5.aakorea.modules.basic.group.api.MeetingDetailDto;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.group.domain.GroupChangeLog;
import io.step5.aakorea.modules.service.group.infrastructure.GroupChangeLogRepository;
import io.step5.aakorea.modules.service.group.infrastructure.GroupRepository;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.notice.domain.GroupNotice;
import io.step5.aakorea.modules.service.notice.infrastructure.GroupNoticeRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GroupQueryService {

    private static final int DEFAULT_NOTICE_LIMIT = 10;
    private static final int DEFAULT_CHANGE_LOG_LIMIT = 10;

    private final GroupRepository groupRepository;
    private final GroupNoticeRepository groupNoticeRepository;
    private final GroupChangeLogRepository groupChangeLogRepository;

    public GroupDetailDto getGroupDetail(Long groupId) {
        Group group = groupRepository.findDetailById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(groupId));

        List<MeetingDetailDto> meetingDtos = group.getMeetings().stream()
                .map(MeetingDetailDto::from)
                .toList();

        List<GroupNoticeDto> noticeDtos = groupNoticeRepository.findActiveNotices(
                        groupId,
                        LocalDateTime.now(),
                        PageRequest.of(0, DEFAULT_NOTICE_LIMIT)
                ).stream()
                .map(GroupNoticeDto::from)
                .toList();

        List<GroupChangeLogDto> changeLogDtos = groupChangeLogRepository.findPublicLogs(
                        groupId,
                        PageRequest.of(0, DEFAULT_CHANGE_LOG_LIMIT)
                ).stream()
                .map(GroupChangeLogDto::from)
                .toList();

        return GroupDetailDto.of(group, meetingDtos, noticeDtos, changeLogDtos);
    }
}
