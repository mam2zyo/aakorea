package org.aakorea.main.common.error;

import jakarta.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        return ResponseEntity.badRequest()
                .body(ErrorResponse.of(
                        ApiErrorCode.VALIDATION_ERROR,
                        "invalid request",
                        extractFieldErrors(exception)));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException exception) {
        Map<String, String> fields = new LinkedHashMap<>();
        exception.getConstraintViolations().forEach(violation ->
                fields.put(violation.getPropertyPath().toString(), violation.getMessage()));

        return ResponseEntity.badRequest()
                .body(ErrorResponse.of(ApiErrorCode.VALIDATION_ERROR, "invalid request", fields));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest()
                .body(ErrorResponse.of(ApiErrorCode.VALIDATION_ERROR, "invalid request"));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException exception) {
        return ResponseEntity.badRequest()
                .body(ErrorResponse.of(ApiErrorCode.VALIDATION_ERROR, exception.getName() + " is invalid"));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatus(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode())
                .body(ErrorResponse.of(resolveCode(exception.getStatusCode().value()), exception.getReason()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception exception) {
        return ResponseEntity.internalServerError()
                .body(ErrorResponse.of(ApiErrorCode.INTERNAL_SERVER_ERROR, "internal server error"));
    }

    private Map<String, String> extractFieldErrors(MethodArgumentNotValidException exception) {
        Map<String, String> fields = new LinkedHashMap<>();

        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            fields.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return fields;
    }

    private ApiErrorCode resolveCode(int statusCode) {
        if (statusCode == HttpStatus.UNAUTHORIZED.value()) {
            return ApiErrorCode.UNAUTHORIZED;
        }
        if (statusCode == HttpStatus.BAD_REQUEST.value()) {
            return ApiErrorCode.VALIDATION_ERROR;
        }
        if (statusCode == HttpStatus.FORBIDDEN.value()) {
            return ApiErrorCode.FORBIDDEN;
        }
        if (statusCode == HttpStatus.NOT_FOUND.value()) {
            return ApiErrorCode.NOT_FOUND;
        }
        if (statusCode == HttpStatus.CONFLICT.value()) {
            return ApiErrorCode.CONFLICT;
        }

        return ApiErrorCode.INTERNAL_SERVER_ERROR;
    }
}
