package org.aakorea.main.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
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

    @Lob
    @Column(nullable = false)
    private String body;

    @Column(nullable = false)
    private boolean published;

    public ContentPage(String key, String title, String body, boolean published) {
        this.key = key;
        this.title = title;
        this.body = body;
        this.published = published;
    }
}
