package org.aakorea.core.group.application;

import org.aakorea.core.common.error.FieldValidationException;
import org.springframework.web.server.ResponseStatusException;

final class GroupFieldSupport {

    private static final int NOTICE_MAX_LENGTH = 200;

    private GroupFieldSupport() {
    }

    static String requireName(String value) {
        return requireText(value, "name");
    }

    static String optionalNotice(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        if (normalized.isEmpty()) {
            return null;
        }

        if (normalized.length() > NOTICE_MAX_LENGTH) {
            throw badRequest("notice", "notice must be at most 200 characters");
        }

        return normalized;
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
