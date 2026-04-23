package org.aakorea.core.common.audit;

import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DomainChangeLogRepository extends JpaRepository<DomainChangeLog, Long> {
    
    Page<DomainChangeLog> findAllByEntityTypeAndEntityId(String entityType, Long entityId, Pageable pageable);

    Page<DomainChangeLog> findAllByEntityType(String entityType, Pageable pageable);

    void deleteAllByCreatedAtBefore(LocalDateTime threshold);
}
