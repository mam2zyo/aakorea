package io.step5.aakorea.modules.general.admin.notice.domain;

import io.step5.aakorea.modules.general.admin.group.domain.Group;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 域밸챶竊??怨멸쉭 ?遺얇늺???紐꾪뀱??롫뮉 ?⑤벊?.
 *
 * 筌띾슢利???DB?癒?퐣 ?癒?짗 ?????? ??꾪?
 * 鈺곌퀬??鈺곌퀗援?癒?퐣 displayStartAt / displayEndAt 疫꿸퀣???곗쨮 ?紐꾪뀱 ??????癒?뼊??뺣뼄.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "group_notice")
public class GroupNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ?⑤벊? ????域밸챶竊?
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    /**
     * ?⑤벊? ??뺛걠.
     * ??댭?疫뀀챷? ??? ?遺용튋???얜㈇?꾤몴?亦낅슣??
     */
    @Column(nullable = false, length = 100)
    private String title;

    /**
     * ?⑤벊? 癰귣챶揆.
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoticeType type = NoticeType.GENERAL;

    /**
     * 野껊슣?????.
     * ??곸겫?癒? 沃섎챶???臾믨쉐??紐€???쑨?у첎??怨밴묶嚥???????덈뼄.
     */
    @Column(nullable = false)
    private boolean published = true;

    /**
     * ?紐꾪뀱 ??뽰삂 ??볦퍟.
     * null????筌앸맩???紐꾪뀱 揶쎛?關?앮에?揶쏄쑴竊?
     */
    private LocalDateTime displayStartAt;

    /**
     * ?紐꾪뀱 ?ル굝利???볦퍟.
     * null?????ル굝利???볦퍟 ??곸뵠 ?④쑴???紐꾪뀱 揶쎛??
     */
    private LocalDateTime displayEndAt;

    /**
     * ?臾믨쉐 ??볦퍟.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 筌띾뜆?筌???륁젟 ??볦퍟.
     */
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
