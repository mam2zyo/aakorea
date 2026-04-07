package org.aakorea.main.theme.infrastructure;

import java.util.Optional;
import org.aakorea.main.theme.domain.PublicThemeSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicThemeSettingRepository extends JpaRepository<PublicThemeSetting, Long> {

    Optional<PublicThemeSetting> findTopByOrderByIdAsc();
}
