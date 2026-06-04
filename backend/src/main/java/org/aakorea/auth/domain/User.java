package org.aakorea.auth.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aakorea.core.common.audit.AuditFields;

@Getter
@Entity
@Table(name = "admin_users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private Role role;

    @Column(nullable = false)
    private boolean active;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private UserStatus status;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    public User(
            String username,
            String passwordHash,
            String displayName,
            Role role,
            boolean active
    ) {
        this(
                username,
                passwordHash,
                displayName,
                role,
                active,
                active ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
                active ? LocalDateTime.now() : null,
                null);
    }

    public User(
            String username,
            String passwordHash,
            String displayName,
            Role role,
            boolean active,
            UserStatus status,
            LocalDateTime approvedAt,
            Long approvedBy
    ) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.role = role;
        this.active = active;
        this.status = status;
        this.approvedAt = approvedAt;
        this.approvedBy = approvedBy;
    }

    public static User createBootstrap(String username, String passwordHash, String displayName) {
        return new User(
                username,
                passwordHash,
                displayName,
                Role.SYSTEM_ADMIN,
                true,
                UserStatus.ACTIVE,
                LocalDateTime.now(),
                null);
    }

    public static User registerStaff(String username, String passwordHash, String displayName) {
        return new User(
                username,
                passwordHash,
                displayName,
                Role.STAFF,
                true,
                UserStatus.PENDING_APPROVAL,
                null,
                null);
    }

    public void recordLogin(LocalDateTime loggedInAt) {
        this.lastLoginAt = loggedInAt;
    }

    public void updateManagedProfile(
            String displayName,
            Role role,
            UserStatus status,
            Long approvedBy,
            LocalDateTime approvedAt
    ) {
        this.displayName = displayName;
        this.role = role;
        applyStatus(status, approvedBy, approvedAt);
    }

    public void changePassword(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void activate() {
        applyStatus(UserStatus.ACTIVE, null, null);
    }

    public void deactivate() {
        applyStatus(UserStatus.SUSPENDED, null, null);
    }

    public UserStatus resolvedStatus() {
        if (status != null) {
            return status;
        }

        return active ? UserStatus.ACTIVE : UserStatus.SUSPENDED;
    }

    public boolean isPendingApproval() {
        return resolvedStatus() == UserStatus.PENDING_APPROVAL;
    }

    public String getEmail() {
        return username;
    }

    private void applyStatus(UserStatus nextStatus, Long nextApprovedBy, LocalDateTime nextApprovedAt) {
        this.status = nextStatus;
        this.active = nextStatus != UserStatus.SUSPENDED;

        if (nextStatus == UserStatus.ACTIVE) {
            if (this.approvedAt == null) {
                this.approvedAt = nextApprovedAt;
            }
            if (this.approvedBy == null) {
                this.approvedBy = nextApprovedBy;
            }
            return;
        }

        if (nextStatus == UserStatus.PENDING_APPROVAL) {
            this.approvedAt = null;
            this.approvedBy = null;
        }
    }
}
