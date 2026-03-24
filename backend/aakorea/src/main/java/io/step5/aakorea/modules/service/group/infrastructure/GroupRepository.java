package io.step5.aakorea.modules.service.group.infrastructure;

import io.step5.aakorea.modules.service.district.domain.District;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Group 疫꿸퀡??CRUD + 疫꿸퀡??鈺곌퀬???Repository.
 */
public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findByProvinceOrderByNameAsc(Province province);

    List<Group> findByDistrict_IdOrderByNameAsc(Long districtId);

    List<Group> findByDistrictOrderByNameAsc(District district);

    List<Group> findByNameContainingIgnoreCaseOrderByNameAsc(String keyword);

    /**
     * 域밸챶竊??怨멸쉭 鈺곌퀬???
     * 疫꿸퀡???關??meetingPlace)????ｍ뜞 嚥≪뮆逾??뺣뼄.
     */
    @EntityGraph(attributePaths = {"meetingPlace"})
    Optional<Group> findWithMeetingPlaceById(Long id);

    /**
     * 域밸챶竊??怨멸쉭 鈺곌퀬???
     * 疫꿸퀡???關??+ ?類?┛ 筌뤴뫁??+ ?類?┛ 筌뤴뫁???揶쏆뮆???關??override繹먮슣? ??ｍ뜞 嚥≪뮆逾??뺣뼄.
     *
     * ?怨멸쉭 ??륁뵠筌왖?癒?퐣 域밸챶竊?疫꿸퀡???關??? 揶?筌뤴뫁?????쇱젫 ?關?쇘몴???ｍ뜞 癰귣똻肉т빳????醫롮뒠??롫뼄.
     */
    @EntityGraph(attributePaths = {"meetingPlace", "meetings", "meetings.meetingPlace"})
    Optional<Group> findDetailById(Long id);
}
