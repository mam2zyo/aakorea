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
            String detail,
            String address,
            Double latitude,
            Double longitude
    ) {
        validate(detail, address, latitude, longitude);
        try {
            this.province = Province.fromAddress(address.trim());
        } catch (IllegalArgumentException e) {
            throw badRequest("locationAddress", "locationAddress cannot determine province");
        }
        this.detail = detail != null ? detail.trim() : null;
        this.address = address != null ? address.trim() : null;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Location(
            Province province,
            String detail,
            String address,
            Double latitude,
            Double longitude
    ) {
        validate(detail, address, latitude, longitude);
        this.province = province;
        this.detail = detail != null ? detail.trim() : null;
        this.address = address != null ? address.trim() : null;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    private void validate(String detail, String address, Double latitude, Double longitude) {
        if (address == null || address.isBlank()) {
            throw badRequest("locationAddress", "locationAddress is required");
        }

        if (latitude != null && longitude == null) {
            throw badRequest("longitude", "longitude is required when latitude is provided");
        }
        if (longitude != null && latitude == null) {
            throw badRequest("latitude", "latitude is required when longitude is provided");
        }

        if (latitude != null && (latitude < -90.0 || latitude > 90.0)) {
            throw badRequest("latitude", "latitude is invalid");
        }
        if (longitude != null && (longitude < -180.0 || longitude > 180.0)) {
            throw badRequest("longitude", "longitude is invalid");
        }
    }

    private org.springframework.web.server.ResponseStatusException badRequest(String fieldName, String reason) {
        return org.aakorea.main.common.error.FieldValidationException.badRequest(fieldName, reason);
    }
}
