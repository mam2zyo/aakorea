package io.step5.aakorea.repository;

import io.step5.aakorea.domain.GSR;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * GSR 기본 CRUD.
 */
public interface GSRRepository extends JpaRepository<GSR, Long> {

    Optional<GSR> findByEmail(String email);

    boolean existsByEmail(String email);
}