package org.aakorea.core.attachment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aakorea.core.content.domain.ContentPage;

/**
 * ContentPage에 종속된 보조 자산(이미지, 다운로드용 문서 등)을 관리하기 위한 브릿지 엔터티입니다.
 * 컨텐츠 본문(Body) 파일과는 별개로 관리되며, 페이지 하단 첨부파일 목록 구성 등에 사용됩니다.
 */
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
