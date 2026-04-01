package org.aakorea.main.group.application;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;
import java.util.Set;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.group.domain.MeetingType;
import org.springframework.web.server.ResponseStatusException;

final class MeetingFieldSupport {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private static final Set<String> SUPPORTED_PROVINCES = Set.of(
            "seoul",
            "busan",
            "daegu",
            "incheon",
            "gwangju",
            "daejeon",
            "ulsan",
            "sejong",
            "gyeonggi",
            "gangwon",
            "chungbuk",
            "chungnam",
            "jeonbuk",
            "jeonnam",
            "gyeongbuk",
            "gyeongnam",
            "jeju");

    private MeetingFieldSupport() {
    }

    static String requireProvince(String province) {
        if (province == null || province.isBlank()) {
            throw badRequest("province", "province is required");
        }

        return normalizeProvince(province);
    }

    static String optionalProvince(String province) {
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

    static String formatTime(LocalTime startTime) {
        return TIME_FORMATTER.format(startTime);
    }

    private static String normalizeProvince(String province) {
        String normalized = province.trim().toLowerCase(Locale.ROOT);
        if (!SUPPORTED_PROVINCES.contains(normalized)) {
            throw badRequest("province", "province is invalid");
        }
        return normalized;
    }

    private static ResponseStatusException badRequest(String fieldName, String reason) {
        return FieldValidationException.badRequest(fieldName, reason);
    }
}
