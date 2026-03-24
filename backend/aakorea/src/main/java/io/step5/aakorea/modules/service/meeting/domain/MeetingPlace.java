package io.step5.aakorea.modules.service.meeting.domain;

import io.step5.aakorea.modules.service.group.domain.Group;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 筌뤴뫁???關???類ｋ궖.
 *
 * ???봔?브쑴??野껋럩??Group??疫꿸퀡???關?쇗에??????랁?
 * ??됱뇚?怨몄몵嚥??諭??Meeting??癰귢쑬猷??關?쇘몴?揶쎛筌왖??野껋럩??override ??몃즲嚥≪뮆猷??????뺣뼄.
 *
 * ??
 * - Group.meetingPlace : 疫꿸퀡???關??
 * - Meeting.meetingPlace : null ????域밸챶竊?疫꿸퀡???關??????
 * - Meeting.meetingPlace : null ???袁⑤빍筌?????筌뤴뫁???袁⑹뒠 ?關??????
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
     * ?袁⑥쨮筌뤿굞竊??
     * 筌왖??API ?怨뺣짗 獄??袁⑺뒄 疫꿸퀡而?疫꿸퀡???疫꿸퀣? 雅뚯눘?쇗에??????뺣뼄.
     */
    @Column(nullable = false)
    private String roadAddress;

    /**
     * 椰꾨?窺筌? 筌? ?紐꾨땾 ???怨멸쉭 ?袁⑺뒄.
     * ?? 癰귣㈇? 4筌? ?대Ŋ?곫꽴? 101??
     */
    @Column(nullable = false)
    private String detailAddress;

    /**
     * 揶쏄쑬?????덇땀??
     * ?? ?袁ⓓ???롡봺甕곗쥙?????곸뒠 / 雅뚯눘媛??椰꾨?窺 ??쎈젶 揶쎛??
     */
    @Column(length = 500)
    private String guide;

    /**
     * ?袁⑤즲.
     * 筌왖????뽯뻻, 椰꾧퀡???④쑴沅??源녿퓠 ?????뺣뼄.
     */
    @Column(nullable = false)
    private Double latitude;

    /**
     * 野껋럥猷?
     * 筌왖????뽯뻻, 椰꾧퀡???④쑴沅??源녿퓠 ?????뺣뼄.
     */
    @Column(nullable = false)
    private Double longitude;
}
