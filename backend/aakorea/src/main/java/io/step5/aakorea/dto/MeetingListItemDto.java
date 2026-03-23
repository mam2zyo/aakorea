package io.step5.aakorea.dto;

import io.step5.aakorea.domain.Meeting;
import io.step5.aakorea.domain.MeetingPlace;
import io.step5.aakorea.domain.MeetingStatus;
import io.step5.aakorea.domain.MeetingType;
import lombok.Builder;
import lombok.Getter;

import java.time.DayOfWeek;
import java.time.LocalTime;

/**
 * 모임 검색 결과 목록용 DTO.
 *
 * 사용자는 "모임"을 클릭하지만 실제 상세는 그룹 상세 페이지로 이동하므로,
 * 그룹 식별 정보와 실제 표시 장소를 함께 내려준다.
 */
@Getter
@Builder
public class MeetingListItemDto {

    private Long meetingId;
    private Long groupId;
    private String groupName;

    private DayOfWeek dayOfWeek;
    private LocalTime startTime;

    private MeetingType meetingType;
    private MeetingStatus status;

    /**
     * 실제 표시 장소.
     * meeting.meetingPlace가 있으면 그것을 사용하고,
     * 없으면 group.meetingPlace를 사용한다.
     */
    private MeetingPlaceDto meetingPlace;

    public static MeetingListItemDto from(Meeting meeting) {
        MeetingPlace actualPlace = resolveActualPlace(meeting);

        return MeetingListItemDto.builder()
                .meetingId(meeting.getId())
                .groupId(meeting.getGroup().getId())
                .groupName(meeting.getGroup().getName())
                .dayOfWeek(meeting.getDayOfWeek())
                .startTime(meeting.getStartTime())
                .meetingType(meeting.getMeetingType())
                .status(meeting.getStatus())
                .meetingPlace(MeetingPlaceDto.from(actualPlace))
                .build();
    }

    private static MeetingPlace resolveActualPlace(Meeting meeting) {
        return meeting.getMeetingPlace() != null
                ? meeting.getMeetingPlace()
                : meeting.getGroup().getMeetingPlace();
    }
}