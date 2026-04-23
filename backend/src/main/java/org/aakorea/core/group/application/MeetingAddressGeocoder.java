package org.aakorea.core.group.application;

public interface MeetingAddressGeocoder {

    GeocodedAddress resolveCoordinates(String locationAddress);
 
    record GeocodedAddress(
            Double latitude,
            Double longitude,
            String normalizedAddress
    ) {
    }
}
