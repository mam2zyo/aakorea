package org.aakorea.main.theme.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "public_theme_settings")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PublicThemeSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "active_theme_id", nullable = false)
    private String activeThemeId;

    @Column(name = "draft_theme_id", nullable = false)
    private String draftThemeId;

    @Column(name = "previous_theme_id")
    private String previousThemeId;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public PublicThemeSetting(
            String activeThemeId,
            String draftThemeId,
            String previousThemeId,
            LocalDateTime publishedAt,
            LocalDateTime updatedAt
    ) {
        this.activeThemeId = activeThemeId;
        this.draftThemeId = draftThemeId;
        this.previousThemeId = previousThemeId;
        this.publishedAt = publishedAt;
        this.updatedAt = updatedAt;
    }

    public static PublicThemeSetting createDefault(String defaultThemeId, LocalDateTime now) {
        return new PublicThemeSetting(defaultThemeId, defaultThemeId, null, null, now);
    }

    public void saveDraft(String themeId, LocalDateTime changedAt) {
        this.draftThemeId = themeId;
        this.updatedAt = changedAt;
    }

    public void publish(LocalDateTime changedAt) {
        this.previousThemeId = activeThemeId;
        this.activeThemeId = draftThemeId;
        this.publishedAt = changedAt;
        this.updatedAt = changedAt;
    }

    public void rollback(LocalDateTime changedAt) {
        String rollbackThemeId = previousThemeId;
        this.previousThemeId = activeThemeId;
        this.activeThemeId = rollbackThemeId;
        this.draftThemeId = rollbackThemeId;
        this.publishedAt = changedAt;
        this.updatedAt = changedAt;
    }

    public boolean hasUnpublishedDraft() {
        return !activeThemeId.equals(draftThemeId);
    }
}
