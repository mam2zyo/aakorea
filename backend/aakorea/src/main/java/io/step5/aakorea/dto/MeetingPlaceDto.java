package io.step5.aakorea.dto;

import io.step5.aakorea.domain.MeetingPlace;
import lombok.Builder;
import lombok.Getter;

/**
 * 모임 장소 DTO.
 *
 * Group 기본 장소와 Meeting 개별 override 장소 모두 같은 형태로 내려줄 수 있다.
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