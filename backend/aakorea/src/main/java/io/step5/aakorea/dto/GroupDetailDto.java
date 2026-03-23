package io.step5.aakorea.dto;

import io.step5.aakorea.domain.Group;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

/**
 * 그룹 상세 화면 응답 DTO.
 */
@Getter
@Builder
public class GroupDetailDto {

    private Long groupId;
    private String groupName;
    private LocalDate startDate;

    private String province;
    private Long districtId;
    private String districtName;

    private String contactAddress;
    private String contactEmail;
    private String contactPhone;

    /**
     * 그룹 기본 장소.
     */
    private MeetingPlaceDto defaultMeetingPlace;

    /**
     * 그룹의 정기 모임 목록.
     */
    private List<MeetingDetailDto> meetings;

    /**
     * 현재 노출 중인 공지 목록.
     */
    private List<GroupNoticeDto> notices;

    /**
     * 최근 변경사항.
     */
    private List<GroupChangeLogDto> recentChangeLogs;

    public static GroupDetailDto of(
            Group group,
            List<MeetingDetailDto> meetings,
            List<GroupNoticeDto> notices,
            List<GroupChangeLogDto> recentChangeLogs
    ) {
        return GroupDetailDto.builder()
                .groupId(group.getId())
                .groupName(group.getName())
                .startDate(group.getStartDate())
                .province(group.getProvince().name())
                .districtId(group.getDistrict() != null ? group.getDistrict().getId() : null)
                .districtName(group.getDistrict() != null ? group.getDistrict().getName() : null)
                .contactAddress(group.getContactAddress())
                .contactEmail(group.getContactEmail())
                .contactPhone(group.getContactPhone())
                .defaultMeetingPlace(MeetingPlaceDto.from(group.getMeetingPlace()))
                .meetings(meetings)
                .notices(notices)
                .recentChangeLogs(recentChangeLogs)
                .build();
    }
}