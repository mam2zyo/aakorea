package io.step5.aakorea.modules.general.admin.group.domain;

import io.step5.aakorea.modules.general.admin.district.domain.District;
import io.step5.aakorea.modules.general.admin.gsr.domain.GSR;
import io.step5.aakorea.modules.general.admin.meeting.domain.Meeting;
import io.step5.aakorea.modules.general.admin.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.general.admin.notice.domain.GroupNotice;
import io.step5.aakorea.modules.shared.region.domain.Province;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
     * ??덉뵬/?醫롪텢 ??已?域밸챶竊?揶쎛?關苑???⑥쥓???unique ??뽯튋?? ?癒? ??놁벉.
     */
    @Column(nullable = false)
    private String name;

    private LocalDate startDate;

    // 域밸챶竊??⑤벊???怨뺤뵭筌?
    private String contactAddress;
    private String contactEmail;
    private String contactPhone;

    /**
     * ?????野꺜??깆뒠 ??깆젟?닌딅열.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Province province;

    /**
     * A.A. 鈺곌퀣彛???곸겫 ??μ맄.
     * Province?? 1:1 ???臾먮┷筌왖 ??놁뱽 ????덈뼄.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gsr_id")
    private GSR gsr;

    /**
     * 域밸챶竊??疫꿸퀡??筌뤴뫁???關??
     *
     * ???봔?브쑴??野껋럩?????關?쇘몴??????뺣뼄.
     * ?諭??Meeting??癰귢쑬猷??關?쇔첎? 筌왖?類ｋ┷筌왖 ??녿릭??삠늺 ??揶쏅????????뺣뼄.
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
    @JoinColumn(name = "meeting_place_id", nullable = false)
    private MeetingPlace meetingPlace;

    /**
     * 域밸챶竊??怨멸쉭 ??륁뵠筌왖???紐꾪뀱??롫뮉 ?⑤벊?.
     * ?袁⑸뻻 ?關??癰궰野? ??龜 ??덇땀, 筌〓챷苑????怨뺤뵭 ??덇땀 ?源녿퓠 ????
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupNotice> notices = new ArrayList<>();

    /**
     * 域밸챶竊?癰궰野?????
     * ?怨멸쉭 ??륁뵠筌왖?癒?뮉 筌ㅼ뮄??10揶??類ｋ즲筌??醫뤾문?怨몄몵嚥??紐꾪뀱 揶쎛??
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<GroupChangeLog> changeLogs = new ArrayList<>();

    /**
     * ??롪돌??域밸챶竊?? ?????類?┛ 筌뤴뫁???揶쎛筌?????덈뼄.
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Meeting> meetings = new ArrayList<>();
}
