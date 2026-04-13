package org.aakorea.main.shared;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@EqualsAndHashCode
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Location {

    @Convert(converter = ProvinceConverter.class)
    @Column(nullable = false)
    private Province province;

    private String detail;

    private String address;

    private Double latitude;

    private Double longitude;

    public Location(
            Province province,
            String detail,
            String address,
            Double latitude,
            Double longitude
    ) {
        this.province = province;
        this.detail = detail;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
