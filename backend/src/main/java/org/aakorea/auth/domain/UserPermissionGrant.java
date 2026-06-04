package org.aakorea.auth.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aakorea.core.common.audit.AuditFields;

@Getter
@Entity
@Table(name = "admin_user_permission_grants")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserPermissionGrant extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 80)
    private Permission permission;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @Column(name = "revoked_by")
    private Long revokedBy;

    public UserPermissionGrant(User user, Permission permission) {
        this.user = user;
        this.permission = permission;
    }

    public static UserPermissionGrant grant(User user, Permission permission) {
        return new UserPermissionGrant(user, permission);
    }

    public boolean isActive() {
        return revokedAt == null;
    }

    public void revoke(Long actorId, LocalDateTime revokedAt) {
        this.revokedBy = actorId;
        this.revokedAt = revokedAt;
    }
}
