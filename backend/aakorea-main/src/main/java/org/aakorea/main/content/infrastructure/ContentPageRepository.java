package org.aakorea.main.content.infrastructure;

import java.util.List;
import java.util.Optional;
import org.aakorea.main.content.domain.ContentPage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentPageRepository extends JpaRepository<ContentPage, Long> {

    List<ContentPage> findAllByOrderByIdAsc();

    Optional<ContentPage> findByKeyAndPublishedTrue(String key);

    boolean existsByKey(String key);

    boolean existsByKeyAndIdNot(String key, Long id);
}
