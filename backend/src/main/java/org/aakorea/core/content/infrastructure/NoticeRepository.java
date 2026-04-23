package org.aakorea.core.content.infrastructure;

import java.util.List;
import java.util.Optional;
import org.aakorea.core.content.domain.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findAllByOrderByPublishedAtDescIdDesc();

    List<Notice> findAllByPublishedTrueOrderByPublishedAtDescIdDesc();

    Optional<Notice> findByIdAndPublishedTrue(Long id);
}
