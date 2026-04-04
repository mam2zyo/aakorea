package org.aakorea.main.group.infrastructure;

import java.util.List;
import java.util.Optional;
import org.aakorea.main.group.domain.GroupContact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupContactRepository extends JpaRepository<GroupContact, Long> {

    List<GroupContact> findAllByOrderByIdAsc();

    List<GroupContact> findAllByGroup_IdOrderByIdAsc(Long groupId);

    boolean existsByGroup_Id(Long groupId);

    Optional<GroupContact> findFirstByGroup_IdOrderByIdAsc(Long groupId);

    void deleteAllByGroup_Id(Long groupId);
}
