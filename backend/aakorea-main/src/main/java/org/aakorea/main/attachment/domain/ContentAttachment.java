package org.aakorea.main.attachment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aakorea.main.content.domain.ContentPage;

@Getter
@Entity
@Table(name = "content_attachments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContentAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_page_id", nullable = false)
    private ContentPage contentPage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attachment_id", nullable = false)
    private Attachment attachment;

    @Column(nullable = false)
    private int orderIndex;

    public ContentAttachment(ContentPage contentPage, Attachment attachment, int orderIndex) {
        this.contentPage = contentPage;
        this.attachment = attachment;
        this.orderIndex = orderIndex;
    }
}
