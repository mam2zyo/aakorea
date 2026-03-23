package io.step5.aakorea.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 정기 모임 요일.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    /**
     * 모임 시작 시간.
     */
    @Column(nullable = false)
    private LocalTime startTime;

    /**
     * 공개 / 비공개 / 혼합 여부.
     * 초기 검색 화면에서는 필터로 사용하지 않고,
     * 상세 페이지에서 설명과 함께 안내한다.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingType meetingType;

    /**
     * 정기 모임 운영 상태.
     *
     * ACTIVE    : 정상 운영
     * SUSPENDED : 정기 모임을 일시적으로 하지 않는 상태
     *
     * 검색 결과에는 ACTIVE, SUSPENDED 둘 다 포함하고,
     * 프론트에서 SUSPENDED를 별도 시각 처리한다.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingStatus status;

    /**
     * 이 모임이 속한 그룹.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    /**
     * 특정 모임 전용 장소.
     *
     * 대부분의 경우 null이며, null이면 Group의 기본 meetingPlace를 사용한다.
     * 예외적으로 요일별/모임별 장소가 다른 경우에만 지정한다.
     *
     * 예:
     * - 화요일 모임은 1층
     * - 목요일 모임은 4층
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "meeting_place_id")
    private MeetingPlace meetingPlace;
}