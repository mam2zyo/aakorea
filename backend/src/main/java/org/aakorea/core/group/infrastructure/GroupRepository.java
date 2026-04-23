package org.aakorea.core.group.infrastructure;

import java.util.List;
import org.aakorea.core.group.domain.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findAllByOrderByIdAsc();

    List<Group> findAllByDistrict_IdOrderByIdAsc(Long districtId);

    boolean existsByDistrict_Id(Long districtId);
}
