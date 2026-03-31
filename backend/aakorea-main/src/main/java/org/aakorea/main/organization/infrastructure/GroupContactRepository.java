package org.aakorea.main.organization.infrastructure;

import java.util.List;
import java.util.Optional;
import org.aakorea.main.organization.domain.GroupContact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupContactRepository extends JpaRepository<GroupContact, Long> {

    List<GroupContact> findAllByOrderByIdAsc();

    List<GroupContact> findAllByGroup_IdOrderByIdAsc(Long groupId);

    List<GroupContact> findAllByActiveOrderByIdAsc(boolean active);

    List<GroupContact> findAllByGroup_IdAndActiveOrderByIdAsc(Long groupId, boolean active);

    Optional<GroupContact> findFirstByGroup_IdAndActiveTrueOrderByIdAsc(Long groupId);
}
