package org.aakorea.auth.infrastructure;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.aakorea.auth.domain.Role;
import org.aakorea.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByIdIn(Collection<Long> ids);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByRoleAndActiveTrue(Role role);
}
