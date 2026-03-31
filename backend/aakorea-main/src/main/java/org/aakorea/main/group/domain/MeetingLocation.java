package org.aakorea.main.group.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MeetingLocation {

    @Column(name = "location_name", nullable = false)
    private String name;

    @Column(name = "location_address", nullable = false)
    private String address;

    public MeetingLocation(String name, String address) {
        this.name = name;
        this.address = address;
    }
}
