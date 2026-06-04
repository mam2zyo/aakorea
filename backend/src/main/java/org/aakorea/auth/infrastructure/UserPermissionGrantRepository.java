package org.aakorea.auth.infrastructure;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.aakorea.auth.domain.Permission;
import org.aakorea.auth.domain.UserPermissionGrant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPermissionGrantRepository extends JpaRepository<UserPermissionGrant, Long> {

    List<UserPermissionGrant> findAllByUser_IdInAndRevokedAtIsNull(Collection<Long> userIds);

    List<UserPermissionGrant> findAllByUser_IdAndRevokedAtIsNull(Long userId);

    Optional<UserPermissionGrant> findByUser_IdAndPermissionAndRevokedAtIsNull(
            Long userId,
            Permission permission
    );
}
