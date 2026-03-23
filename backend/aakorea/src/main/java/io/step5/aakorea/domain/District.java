package io.step5.aakorea.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * A.A. 조직 운영 단위.
 *
 * Province(행정구역)와는 별도의 축이다.
 * District는 통합/분리/명칭 변경이 발생할 수 있으므로 enum이 아니라 엔티티로 관리한다.
 *
 * 예:
 * - 대구연합 + 경북연합 -> 대경연합
 * - 수도권 연합 분리
 * - 인천연합 소속 그룹이 경기 일부 지역에 존재
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "district")
public class District {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 조직 단위명.
     * 예: 인천연합, 수도권 남부 연합, 대경연합
     */
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * 해당 District에 속한 그룹들.
     */
    @OneToMany(mappedBy = "district")
    private List<Group> groups = new ArrayList<>();
}