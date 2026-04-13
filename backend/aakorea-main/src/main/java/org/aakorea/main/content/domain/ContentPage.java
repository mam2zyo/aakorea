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

import org.aakorea.main.common.audit.AuditFields;

@Getter
@Entity
@Table(name = "content_pages")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContentPage extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_key", nullable = false, unique = true)
    private String key;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "original_file_name")
    private String originalFileName;

    public ContentPage(String key, String title, boolean published, String originalFileName) {
        this.key = key;
        this.title = title;
        this.published = published;
        this.originalFileName = originalFileName;
    }

    public void update(String key, String title, boolean published, String originalFileName) {
        this.key = key;
        this.title = title;
        this.published = published;
        if (originalFileName != null) {
            this.originalFileName = originalFileName;
        }
    }
}
