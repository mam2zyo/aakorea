package io.step5.aakorea.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class GSR {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nickname;

    private String phone;

    private String mailingAddress;

    @Column(unique = true)
    private String email;

    private String password;

    // GSR 한 명이 여러 그룹을 담당할 수 있는 구조라면 아래와 같이 추가 가능합니다.
    @OneToMany(mappedBy = "gsr")
    private List<Group> groups = new ArrayList<>();
}