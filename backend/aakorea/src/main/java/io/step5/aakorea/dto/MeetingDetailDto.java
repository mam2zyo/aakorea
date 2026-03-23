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
 * 그룹 상세 화면 안에서 보여줄 정기 모임 DTO.
 */
@Getter
@Builder
public class MeetingDetailDto {

    private Long meetingId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private MeetingType meetingType;
    private MeetingStatus status;

    /**
     * true면 이 모임은 그룹 기본 장소가 아닌 개별 장소를 사용한다.
     */
    private boolean placeOverridden;

    /**
     * 사용자에게 실제로 안내할 장소.
     */
    private MeetingPlaceDto meetingPlace;

    public static MeetingDetailDto from(Meeting meeting) {
        boolean overridden = meeting.getMeetingPlace() != null;
        MeetingPlace actualPlace = overridden
                ? meeting.getMeetingPlace()
                : meeting.getGroup().getMeetingPlace();

        return MeetingDetailDto.builder()
                .meetingId(meeting.getId())
                .dayOfWeek(meeting.getDayOfWeek())
                .startTime(meeting.getStartTime())
                .meetingType(meeting.getMeetingType())
                .status(meeting.getStatus())
                .placeOverridden(overridden)
                .meetingPlace(MeetingPlaceDto.from(actualPlace))
                .build();
    }
}