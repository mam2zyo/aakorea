package org.aakorea.main.group.infrastructure;

import java.util.List;
import org.aakorea.main.group.domain.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findAllByOrderByIdAsc();

    List<Group> findAllByDistrict_IdOrderByIdAsc(Long districtId);
}
