package org.aakorea.main.group.application;

import org.aakorea.main.common.error.FieldValidationException;
import org.springframework.web.server.ResponseStatusException;

final class GroupFieldSupport {

    private GroupFieldSupport() {
    }

    static String requireName(String value) {
        return requireText(value, "name");
    }

    static String optionalText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    static void validateBaseLocation(String locationName, String locationAddress) {
        boolean hasLocationName = locationName != null;
        boolean hasLocationAddress = locationAddress != null;

        if (hasLocationName == hasLocationAddress) {
            return;
        }

        if (hasLocationName) {
            throw badRequest("locationAddress", "locationAddress is required when locationName is provided");
        }

        throw badRequest("locationName", "locationName is required when locationAddress is provided");
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw badRequest(fieldName, fieldName + " is required");
        }

        return value.trim();
    }

    private static ResponseStatusException badRequest(String fieldName, String reason) {
        return FieldValidationException.badRequest(fieldName, reason);
    }
}
