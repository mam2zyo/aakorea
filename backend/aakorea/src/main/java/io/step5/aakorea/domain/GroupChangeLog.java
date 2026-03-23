package io.step5.aakorea.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 그룹 변경 이력.
 *
 * 초기에는 단순 텍스트 로그로 시작하는 것이 적절하다.
 * 예:
 * - 연락처 변경
 * - 모임 시간 변경
 * - District 변경
 * - 공지 등록
 *
 * 나중에 필요하면 fieldName / oldValue / newValue 같은 구조화된 필드를 추가할 수 있다.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "group_change_log")
public class GroupChangeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 변경 대상 그룹.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    /**
     * 변경 요약.
     * 상세 페이지에서 최근 변경사항으로 노출할 수 있는 수준의 문구.
     */
    @Column(nullable = false, length = 200)
    private String summary;

    /**
     * 필요 시 더 자세한 설명을 저장.
     */
    @Column(columnDefinition = "TEXT")
    private String detail;

    /**
     * 변경 수행자 표시용 문자열.
     * 초기에는 GSR nickname 또는 admin 식별자 정도로 저장 가능.
     */
    @Column(length = 100)
    private String changedBy;

    /**
     * 사용자 상세 페이지 노출 여부.
     * 내부 운영 로그와 사용자 노출 로그를 분리할 수 있다.
     */
    @Column(nullable = false)
    private boolean visibleToPublic = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}