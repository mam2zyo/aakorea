package org.aakorea.main.organization.infrastructure;

import java.util.List;
import org.aakorea.main.organization.domain.District;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistrictRepository extends JpaRepository<District, Long> {

    List<District> findAllByOrderByIdAsc();
}
