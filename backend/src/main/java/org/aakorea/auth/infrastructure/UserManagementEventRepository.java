package org.aakorea.auth.infrastructure;

import java.util.Collection;
import java.util.List;
import org.aakorea.auth.domain.UserManagementEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserManagementEventRepository extends JpaRepository<UserManagementEvent, Long> {

    List<UserManagementEvent> findAllByUser_IdInOrderByCreatedAtDesc(Collection<Long> userIds);
}
