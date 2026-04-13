package org.aakorea.main.content.domain;

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

import org.aakorea.main.common.audit.AuditFields;

@Getter
@Entity
@Table(name = "notices")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notice extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String bodyHtml;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String bodyJson;

    @Column(nullable = false)
    private boolean published;

    private LocalDateTime publishedAt;

    public Notice(String title, String bodyHtml, String bodyJson, boolean published, LocalDateTime publishedAt) {
        this.title = title;
        this.bodyHtml = bodyHtml;
        this.bodyJson = bodyJson;
        this.published = published;
        this.publishedAt = publishedAt;
    }

    public void update(String title, String bodyHtml, String bodyJson, boolean published, LocalDateTime publishedAt) {
        this.title = title;
        this.bodyHtml = bodyHtml;
        this.bodyJson = bodyJson;
        this.published = published;
        this.publishedAt = publishedAt;
    }
}
