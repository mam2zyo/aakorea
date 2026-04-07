package org.aakorea.main.theme.application;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.aakorea.main.common.error.FieldValidationException;

public final class PublicThemeCatalog {

    public static final String DEFAULT_THEME_ID = "classic";

    private static final List<ThemeOption> THEMES = List.of(
            new ThemeOption("classic", "기본형", "현재 공개 사이트의 기본 look and feel입니다."),
            new ThemeOption("harbor", "Harbor", "차분한 청록 계열과 밝은 바탕을 쓰는 대안 테마입니다.")
    );

    private static final Map<String, ThemeOption> THEME_MAP = THEMES.stream()
            .collect(Collectors.toUnmodifiableMap(ThemeOption::themeId, theme -> theme));

    private PublicThemeCatalog() {
    }

    public static boolean isSupportedThemeId(String themeId) {
        return THEME_MAP.containsKey(themeId);
    }

    public static String normalizeThemeId(String themeId, String fieldName) {
        if (themeId == null || themeId.isBlank()) {
            throw FieldValidationException.badRequest(fieldName, fieldName + " is required");
        }

        String normalizedThemeId = themeId.trim();
        if (!isSupportedThemeId(normalizedThemeId)) {
            throw FieldValidationException.badRequest(fieldName, fieldName + " is invalid");
        }

        return normalizedThemeId;
    }

    public static String normalizeStoredThemeId(String themeId) {
        return isSupportedThemeId(themeId) ? themeId : DEFAULT_THEME_ID;
    }

    public static List<ThemeOption> listThemes() {
        return THEMES;
    }

    public record ThemeOption(String themeId, String label, String description) {
    }
}
