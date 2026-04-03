package org.aakorea.main.group.application;

import org.aakorea.main.common.error.FieldValidationException;
import org.springframework.web.server.ResponseStatusException;

final class GroupFieldSupport {

    private GroupFieldSupport() {
    }

    static String requireName(String value) {
        return requireText(value, "name");
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
