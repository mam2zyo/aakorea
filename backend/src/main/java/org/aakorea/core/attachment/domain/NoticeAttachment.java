package org.aakorea.core.attachment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aakorea.core.content.domain.Notice;

/**
 * Notice(공지사항)에 종속된 첨부파일을 관리하기 위한 브릿지 엔터티입니다.
 * 자산 재사용성과 노출 순서(orderIndex) 관리를 위해 브릿지 구조를 사용합니다.
 */
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
