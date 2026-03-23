package io.step5.aakorea.repository;

import io.step5.aakorea.domain.GroupChangeLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * 그룹 변경 이력 레포지토리.
 */
public interface GroupChangeLogRepository extends JpaRepository<GroupChangeLog, Long> {

    /**
     * 특정 그룹의 공개용 변경 이력 조회.
     * 상세 페이지에서는 Pageable.ofSize(10) 등으로 최근 10개만 가져오면 된다.
     */
    @Query("""
        select l
        from GroupChangeLog l
        where l.group.id = :groupId
          and l.visibleToPublic = true
        order by l.createdAt desc
    """)
    List<GroupChangeLog> findPublicLogs(Long groupId, Pageable pageable);

    /**
     * 특정 그룹의 전체 변경 이력 조회.
     * 관리자 화면 등에서 사용.
     */
    @Query("""
        select l
        from GroupChangeLog l
        where l.group.id = :groupId
        order by l.createdAt desc
    """)
    List<GroupChangeLog> findAllLogsByGroupId(Long groupId);
}