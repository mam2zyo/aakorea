package io.step5.aakorea.modules.general.admin.meeting.infrastructure;

import io.step5.aakorea.modules.general.admin.meeting.domain.Meeting;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.DayOfWeek;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    /**
     * 그룹/모임 장소 정보를 함께 읽어오는 공개 검색용 조회.
     */
    @EntityGraph(attributePaths = {"group", "group.meetingPlace", "meetingPlace"})
    List<Meeting> findByGroup_ProvinceAndDayOfWeekOrderByStartTimeAsc(
            Province province,
            DayOfWeek dayOfWeek
    );

    @Query("""
        select m
        from Meeting m
        join fetch m.group g
        left join fetch g.meetingPlace
        left join fetch m.meetingPlace
        where g.province = :province
          and m.dayOfWeek = :dayOfWeek
          and m.status = io.step5.aakorea.modules.general.admin.meeting.domain.MeetingStatus.ACTIVE
        order by m.startTime asc, g.name asc
    """)
    List<Meeting> findPublicSearchResults(
            Province province,
            DayOfWeek dayOfWeek
    );

    /**
     * 그룹 상세의 정기 모임 목록 조회.
     */
    @EntityGraph(attributePaths = {"meetingPlace", "group", "group.meetingPlace"})
    List<Meeting> findByGroup_IdOrderByDayOfWeekAscStartTimeAsc(Long groupId);
}
