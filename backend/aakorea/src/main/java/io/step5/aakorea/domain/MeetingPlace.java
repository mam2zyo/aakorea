package io.step5.aakorea.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 모임 장소 정보.
 *
 * 대부분의 경우 Group의 기본 장소로 사용하고,
 * 예외적으로 특정 Meeting이 별도 장소를 가지는 경우 override 용도로도 사용한다.
 *
 * 예:
 * - Group.meetingPlace : 기본 장소
 * - Meeting.meetingPlace : null 이면 그룹 기본 장소 사용
 * - Meeting.meetingPlace : null 이 아니면 해당 모임 전용 장소 사용
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "meeting_place")
public class MeetingPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 도로명주소.
     * 지도 API 연동 및 위치 기반 기능의 기준 주소로 사용한다.
     */
    @Column(nullable = false)
    private String roadAddress;

    /**
     * 건물명, 층, 호수 등 상세 위치.
     * 예: 본관 4층, 교육관 101호
     */
    @Column(nullable = false)
    private String detailAddress;

    /**
     * 간단한 안내문.
     * 예: 후문 엘리베이터 이용 / 주차는 건물 뒤편 가능
     */
    @Column(length = 500)
    private String guide;

    /**
     * 위도.
     * 지도 표시, 거리 계산 등에 사용한다.
     */
    @Column(nullable = false)
    private Double latitude;

    /**
     * 경도.
     * 지도 표시, 거리 계산 등에 사용한다.
     */
    @Column(nullable = false)
    private Double longitude;
}