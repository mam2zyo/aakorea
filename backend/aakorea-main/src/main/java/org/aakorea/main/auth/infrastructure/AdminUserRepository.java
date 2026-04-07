package org.aakorea.main.auth.infrastructure;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.aakorea.main.auth.domain.AdminRole;
import org.aakorea.main.auth.domain.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    List<AdminUser> findAllByIdIn(Collection<Long> ids);

    Optional<AdminUser> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByRoleAndActiveTrue(AdminRole role);
}
