package io.step5.aakorea.repository;

import io.step5.aakorea.domain.Meeting;
import io.step5.aakorea.domain.Province;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    /**
     * 특정 시/도에서 특정 요일에 열리는 모임 조회.
     *
     * 화면 표시 시 다음 정보가 바로 필요할 가능성이 높다.
     * - meeting.meetingPlace (개별 장소 override)
     * - meeting.group
     * - meeting.group.meetingPlace (기본 장소)
     *
     * 따라서 EntityGraph로 함께 로딩한다.
     */
    @EntityGraph(attributePaths = {"group", "group.meetingPlace", "meetingPlace"})
    List<Meeting> findByGroup_ProvinceAndDayOfWeekOrderByStartTimeAsc(
            Province province,
            DayOfWeek dayOfWeek
    );

    /**
     * 특정 그룹의 정기 모임 목록 조회.
     * 그룹 상세 화면에서 함께 보여주기 좋다.
     */
    @EntityGraph(attributePaths = {"meetingPlace", "group", "group.meetingPlace"})
    List<Meeting> findByGroup_IdOrderByDayOfWeekAscStartTimeAsc(Long groupId);
}