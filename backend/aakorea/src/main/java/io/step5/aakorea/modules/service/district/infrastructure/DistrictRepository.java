package io.step5.aakorea.modules.service.district.infrastructure;

import io.step5.aakorea.modules.service.district.domain.District;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * District(A.A. 鈺곌퀣彛???곸겫 ??μ맄) 疫꿸퀡??CRUD.
 */
public interface DistrictRepository extends JpaRepository<District, Long> {

    Optional<District> findByName(String name);

    boolean existsByName(String name);
}
