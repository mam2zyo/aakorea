package org.aakorea.main.organization.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "group_contacts")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GroupContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private boolean active;

    public GroupContact(Group group, String phone, boolean active) {
        this.group = group;
        this.phone = phone;
        this.active = active;
    }

    public void update(String phone, boolean active) {
        this.phone = phone;
        this.active = active;
    }
}
