package org.aakorea.main.group.application;

public interface MeetingAddressGeocoder {

    Coordinates resolveCoordinates(String locationAddress);

    record Coordinates(
            Double latitude,
            Double longitude
    ) {
    }
}
