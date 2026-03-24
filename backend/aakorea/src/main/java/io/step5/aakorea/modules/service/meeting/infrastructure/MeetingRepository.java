package io.step5.aakorea.modules.service.meeting.infrastructure;

import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.DayOfWeek;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    /**
     * ?諭?????袁⑸퓠???諭???遺우뵬???????筌뤴뫁??鈺곌퀬??
     *
     * ?遺얇늺 ??뽯뻻 ????쇱벉 ?類ｋ궖揶쎛 獄쏅뗀以??袁⑹뒄??揶쎛?關苑???誘⑸뼄.
     * - meeting.meetingPlace (揶쏆뮆???關??override)
     * - meeting.group
     * - meeting.group.meetingPlace (疫꿸퀡???關??
     *
     * ?怨뺤뵬??EntityGraph嚥???ｍ뜞 嚥≪뮆逾??뺣뼄.
     */
    @EntityGraph(attributePaths = {"group", "group.meetingPlace", "meetingPlace"})
    List<Meeting> findByGroup_ProvinceAndDayOfWeekOrderByStartTimeAsc(
            Province province,
            DayOfWeek dayOfWeek
    );

    /**
     * ?諭??域밸챶竊???類?┛ 筌뤴뫁??筌뤴뫖以?鈺곌퀬??
     * 域밸챶竊??怨멸쉭 ?遺얇늺?癒?퐣 ??ｍ뜞 癰귣똻肉т틠?⑤┛ ?ル뿫??
     */
    @EntityGraph(attributePaths = {"meetingPlace", "group", "group.meetingPlace"})
    List<Meeting> findByGroup_IdOrderByDayOfWeekAscStartTimeAsc(Long groupId);
}
