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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aakorea.core.common.audit.AuditFields;

@Getter
@Entity
@Table(name = "admin_user_management_events")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserManagementEvent extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 60)
    private UserManagementEventType eventType;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_role", length = 40)
    private Role previousRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "next_role", length = 40)
    private Role nextRole;

    @Enumerated(EnumType.STRING)
    @Column(length = 80)
    private Permission permission;

    private UserManagementEvent(
            User user,
            UserManagementEventType eventType,
            Role previousRole,
            Role nextRole,
            Permission permission
    ) {
        this.user = user;
        this.eventType = eventType;
        this.previousRole = previousRole;
        this.nextRole = nextRole;
        this.permission = permission;
    }

    public static UserManagementEvent registered(User user) {
        return new UserManagementEvent(
                user,
                UserManagementEventType.REGISTERED,
                null,
                user.getRole(),
                null);
    }

    public static UserManagementEvent accountCreated(User user, Role nextRole) {
        return new UserManagementEvent(
                user,
                UserManagementEventType.ACCOUNT_CREATED,
                null,
                nextRole,
                null);
    }

    public static UserManagementEvent approved(User user) {
        return new UserManagementEvent(
                user,
                UserManagementEventType.APPROVED,
                null,
                user.getRole(),
                null);
    }

    public static UserManagementEvent suspended(User user) {
        return new UserManagementEvent(
                user,
                UserManagementEventType.SUSPENDED,
                null,
                user.getRole(),
                null);
    }

    public static UserManagementEvent reactivated(User user) {
        return new UserManagementEvent(
                user,
                UserManagementEventType.REACTIVATED,
                null,
                user.getRole(),
                null);
    }

    public static UserManagementEvent roleChanged(
            User user,
            Role previousRole,
            Role nextRole
    ) {
        return new UserManagementEvent(
                user,
                UserManagementEventType.ROLE_CHANGED,
                previousRole,
                nextRole,
                null);
    }

    public static UserManagementEvent permissionGranted(
            User user,
            Permission permission
    ) {
        return new UserManagementEvent(
                user,
                UserManagementEventType.PERMISSION_GRANTED,
                null,
                user.getRole(),
                permission);
    }

    public static UserManagementEvent permissionRevoked(
            User user,
            Permission permission
    ) {
        return new UserManagementEvent(
                user,
                UserManagementEventType.PERMISSION_REVOKED,
                null,
                user.getRole(),
                permission);
    }
}
