package org.aakorea.main.group.domain;

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
import org.aakorea.main.generalservice.domain.District;

@Getter
@Entity
@Table(name = "groups")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(nullable = false)
    private String name;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "location_address")
    private String locationAddress;

    @Column(length = 4000)
    private String introduction;

    @Column(length = 4000)
    private String notice;

    @Column(name = "change_summary", length = 4000)
    private String changeSummary;

    public Group(District district, String name) {
        this(district, name, null, null, null, null, null);
    }

    public Group(
            District district,
            String name,
            String locationName,
            String locationAddress,
            String introduction,
            String notice,
            String changeSummary
    ) {
        this.district = district;
        this.name = name;
        this.locationName = locationName;
        this.locationAddress = locationAddress;
        this.introduction = introduction;
        this.notice = notice;
        this.changeSummary = changeSummary;
    }

    public void update(District district, String name) {
        update(district, name, locationName, locationAddress, introduction, notice, changeSummary);
    }

    public void update(
            District district,
            String name,
            String locationName,
            String locationAddress,
            String introduction,
            String notice,
            String changeSummary
    ) {
        this.district = district;
        this.name = name;
        this.locationName = locationName;
        this.locationAddress = locationAddress;
        this.introduction = introduction;
        this.notice = notice;
        this.changeSummary = changeSummary;
    }
}
