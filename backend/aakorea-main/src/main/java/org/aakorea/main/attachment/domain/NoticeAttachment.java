package org.aakorea.main.attachment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aakorea.main.content.domain.Notice;

@Getter
@Entity
@Table(name = "notice_attachments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NoticeAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notice_id", nullable = false)
    private Notice notice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attachment_id", nullable = false)
    private Attachment attachment;

    @Column(nullable = false)
    private int orderIndex;

    public NoticeAttachment(Notice notice, Attachment attachment, int orderIndex) {
        this.notice = notice;
        this.attachment = attachment;
        this.orderIndex = orderIndex;
    }
}
