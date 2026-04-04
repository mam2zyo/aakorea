package org.aakorea.main.group.domain;

import jakarta.persistence.Column;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Embedded;
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
import org.aakorea.main.shared.PostalContact;

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

    @Column
    private String email;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "recipient", column = @Column(name = "postal_contact_recipient")),
            @AttributeOverride(name = "postalCode", column = @Column(name = "postal_contact_postal_code")),
            @AttributeOverride(name = "roadAddress", column = @Column(name = "postal_contact_road_address")),
            @AttributeOverride(name = "detailAddress", column = @Column(name = "postal_contact_detail_address"))
    })
    private PostalContact postalContact;

    public GroupContact(
            Group group,
            String phone,
            String email,
            PostalContact postalContact
    ) {
        this.group = group;
        this.phone = phone;
        this.email = email;
        this.postalContact = postalContact;
    }

    public void update(String phone, String email, PostalContact postalContact) {
        this.phone = phone;
        this.email = email;
        this.postalContact = postalContact;
    }
}
