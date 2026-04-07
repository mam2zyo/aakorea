package org.aakorea.main.theme.application;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.theme.domain.PublicThemeSetting;
import org.aakorea.main.theme.infrastructure.PublicThemeSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicThemeService {

    private final PublicThemeSettingRepository publicThemeSettingRepository;

    @Transactional
    public PublicThemeData getPublicTheme() {
        PublicThemeSetting setting = getOrCreateSetting();
        return new PublicThemeData(normalizeStoredThemeId(setting.getActiveThemeId()));
    }

    @Transactional
    public PublicThemeAdminData getAdminThemeState() {
        return toAdminData(getOrCreateSetting());
    }

    @Transactional
    public PublicThemeAdminData saveDraftTheme(String themeId) {
        PublicThemeSetting setting = getOrCreateSetting();
        setting.saveDraft(PublicThemeCatalog.normalizeThemeId(themeId, "themeId"), now());
        return toAdminData(setting);
    }

    @Transactional
    public PublicThemeAdminData publishDraftTheme() {
        PublicThemeSetting setting = getOrCreateSetting();
        normalizeStoredThemeId(setting.getActiveThemeId());
        normalizeStoredThemeId(setting.getDraftThemeId());

        if (setting.hasUnpublishedDraft()) {
            setting.publish(now());
        }

        return toAdminData(setting);
    }

    @Transactional
    public PublicThemeAdminData rollbackTheme() {
        PublicThemeSetting setting = getOrCreateSetting();
        String rollbackThemeId = setting.getPreviousThemeId();
        if (rollbackThemeId == null || rollbackThemeId.isBlank()) {
            throw FieldValidationException.conflict("previousThemeId", "rollback target is not available");
        }

        setting.rollback(now());
        return toAdminData(setting);
    }

    private PublicThemeSetting getOrCreateSetting() {
        return publicThemeSettingRepository.findTopByOrderByIdAsc()
                .orElseGet(() -> publicThemeSettingRepository.save(PublicThemeSetting.createDefault(
                        PublicThemeCatalog.DEFAULT_THEME_ID,
                        now())));
    }

    private PublicThemeAdminData toAdminData(PublicThemeSetting setting) {
        String activeThemeId = normalizeStoredThemeId(setting.getActiveThemeId());
        String draftThemeId = normalizeStoredThemeId(setting.getDraftThemeId());
        String previousThemeId = setting.getPreviousThemeId() == null || setting.getPreviousThemeId().isBlank()
                ? null
                : normalizeStoredThemeId(setting.getPreviousThemeId());

        return new PublicThemeAdminData(
                activeThemeId,
                draftThemeId,
                previousThemeId,
                !activeThemeId.equals(draftThemeId),
                setting.getPublishedAt(),
                setting.getUpdatedAt());
    }

    private String normalizeStoredThemeId(String themeId) {
        return PublicThemeCatalog.normalizeStoredThemeId(themeId);
    }

    private LocalDateTime now() {
        return LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }

    public record PublicThemeData(String activeThemeId) {
    }

    public record PublicThemeAdminData(
            String activeThemeId,
            String draftThemeId,
            String previousThemeId,
            boolean hasUnpublishedDraft,
            LocalDateTime publishedAt,
            LocalDateTime updatedAt
    ) {
    }
}
