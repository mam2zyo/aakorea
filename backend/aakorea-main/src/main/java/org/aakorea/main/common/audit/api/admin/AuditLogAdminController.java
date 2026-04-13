package org.aakorea.main.common.audit.api.admin;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.auth.domain.AdminUser;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.common.audit.DomainChangeLog;
import org.aakorea.main.common.audit.DomainChangeLogRepository;
import org.aakorea.main.common.response.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogAdminController {

    private final DomainChangeLogRepository domainChangeLogRepository;
    private final AdminUserRepository adminUserRepository;

    @PreAuthorize("hasAuthority('PERM_audit.view')")
    @GetMapping
    public ApiResponse<Page<AuditLogData>> getAuditLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long entityId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<DomainChangeLog> logs;
        if (entityType != null && entityId != null) {
            logs = domainChangeLogRepository.findAllByEntityTypeAndEntityId(entityType, entityId, pageable);
        } else if (entityType != null) {
            logs = domainChangeLogRepository.findAllByEntityType(entityType, pageable);
        } else {
            logs = domainChangeLogRepository.findAll(pageable);
        }

        Set<Long> userIds = logs.getContent().stream()
                .map(DomainChangeLog::getCreatedBy)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Long, String> userEmailMap = adminUserRepository.findAllByIdIn(userIds).stream()
                .collect(Collectors.toMap(AdminUser::getId, AdminUser::getUsername));

        return ApiResponse.success(logs.map(log -> toAuditLogData(log, userEmailMap.get(log.getCreatedBy()))));
    }

    private AuditLogData toAuditLogData(DomainChangeLog log, String creatorEmail) {
        return new AuditLogData(
                log.getId(),
                log.getEntityType(),
                log.getEntityId(),
                log.getAction().name(),
                log.getChangedFields(),
                log.getCreatedAt(),
                log.getCreatedBy(),
                creatorEmail,
                log.getEntityLabel()
        );
    }

    public record AuditLogData(
            Long id,
            String entityType,
            Long entityId,
            String action,
            String diff,
            LocalDateTime createdAt,
            Long createdBy,
            String creatorEmail,
            String entityLabel
    ) {
    }
}
