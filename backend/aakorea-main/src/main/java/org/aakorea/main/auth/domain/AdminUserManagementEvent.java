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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aakorea.main.common.audit.AuditFields;

@Getter
@Entity
@Table(name = "admin_user_management_events")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUserManagementEvent extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_user_id", nullable = false)
    private AdminUser adminUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 60)
    private AdminUserManagementEventType eventType;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_role", length = 40)
    private AdminRole previousRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "next_role", length = 40)
    private AdminRole nextRole;

    @Enumerated(EnumType.STRING)
    @Column(length = 80)
    private AdminPermission permission;

    private AdminUserManagementEvent(
            AdminUser adminUser,
            AdminUserManagementEventType eventType,
            AdminRole previousRole,
            AdminRole nextRole,
            AdminPermission permission
    ) {
        this.adminUser = adminUser;
        this.eventType = eventType;
        this.previousRole = previousRole;
        this.nextRole = nextRole;
        this.permission = permission;
    }

    public static AdminUserManagementEvent registered(AdminUser adminUser) {
        return new AdminUserManagementEvent(
                adminUser,
                AdminUserManagementEventType.REGISTERED,
                null,
                adminUser.getRole(),
                null);
    }

    public static AdminUserManagementEvent accountCreated(AdminUser adminUser, AdminRole nextRole) {
        return new AdminUserManagementEvent(
                adminUser,
                AdminUserManagementEventType.ACCOUNT_CREATED,
                null,
                nextRole,
                null);
    }

    public static AdminUserManagementEvent approved(AdminUser adminUser) {
        return new AdminUserManagementEvent(
                adminUser,
                AdminUserManagementEventType.APPROVED,
                null,
                adminUser.getRole(),
                null);
    }

    public static AdminUserManagementEvent suspended(AdminUser adminUser) {
        return new AdminUserManagementEvent(
                adminUser,
                AdminUserManagementEventType.SUSPENDED,
                null,
                adminUser.getRole(),
                null);
    }

    public static AdminUserManagementEvent reactivated(AdminUser adminUser) {
        return new AdminUserManagementEvent(
                adminUser,
                AdminUserManagementEventType.REACTIVATED,
                null,
                adminUser.getRole(),
                null);
    }

    public static AdminUserManagementEvent roleChanged(
            AdminUser adminUser,
            AdminRole previousRole,
            AdminRole nextRole
    ) {
        return new AdminUserManagementEvent(
                adminUser,
                AdminUserManagementEventType.ROLE_CHANGED,
                previousRole,
                nextRole,
                null);
    }

    public static AdminUserManagementEvent permissionGranted(
            AdminUser adminUser,
            AdminPermission permission
    ) {
        return new AdminUserManagementEvent(
                adminUser,
                AdminUserManagementEventType.PERMISSION_GRANTED,
                null,
                adminUser.getRole(),
                permission);
    }

    public static AdminUserManagementEvent permissionRevoked(
            AdminUser adminUser,
            AdminPermission permission
    ) {
        return new AdminUserManagementEvent(
                adminUser,
                AdminUserManagementEventType.PERMISSION_REVOKED,
                null,
                adminUser.getRole(),
                permission);
    }
}
