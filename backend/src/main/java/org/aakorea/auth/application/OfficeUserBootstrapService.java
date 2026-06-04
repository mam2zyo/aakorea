package org.aakorea.auth.application;

import lombok.RequiredArgsConstructor;
import org.aakorea.auth.domain.User;
import org.aakorea.auth.infrastructure.UserRepository;
import org.aakorea.core.common.config.OfficeAuthProperties;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OfficeUserBootstrapService {

    private static final String BOOTSTRAP_DISPLAY_NAME = "System Administrator";

    private final UserRepository userRepository;
    private final OfficeAuthProperties adminAuthProperties;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void ensureBootstrapUser() {
        String normalizedEmail = adminAuthProperties.email().trim().toLowerCase();
        userRepository.findByUsername(normalizedEmail)
                .orElseGet(() -> userRepository.save(User.createBootstrap(
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
