package io.step5.aakorea.repository;

import io.step5.aakorea.domain.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * District(A.A. 조직 운영 단위) 기본 CRUD.
 */
public interface DistrictRepository extends JpaRepository<District, Long> {

    Optional<District> findByName(String name);

    boolean existsByName(String name);
}