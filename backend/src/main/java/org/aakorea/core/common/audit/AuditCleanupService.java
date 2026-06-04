package org.aakorea.core.common.audit;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditCleanupService {

    private final DomainChangeLogRepository domainChangeLogRepository;

    /**
     * 매일 오전 3시에 실행되어 3개월이 지난 로그 데이터를 삭제합니다.
     */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupOldLogs() {
        LocalDateTime threshold = LocalDateTime.now().minusMonths(3);
        log.info("Starting audit log cleanup. Removing logs older than {}", threshold);
        domainChangeLogRepository.deleteAllByCreatedAtBefore(threshold);
        log.info("Audit log cleanup completed.");
    }
}
