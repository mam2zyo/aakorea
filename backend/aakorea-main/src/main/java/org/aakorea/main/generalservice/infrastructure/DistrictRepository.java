package org.aakorea.main.generalservice.infrastructure;

import java.util.List;
import org.aakorea.main.generalservice.domain.District;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistrictRepository extends JpaRepository<District, Long> {

    List<District> findAllByOrderByIdAsc();
}
