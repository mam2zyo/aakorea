package org.aakorea.main.theme.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.util.Optional;
import org.aakorea.main.theme.domain.PublicThemeSetting;
import org.aakorea.main.theme.infrastructure.PublicThemeSettingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class PublicThemeServiceTest {

    @Mock
    private PublicThemeSettingRepository publicThemeSettingRepository;

    @InjectMocks
    private PublicThemeService publicThemeService;

    @Test
    void getAdminThemeStateCreatesDefaultSettingWhenMissing() {
        given(publicThemeSettingRepository.findTopByOrderByIdAsc()).willReturn(Optional.empty());
        given(publicThemeSettingRepository.save(org.mockito.ArgumentMatchers.any(PublicThemeSetting.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        PublicThemeService.PublicThemeAdminData result = publicThemeService.getAdminThemeState();

        ArgumentCaptor<PublicThemeSetting> captor = ArgumentCaptor.forClass(PublicThemeSetting.class);
        verify(publicThemeSettingRepository).save(captor.capture());

        assertThat(captor.getValue().getActiveThemeId()).isEqualTo(PublicThemeCatalog.DEFAULT_THEME_ID);
        assertThat(result.activeThemeId()).isEqualTo(PublicThemeCatalog.DEFAULT_THEME_ID);
        assertThat(result.draftThemeId()).isEqualTo(PublicThemeCatalog.DEFAULT_THEME_ID);
        assertThat(result.hasUnpublishedDraft()).isFalse();
        assertThat(result.updatedAt()).isNotNull();
    }

    @Test
    void saveDraftThemeStoresTheRequestedTheme() {
        PublicThemeSetting setting = PublicThemeSetting.createDefault(PublicThemeCatalog.DEFAULT_THEME_ID, null);
        given(publicThemeSettingRepository.findTopByOrderByIdAsc()).willReturn(Optional.of(setting));

        PublicThemeService.PublicThemeAdminData result = publicThemeService.saveDraftTheme("harbor");

        assertThat(setting.getDraftThemeId()).isEqualTo("harbor");
        assertThat(result.draftThemeId()).isEqualTo("harbor");
        assertThat(result.hasUnpublishedDraft()).isTrue();
        assertThat(result.updatedAt()).isNotNull();
    }

    @Test
    void publishDraftThemePromotesDraftAndRemembersPreviousTheme() {
        PublicThemeSetting setting = new PublicThemeSetting("classic", "harbor", null, null, null);
        given(publicThemeSettingRepository.findTopByOrderByIdAsc()).willReturn(Optional.of(setting));

        PublicThemeService.PublicThemeAdminData result = publicThemeService.publishDraftTheme();

        assertThat(setting.getActiveThemeId()).isEqualTo("harbor");
        assertThat(setting.getPreviousThemeId()).isEqualTo("classic");
        assertThat(result.activeThemeId()).isEqualTo("harbor");
        assertThat(result.previousThemeId()).isEqualTo("classic");
        assertThat(result.hasUnpublishedDraft()).isFalse();
        assertThat(result.publishedAt()).isNotNull();
    }

    @Test
    void rollbackThemeRequiresPreviousTheme() {
        PublicThemeSetting setting = new PublicThemeSetting("classic", "classic", null, null, null);
        given(publicThemeSettingRepository.findTopByOrderByIdAsc()).willReturn(Optional.of(setting));

        assertThatThrownBy(() -> publicThemeService.rollbackTheme())
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(responseStatusException.getReason()).isEqualTo("rollback target is not available");
                });
    }
}
