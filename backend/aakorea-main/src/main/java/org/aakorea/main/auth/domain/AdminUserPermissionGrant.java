package org.aakorea.main.auth.domain;

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
import org.aakorea.main.common.audit.AuditFields;

@Getter
@Entity
@Table(name = "admin_user_permission_grants")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUserPermissionGrant extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_user_id", nullable = false)
    private AdminUser adminUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 80)
    private AdminPermission permission;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @Column(name = "revoked_by")
    private Long revokedBy;

    public AdminUserPermissionGrant(AdminUser adminUser, AdminPermission permission) {
        this.adminUser = adminUser;
        this.permission = permission;
    }

    public static AdminUserPermissionGrant grant(AdminUser adminUser, AdminPermission permission) {
        return new AdminUserPermissionGrant(adminUser, permission);
    }

    public boolean isActive() {
        return revokedAt == null;
    }

    public void revoke(Long actorId, LocalDateTime revokedAt) {
        this.revokedBy = actorId;
        this.revokedAt = revokedAt;
    }
}
