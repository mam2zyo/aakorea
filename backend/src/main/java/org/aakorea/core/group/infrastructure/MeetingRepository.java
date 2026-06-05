package org.aakorea.core.group.infrastructure;

import java.util.List;
import org.aakorea.core.group.domain.Meeting;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface MeetingRepository extends JpaRepository<Meeting, Long>, JpaSpecificationExecutor<Meeting> {

    @Override
    @EntityGraph(attributePaths = {"group", "group.district"})
    List<Meeting> findAll(Specification<Meeting> spec);

    @Override
    @EntityGraph(attributePaths = {"group", "group.district"})
    List<Meeting> findAll(Specification<Meeting> spec, Sort sort);

    List<Meeting> findAllByGroup_IdOrderByIdAsc(Long groupId);

    List<Meeting> findAllByGroup_IdAndActiveTrueOrderByIdAsc(Long groupId);

    boolean existsByGroup_Id(Long groupId);

    void deleteAllByGroup_Id(Long groupId);

    @Query("""
            select m
            from Meeting m
            join fetch m.group g
            where m.location.address is not null
              and trim(m.location.address) <> ''
              and m.location.point is null
            order by m.id asc
            """)
    List<Meeting> findMeetingsMissingCoordinates();
}
