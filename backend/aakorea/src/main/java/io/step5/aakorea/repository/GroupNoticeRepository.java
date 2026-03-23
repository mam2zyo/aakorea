package io.step5.aakorea.repository;

import io.step5.aakorea.domain.GroupNotice;
import io.step5.aakorea.domain.NoticeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 그룹 공지 레포지토리.
 *
 * 만료된 공지는 DB에서 바로 삭제하지 않고,
 * 조회 시점의 현재 시각(now)을 기준으로 노출 여부를 판단한다.
 */
public interface GroupNoticeRepository extends JpaRepository<GroupNotice, Long> {

    /**
     * 특정 그룹의 현재 노출 가능한 공지 조회.
     *
     * 조건:
     * - published = true
     * - (displayStartAt is null or displayStartAt <= now)
     * - (displayEndAt is null or displayEndAt >= now)
     *
     * 상세 페이지에서는 Pageable.ofSize(n) 등으로 최근 공지만 제한 조회 가능.
     */
    @Query("""
        select n
        from GroupNotice n
        where n.group.id = :groupId
          and n.published = true
          and (n.displayStartAt is null or n.displayStartAt <= :now)
          and (n.displayEndAt is null or n.displayEndAt >= :now)
        order by
          case
            when n.type = io.step5.aakorea.domain.NoticeType.TEMP_CHANGE then 0
            when n.type = io.step5.aakorea.domain.NoticeType.CLOSED_INFO then 1
            else 2
          end,
          n.displayStartAt desc,
          n.createdAt desc
    """)
    List<GroupNotice> findActiveNotices(Long groupId, LocalDateTime now, Pageable pageable);

    /**
     * 특정 그룹의 현재 노출 가능한 공지 중, 특정 유형만 조회.
     * 예: TEMP_CHANGE 공지만 별도 조회
     */
    @Query("""
        select n
        from GroupNotice n
        where n.group.id = :groupId
          and n.type = :type
          and n.published = true
          and (n.displayStartAt is null or n.displayStartAt <= :now)
          and (n.displayEndAt is null or n.displayEndAt >= :now)
        order by n.displayStartAt desc, n.createdAt desc
    """)
    List<GroupNotice> findActiveNoticesByType(
            Long groupId,
            NoticeType type,
            LocalDateTime now,
            Pageable pageable
    );

    /**
     * 특정 그룹의 전체 공지 조회.
     * 관리자 화면 등에서 사용.
     */
    @Query("""
        select n
        from GroupNotice n
        where n.group.id = :groupId
        order by n.createdAt desc
    """)
    List<GroupNotice> findAllNoticesByGroupId(Long groupId);

    /**
     * 특정 그룹의 게시 중(published=true) 공지 전체 조회.
     * 관리자 화면에서 현재 게시 상태 점검용으로 사용 가능.
     */
    @Query("""
        select n
        from GroupNotice n
        where n.group.id = :groupId
          and n.published = true
        order by n.createdAt desc
    """)
    List<GroupNotice> findPublishedNoticesByGroupId(Long groupId);

    /**
     * 특정 그룹의 만료된 공지 조회.
     * 필요 시 관리자 화면에서 정리/보관 확인용으로 사용.
     */
    @Query("""
        select n
        from GroupNotice n
        where n.group.id = :groupId
          and n.displayEndAt is not null
          and n.displayEndAt < :now
        order by n.displayEndAt desc
    """)
    List<GroupNotice> findExpiredNotices(Long groupId, LocalDateTime now, Pageable pageable);
}