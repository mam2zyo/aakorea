package org.aakorea.main.group.domain;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.DayOfWeek;
import java.time.LocalTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aakorea.main.shared.Location;
import org.aakorea.main.shared.Province;

@Getter
@Entity
@Table(name = "meetings")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "province", column = @Column(name = "province", nullable = false)),
            @AttributeOverride(name = "detail", column = @Column(name = "location_detail")),
            @AttributeOverride(name = "address", column = @Column(name = "location_address")),
            @AttributeOverride(name = "latitude", column = @Column(name = "latitude")),
            @AttributeOverride(name = "longitude", column = @Column(name = "longitude"))
    })
    private Location location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false)
    private LocalTime startTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingType type;

    @Column(nullable = false)
    private boolean active;

    public Meeting(
            Group group,
            Location location,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType type,
            boolean active
    ) {
        this.group = group;
        this.location = location;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.type = type;
        this.active = active;
    }

    public void update(
            Group group,
            Location location,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType type,
            boolean active
    ) {
        this.group = group;
        this.location = location;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.type = type;
        this.active = active;
    }

    public Province getProvince() {
        return location == null ? null : location.getProvince();
    }

    public String getLocationDetail() {
        return location == null ? null : location.getDetail();
    }

    public String getLocationAddress() {
        return location == null ? null : location.getAddress();
    }

    public Double getLatitude() {
        return location == null ? null : location.getLatitude();
    }

    public Double getLongitude() {
        return location == null ? null : location.getLongitude();
    }
}
