package io.step5.aakorea.modules.service.notice.infrastructure;

import io.step5.aakorea.modules.service.notice.domain.GroupNotice;
import io.step5.aakorea.modules.service.notice.domain.NoticeType;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * 域밸챶竊??⑤벊? ??딅７筌왖?醫듼봺.
 *
 * 筌띾슢利???⑤벊???DB?癒?퐣 獄쏅뗀以??????? ??꾪?
 * 鈺곌퀬????뽰젎???袁⑹삺 ??볦퍟(now)??疫꿸퀣???곗쨮 ?紐꾪뀱 ??????癒?뼊??뺣뼄.
 */
public interface GroupNoticeRepository extends JpaRepository<GroupNotice, Long> {

    /**
     * ?諭??域밸챶竊???袁⑹삺 ?紐꾪뀱 揶쎛?館釉??⑤벊? 鈺곌퀬??
     *
     * 鈺곌퀗援?
     * - published = true
     * - (displayStartAt is null or displayStartAt <= now)
     * - (displayEndAt is null or displayEndAt >= now)
     *
     * ?怨멸쉭 ??륁뵠筌왖?癒?퐣??Pageable.ofSize(n) ?源놁몵嚥?筌ㅼ뮄???⑤벊?筌???쀫립 鈺곌퀬??揶쎛??
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
            when n.type = io.step5.aakorea.modules.service.notice.domain.NoticeType.TEMP_CHANGE then 0
            when n.type = io.step5.aakorea.modules.service.notice.domain.NoticeType.CLOSED_INFO then 1
            else 2
          end,
          n.displayStartAt desc,
          n.createdAt desc
    """)
    List<GroupNotice> findActiveNotices(Long groupId, LocalDateTime now, Pageable pageable);

    /**
     * ?諭??域밸챶竊???袁⑹삺 ?紐꾪뀱 揶쎛?館釉??⑤벊? 餓? ?諭???醫륁굨筌?鈺곌퀬??
     * ?? TEMP_CHANGE ?⑤벊?筌?癰귢쑬猷?鈺곌퀬??
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
     * ?諭??域밸챶竊???袁⑷퍥 ?⑤벊? 鈺곌퀬??
     * ?온?귐딆쁽 ?遺얇늺 ?源녿퓠??????
     */
    @Query("""
        select n
        from GroupNotice n
        where n.group.id = :groupId
        order by n.createdAt desc
    """)
    List<GroupNotice> findAllNoticesByGroupId(Long groupId);

    /**
     * ?諭??域밸챶竊??野껊슣??餓?published=true) ?⑤벊? ?袁⑷퍥 鈺곌퀬??
     * ?온?귐딆쁽 ?遺얇늺?癒?퐣 ?袁⑹삺 野껊슣???怨밴묶 ?癒???뱀몵嚥?????揶쎛??
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
     * ?諭??域밸챶竊??筌띾슢利???⑤벊? 鈺곌퀬??
     * ?袁⑹뒄 ???온?귐딆쁽 ?遺얇늺?癒?퐣 ?類ｂ봺/癰귣떯? ?類ㅼ뵥??뱀몵嚥?????
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
