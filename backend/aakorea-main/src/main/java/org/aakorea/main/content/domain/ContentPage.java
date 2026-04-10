package org.aakorea.main.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "content_pages")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContentPage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_key", nullable = false, unique = true)
    private String key;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String bodyHtml;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String bodyJson;

    @Column(nullable = false)
    private boolean published;

    public ContentPage(String key, String title, String bodyHtml, String bodyJson, boolean published) {
        this.key = key;
        this.title = title;
        this.bodyHtml = bodyHtml;
        this.bodyJson = bodyJson;
        this.published = published;
    }

    public void update(String key, String title, String bodyHtml, String bodyJson, boolean published) {
        this.key = key;
        this.title = title;
        this.bodyHtml = bodyHtml;
        this.bodyJson = bodyJson;
        this.published = published;
    }
}
