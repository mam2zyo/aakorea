package io.step5.aakorea.support.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ApiErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        List<ApiFieldError> fieldErrors
) {

    public static ApiErrorResponse of(HttpStatus status, String message) {
        return new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.name(),
                message,
                List.of()
        );
    }

    public static ApiErrorResponse of(HttpStatus status, String message, List<ApiFieldError> fieldErrors) {
        return new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.name(),
                message,
                fieldErrors
        );
    }
}
