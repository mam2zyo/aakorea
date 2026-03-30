package org.aakorea.main.common.error;

import java.util.Map;

public record ErrorResponse(ErrorBody error) {

    public static ErrorResponse of(ApiErrorCode code, String message) {
        return new ErrorResponse(new ErrorBody(code.name(), message, null));
    }

    public static ErrorResponse of(ApiErrorCode code, String message, Map<String, String> fields) {
        return new ErrorResponse(new ErrorBody(code.name(), message, fields));
    }

    public record ErrorBody(String code, String message, Map<String, String> fields) {
        public ErrorBody {
            fields = (fields == null || fields.isEmpty()) ? null : Map.copyOf(fields);
        }
    }
}
