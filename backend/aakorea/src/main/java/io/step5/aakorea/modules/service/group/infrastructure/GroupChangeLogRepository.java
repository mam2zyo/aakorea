package io.step5.aakorea.modules.service.group.infrastructure;

import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.group.domain.GroupChangeLog;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * 域밸챶竊?癰궰野???????딅７筌왖?醫듼봺.
 */
public interface GroupChangeLogRepository extends JpaRepository<GroupChangeLog, Long> {

    /**
     * ?諭??域밸챶竊???⑤벀而??癰궰野?????鈺곌퀬??
     * ?怨멸쉭 ??륁뵠筌왖?癒?퐣??Pageable.ofSize(10) ?源놁몵嚥?筌ㅼ뮄??10揶쏆뮆彛?揶쎛?紐꾩궎筌???뺣뼄.
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
     * ?諭??域밸챶竊???袁⑷퍥 癰궰野?????鈺곌퀬??
     * ?온?귐딆쁽 ?遺얇늺 ?源녿퓠??????
     */
    @Query("""
        select l
        from GroupChangeLog l
        where l.group.id = :groupId
        order by l.createdAt desc
    """)
    List<GroupChangeLog> findAllLogsByGroupId(Long groupId);
}
