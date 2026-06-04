package org.aakorea.core.common.audit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "domain_change_logs")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DomainChangeLog extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", nullable = false, length = 100)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChangeAction action;

    @Column(name = "changed_fields", columnDefinition = "TEXT")
    private String changedFields;

    @Column(name = "entity_label")
    private String entityLabel;

    public DomainChangeLog(String entityType, Long entityId, ChangeAction action, String changedFields, String entityLabel) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.action = action;
        this.changedFields = changedFields;
        this.entityLabel = entityLabel;
    }
}
