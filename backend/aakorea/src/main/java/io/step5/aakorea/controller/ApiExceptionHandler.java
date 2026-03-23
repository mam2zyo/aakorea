package io.step5.aakorea.controller;

import io.step5.aakorea.service.GroupNotFoundException;
import org.springframework.http.HttpStatus;
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