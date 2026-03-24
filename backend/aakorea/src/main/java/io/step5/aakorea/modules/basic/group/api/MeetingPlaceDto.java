package io.step5.aakorea.modules.basic.group.api;

import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import lombok.Builder;
import lombok.Getter;

/**
 * 筌뤴뫁???關??DTO.
 *
 * Group 疫꿸퀡???關??? Meeting 揶쏆뮆??override ?關??筌뤴뫀紐?揶쏆늿? ?類κ묶嚥?????빳?????덈뼄.
 */
@Getter
@Builder
public class MeetingPlaceDto {

    private String roadAddress;
    private String detailAddress;
    private String guide;
    private Double latitude;
    private Double longitude;

    public static MeetingPlaceDto from(MeetingPlace meetingPlace) {
        if (meetingPlace == null) {
            return null;
        }

        return MeetingPlaceDto.builder()
                .roadAddress(meetingPlace.getRoadAddress())
                .detailAddress(meetingPlace.getDetailAddress())
                .guide(meetingPlace.getGuide())
                .latitude(meetingPlace.getLatitude())
                .longitude(meetingPlace.getLongitude())
                .build();
    }
}
