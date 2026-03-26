package io.step5.aakorea.modules.general.admin.gsr.infrastructure;

import io.step5.aakorea.modules.general.admin.gsr.domain.GSR;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * GSR 疫꿸퀡??CRUD.
 */
public interface GSRRepository extends JpaRepository<GSR, Long> {

    Optional<GSR> findByEmail(String email);

    boolean existsByEmail(String email);
}
