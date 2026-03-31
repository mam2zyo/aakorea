package org.aakorea.main.organization.infrastructure;

import java.util.List;
import org.aakorea.main.organization.domain.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findAllByOrderByIdAsc();

    List<Group> findAllByDistrict_IdOrderByIdAsc(Long districtId);

    List<Group> findAllByActiveOrderByIdAsc(boolean active);

    List<Group> findAllByDistrict_IdAndActiveOrderByIdAsc(Long districtId, boolean active);
}
