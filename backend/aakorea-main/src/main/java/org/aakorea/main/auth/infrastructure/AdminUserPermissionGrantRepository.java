package org.aakorea.main.auth.infrastructure;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.aakorea.main.auth.domain.AdminPermission;
import org.aakorea.main.auth.domain.AdminUserPermissionGrant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserPermissionGrantRepository extends JpaRepository<AdminUserPermissionGrant, Long> {

    List<AdminUserPermissionGrant> findAllByAdminUser_IdInAndRevokedAtIsNull(Collection<Long> adminUserIds);

    List<AdminUserPermissionGrant> findAllByAdminUser_IdAndRevokedAtIsNull(Long adminUserId);

    Optional<AdminUserPermissionGrant> findByAdminUser_IdAndPermissionAndRevokedAtIsNull(
            Long adminUserId,
            AdminPermission permission
    );
}
