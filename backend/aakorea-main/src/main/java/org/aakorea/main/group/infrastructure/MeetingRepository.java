package org.aakorea.main.group.infrastructure;

import java.util.List;
import org.aakorea.main.group.domain.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MeetingRepository extends JpaRepository<Meeting, Long>, JpaSpecificationExecutor<Meeting> {

    List<Meeting> findAllByGroup_IdAndActiveTrueOrderByIdAsc(Long groupId);

    boolean existsByGroup_Id(Long groupId);

    void deleteAllByGroup_Id(Long groupId);
}
