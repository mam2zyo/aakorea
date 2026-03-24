package io.step5.aakorea.support.api;

import io.step5.aakorea.modules.basic.group.application.GroupNotFoundException;
import io.step5.aakorea.modules.service.district.application.DistrictDeleteConflictException;
import io.step5.aakorea.modules.service.district.application.DistrictNameAlreadyExistsException;
import io.step5.aakorea.modules.service.district.application.DistrictNotFoundException;
import io.step5.aakorea.modules.service.district.domain.District;
import io.step5.aakorea.modules.service.group.application.AdminGroupNotFoundException;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.gsr.application.AdminGsrNotFoundException;
import io.step5.aakorea.modules.service.gsr.application.GsrEmailAlreadyExistsException;
import io.step5.aakorea.modules.service.gsr.domain.GSR;
import io.step5.aakorea.modules.service.meeting.application.AdminMeetingNotFoundException;
import io.step5.aakorea.modules.service.meeting.application.MeetingPlaceValidationException;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

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

    @ExceptionHandler(AdminGsrNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleAdminGsrNotFound(AdminGsrNotFoundException e) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 404,
                "error", "NOT_FOUND",
                "message", e.getMessage()
        );
    }

    @ExceptionHandler(AdminMeetingNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleAdminMeetingNotFound(AdminMeetingNotFoundException e) {
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

    @ExceptionHandler(GsrEmailAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, Object> handleGsrEmailAlreadyExists(GsrEmailAlreadyExistsException e) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 409,
                "error", "CONFLICT",
                "message", e.getMessage()
        );
    }

    @ExceptionHandler(MeetingPlaceValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleMeetingPlaceValidation(MeetingPlaceValidationException e) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 400,
                "error", "BAD_REQUEST",
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
        String message = "??롢걵???遺욧퍕??낅빍??";

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
