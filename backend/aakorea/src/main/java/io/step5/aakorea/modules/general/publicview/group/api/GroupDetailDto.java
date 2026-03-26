package io.step5.aakorea.modules.general.publicview.group.api;

import io.step5.aakorea.modules.general.admin.district.domain.District;
import io.step5.aakorea.modules.general.admin.group.domain.Group;
import io.step5.aakorea.modules.general.admin.group.domain.GroupChangeLog;
import io.step5.aakorea.modules.general.admin.meeting.domain.Meeting;
import io.step5.aakorea.modules.general.admin.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.general.admin.notice.domain.GroupNotice;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

/**
 * 域밸챶竊??怨멸쉭 ?遺얇늺 ?臾먮뼗 DTO.
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
     * 域밸챶竊?疫꿸퀡???關??
     */
    private MeetingPlaceDto defaultMeetingPlace;

    /**
     * 域밸챶竊???類?┛ 筌뤴뫁??筌뤴뫖以?
     */
    private List<MeetingDetailDto> meetings;

    /**
     * ?袁⑹삺 ?紐꾪뀱 餓λ쵐???⑤벊? 筌뤴뫖以?
     */
    private List<GroupNoticeDto> notices;

    /**
     * 筌ㅼ뮄??癰궰野껋럩沅??
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
