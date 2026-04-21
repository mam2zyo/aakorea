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

import org.aakorea.main.common.audit.AuditFields;

@Getter
@Entity
@Table(name = "meetings")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Meeting extends AuditFields {

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
            @AttributeOverride(name = "address", column = @Column(name = "location_address", nullable = false)),
            @AttributeOverride(name = "point", column = @Column(name = "location_point"))
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

    @Column(name = "contact_phone_override")
    private String contactPhoneOverride;

    @Column(nullable = false)
    private boolean active;

    public Meeting(
            Group group,
            Location location,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType type,
            String contactPhoneOverride,
            boolean active
    ) {
        this.group = group;
        this.location = location;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.type = type;
        this.contactPhoneOverride = contactPhoneOverride != null ? contactPhoneOverride.trim() : null;
        this.active = active;
    }

    public static Meeting create(
            Group group,
            Location location,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType type,
            String contactPhoneOverride,
            boolean active
    ) {
        return new Meeting(group, location, dayOfWeek, startTime, type, contactPhoneOverride, active);
    }

    public void update(
            Group group,
            Location location,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType type,
            String contactPhoneOverride,
            boolean active
    ) {
        this.group = group;
        this.location = location;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.type = type;
        this.contactPhoneOverride = contactPhoneOverride != null ? contactPhoneOverride.trim() : null;
        this.active = active;
    }

    public record MeetingSnapshot(
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType type,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude,
            String contactPhoneOverride,
            boolean active
    ) {}

    public MeetingSnapshot snapshot() {
        return new MeetingSnapshot(
                this.dayOfWeek,
                this.startTime,
                this.type,
                this.location.getDetail(),
                this.location.getAddress(),
                this.location.getLatitude(),
                this.location.getLongitude(),
                this.contactPhoneOverride,
                this.active
        );
    }

    public void updateLocation(Location location) {
        this.location = location;
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
