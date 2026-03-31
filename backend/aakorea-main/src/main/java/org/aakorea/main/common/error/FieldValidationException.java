package org.aakorea.main.common.error;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FieldValidationException extends ResponseStatusException {

    private final ApiErrorCode errorCode;
    private final Map<String, String> fields;

    private FieldValidationException(
            HttpStatus status,
            ApiErrorCode errorCode,
            String reason,
            Map<String, String> fields
    ) {
        super(status, reason);
        this.errorCode = errorCode;
        this.fields = Map.copyOf(fields);
    }

    public static FieldValidationException badRequest(String field, String message) {
        return new FieldValidationException(
                HttpStatus.BAD_REQUEST,
                ApiErrorCode.VALIDATION_ERROR,
                message,
                Map.of(field, message));
    }

    public static FieldValidationException conflict(String field, String message) {
        return new FieldValidationException(
                HttpStatus.CONFLICT,
                ApiErrorCode.CONFLICT,
                message,
                Map.of(field, message));
    }

    public ApiErrorCode getErrorCode() {
        return errorCode;
    }

    public Map<String, String> getFields() {
        return fields;
    }
}
