package io.step5.aakorea.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "aa_group")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 동일/유사 이름 그룹 가능성을 고려해 unique 제약은 두지 않음.
     */
    @Column(nullable = false)
    private String name;

    private LocalDate startDate;

    // 그룹 공식 연락처
    private String contactAddress;
    private String contactEmail;
    private String contactPhone;

    /**
     * 사용자 검색용 행정구역.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Province province;

    /**
     * A.A. 조직 운영 단위.
     * Province와 1:1 대응되지 않을 수 있다.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gsr_id")
    private GSR gsr;

    /**
     * 그룹의 기본 모임 장소.
     *
     * 대부분의 경우 이 장소를 사용한다.
     * 특정 Meeting에 별도 장소가 지정되지 않았다면 이 값을 사용한다.
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
    @JoinColumn(name = "meeting_place_id", nullable = false)
    private MeetingPlace meetingPlace;

    /**
     * 그룹 상세 페이지에 노출되는 공지.
     * 임시 장소 변경, 휴무 안내, 참석 전 연락 안내 등에 사용.
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupNotice> notices = new ArrayList<>();

    /**
     * 그룹 변경 이력.
     * 상세 페이지에는 최근 10개 정도만 선택적으로 노출 가능.
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<GroupChangeLog> changeLogs = new ArrayList<>();

    /**
     * 하나의 그룹은 여러 정기 모임을 가질 수 있다.
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Meeting> meetings = new ArrayList<>();
}