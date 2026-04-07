package org.aakorea.main.auth.infrastructure;

import java.util.Collection;
import java.util.List;
import org.aakorea.main.auth.domain.AdminUserManagementEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserManagementEventRepository extends JpaRepository<AdminUserManagementEvent, Long> {

    List<AdminUserManagementEvent> findAllByAdminUser_IdInOrderByCreatedAtDesc(Collection<Long> adminUserIds);
}
