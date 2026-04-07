package org.aakorea.main.auth.application;

import lombok.RequiredArgsConstructor;
import org.aakorea.main.auth.domain.AdminUser;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.common.config.AdminAuthProperties;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OfficeUserBootstrapService {

    private static final String BOOTSTRAP_DISPLAY_NAME = "System Administrator";

    private final AdminUserRepository adminUserRepository;
    private final AdminAuthProperties adminAuthProperties;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void ensureBootstrapAdminUser() {
        String normalizedEmail = adminAuthProperties.email().trim().toLowerCase();
        adminUserRepository.findByUsername(normalizedEmail)
                .orElseGet(() -> adminUserRepository.save(AdminUser.createBootstrap(
                        normalizedEmail,
                        encodeIfNeeded(adminAuthProperties.password()),
                        BOOTSTRAP_DISPLAY_NAME)));
    }

    private String encodeIfNeeded(String configuredPassword) {
        if (configuredPassword.startsWith("{")) {
            return configuredPassword;
        }

        return passwordEncoder.encode(configuredPassword);
    }
}
