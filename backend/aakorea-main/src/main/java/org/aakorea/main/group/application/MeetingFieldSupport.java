package org.aakorea.main.group.application;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.shared.Province;
import org.springframework.web.server.ResponseStatusException;

final class MeetingFieldSupport {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private MeetingFieldSupport() {
    }

    static Province requireProvince(String province) {
        if (province == null || province.isBlank()) {
            throw badRequest("province", "province is required");
        }

        return normalizeProvince(province);
    }

    static Province optionalProvince(String province) {
        if (province == null) {
            return null;
        }

        return normalizeProvince(province);
    }

    static DayOfWeek requireDayOfWeek(String dayOfWeek) {
        if (dayOfWeek == null || dayOfWeek.isBlank()) {
            throw badRequest("dayOfWeek", "dayOfWeek is required");
        }

        try {
            return DayOfWeek.valueOf(dayOfWeek.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw badRequest("dayOfWeek", "dayOfWeek is invalid");
        }
    }

    static DayOfWeek optionalDayOfWeek(String dayOfWeek) {
        if (dayOfWeek == null) {
            return null;
        }

        return requireDayOfWeek(dayOfWeek);
    }

    static LocalTime requireStartTime(String startTime) {
        if (startTime == null || startTime.isBlank()) {
            throw badRequest("startTime", "startTime is required");
        }

        try {
            return LocalTime.parse(startTime.trim(), TIME_FORMATTER);
        } catch (DateTimeParseException exception) {
            throw badRequest("startTime", "startTime is invalid");
        }
    }

    static MeetingType requireMeetingType(String type) {
        if (type == null || type.isBlank()) {
            throw badRequest("type", "type is required");
        }

        try {
            return MeetingType.valueOf(type.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw badRequest("type", "type is invalid");
        }
    }

    static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw badRequest(fieldName, fieldName + " is required");
        }

        return value.trim();
    }

    static String optionalText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    static Province resolveProvince(String locationAddress) {
        String normalizedAddress = requireText(locationAddress, "locationAddress");

        try {
            return Province.fromAddress(normalizedAddress);
        } catch (IllegalArgumentException exception) {
            throw badRequest("locationAddress", "locationAddress cannot determine province");
        }
    }

    static Double optionalLatitude(Double latitude) {
        if (latitude == null) {
            return null;
        }

        if (latitude < -90.0 || latitude > 90.0) {
            throw badRequest("latitude", "latitude is invalid");
        }

        return latitude;
    }

    static Double optionalLongitude(Double longitude) {
        if (longitude == null) {
            return null;
        }

        if (longitude < -180.0 || longitude > 180.0) {
            throw badRequest("longitude", "longitude is invalid");
        }

        return longitude;
    }

    static String formatTime(LocalTime startTime) {
        return TIME_FORMATTER.format(startTime);
    }

    static void validateLocation(String locationDetail, String locationAddress) {
        boolean hasLocationDetail = locationDetail != null;
        boolean hasLocationAddress = locationAddress != null;

        if (hasLocationDetail && hasLocationAddress) {
            return;
        }

        if (hasLocationDetail) {
            throw badRequest("locationAddress", "locationAddress is required when locationDetail is provided");
        }

        if (hasLocationAddress) {
            throw badRequest("locationDetail", "locationDetail is required when locationAddress is provided");
        }

        throw badRequest("locationDetail", "locationDetail is required");
    }

    static void validateCoordinates(Double latitude, Double longitude) {
        if (latitude == null && longitude == null) {
            return;
        }

        if (latitude == null) {
            throw badRequest("latitude", "latitude is required when longitude is provided");
        }

        if (longitude == null) {
            throw badRequest("longitude", "longitude is required when latitude is provided");
        }
    }

    private static Province normalizeProvince(String province) {
        try {
            return Province.fromCode(province);
        } catch (IllegalArgumentException exception) {
            throw badRequest("province", "province is invalid");
        }
    }

    private static ResponseStatusException badRequest(String fieldName, String reason) {
        return FieldValidationException.badRequest(fieldName, reason);
    }
}
