package io.step5.aakorea.controller;

import io.step5.aakorea.service.GroupNotFoundException;
import io.step5.aakorea.service.admin.DistrictDeleteConflictException;
import io.step5.aakorea.service.admin.DistrictNameAlreadyExistsException;
import io.step5.aakorea.service.admin.AdminGroupNotFoundException;
import io.step5.aakorea.service.admin.DistrictNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(GroupNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleGroupNotFound(GroupNotFoundException e) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 404,
                "error", "NOT_FOUND",
                "message", e.getMessage()
        );
    }

    @ExceptionHandler(AdminGroupNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleAdminGroupNotFound(AdminGroupNotFoundException e) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 404,
                "error", "NOT_FOUND",
                "message", e.getMessage()
        );
    }

    @ExceptionHandler(DistrictNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleDistrictNotFound(DistrictNotFoundException e) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 404,
                "error", "NOT_FOUND",
                "message", e.getMessage()
        );
    }

    @ExceptionHandler(DistrictNameAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, Object> handleDistrictNameAlreadyExists(DistrictNameAlreadyExistsException e) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 409,
                "error", "CONFLICT",
                "message", e.getMessage()
        );
    }

    @ExceptionHandler(DistrictDeleteConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, Object> handleDistrictDeleteConflict(DistrictDeleteConflictException e) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 409,
                "error", "CONFLICT",
                "message", e.getMessage()
        );
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidationException(Exception e) {
        String message = "잘못된 요청입니다.";

        if (e instanceof MethodArgumentNotValidException methodArgumentNotValidException
                && methodArgumentNotValidException.getBindingResult().getFieldError() != null) {
            message = methodArgumentNotValidException.getBindingResult().getFieldError().getDefaultMessage();
        } else if (e instanceof ConstraintViolationException constraintViolationException
                && !constraintViolationException.getConstraintViolations().isEmpty()) {
            message = constraintViolationException.getConstraintViolations().iterator().next().getMessage();
        }

        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 400,
                "error", "BAD_REQUEST",
                "message", message
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 400,
                "error", "BAD_REQUEST",
                "message", "Invalid request parameter: " + e.getName()
        );
    }
}