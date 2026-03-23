package io.step5.aakorea.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 그룹 상세 화면에 노출되는 공지.
 *
 * 만료 시 DB에서 자동 삭제하지 않고,
 * 조회 조건에서 displayStartAt / displayEndAt 기준으로 노출 여부를 판단한다.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "group_notice")
public class GroupNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 공지 대상 그룹.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    /**
     * 공지 제목.
     * 너무 길지 않은 요약용 문구를 권장.
     */
    @Column(nullable = false, length = 100)
    private String title;

    /**
     * 공지 본문.
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoticeType type = NoticeType.GENERAL;

    /**
     * 게시 여부.
     * 운영자가 미리 작성해두고 비공개 상태로 둘 수 있다.
     */
    @Column(nullable = false)
    private boolean published = true;

    /**
     * 노출 시작 시각.
     * null이면 즉시 노출 가능으로 간주.
     */
    private LocalDateTime displayStartAt;

    /**
     * 노출 종료 시각.
     * null이면 종료 시각 없이 계속 노출 가능.
     */
    private LocalDateTime displayEndAt;

    /**
     * 작성 시각.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 마지막 수정 시각.
     */
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}