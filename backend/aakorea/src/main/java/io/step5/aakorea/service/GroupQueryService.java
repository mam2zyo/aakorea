package io.step5.aakorea.service;

import io.step5.aakorea.domain.Group;
import io.step5.aakorea.dto.GroupChangeLogDto;
import io.step5.aakorea.dto.GroupDetailDto;
import io.step5.aakorea.dto.GroupNoticeDto;
import io.step5.aakorea.dto.MeetingDetailDto;
import io.step5.aakorea.repository.GroupChangeLogRepository;
import io.step5.aakorea.repository.GroupNoticeRepository;
import io.step5.aakorea.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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