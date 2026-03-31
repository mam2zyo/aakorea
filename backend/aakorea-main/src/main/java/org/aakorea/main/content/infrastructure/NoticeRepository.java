package org.aakorea.main.content.infrastructure;

import java.util.List;
import java.util.Optional;
import org.aakorea.main.content.domain.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findAllByOrderByPublishedAtDescIdDesc();

    List<Notice> findAllByPublishedTrueOrderByPublishedAtDescIdDesc();

    Optional<Notice> findByIdAndPublishedTrue(Long id);
}
