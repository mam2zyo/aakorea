package org.aakorea.main.group.domain;

import jakarta.persistence.Column;
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

    @Column(nullable = false)
    private String province;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "location_address")
    private String locationAddress;

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
            String province,
            String locationName,
            String locationAddress,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType type,
            boolean active
    ) {
        this.group = group;
        this.province = province;
        this.locationName = locationName;
        this.locationAddress = locationAddress;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.type = type;
        this.active = active;
    }

    public void update(
            Group group,
            String province,
            String locationName,
            String locationAddress,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType type,
            boolean active
    ) {
        this.group = group;
        this.province = province;
        this.locationName = locationName;
        this.locationAddress = locationAddress;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.type = type;
        this.active = active;
    }
}
