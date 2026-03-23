package io.step5.aakorea.repository;

import io.step5.aakorea.domain.District;
import io.step5.aakorea.domain.Group;
import io.step5.aakorea.domain.Province;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Group 기본 CRUD + 기본 조회용 Repository.
 */
public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findByProvinceOrderByNameAsc(Province province);

    List<Group> findByDistrict_IdOrderByNameAsc(Long districtId);

    List<Group> findByDistrictOrderByNameAsc(District district);

    List<Group> findByNameContainingIgnoreCaseOrderByNameAsc(String keyword);

    /**
     * 그룹 상세 조회용.
     * 기본 장소(meetingPlace)를 함께 로딩한다.
     */
    @EntityGraph(attributePaths = {"meetingPlace"})
    Optional<Group> findWithMeetingPlaceById(Long id);

    /**
     * 그룹 상세 조회용.
     * 기본 장소 + 정기 모임 + 정기 모임의 개별 장소 override까지 함께 로딩한다.
     *
     * 상세 페이지에서 그룹 기본 장소와 각 모임의 실제 장소를 함께 보여줄 때 유용하다.
     */
    @EntityGraph(attributePaths = {"meetingPlace", "meetings", "meetings.meetingPlace"})
    Optional<Group> findDetailById(Long id);
}