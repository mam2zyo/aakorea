package io.step5.aakorea.support.api;

import io.step5.aakorea.modules.general.publicview.group.application.GroupNotFoundException;
import io.step5.aakorea.modules.general.admin.district.application.DistrictDeleteConflictException;
import io.step5.aakorea.modules.general.admin.district.application.DistrictNameAlreadyExistsException;
import io.step5.aakorea.modules.general.admin.district.application.DistrictNotFoundException;
import io.step5.aakorea.modules.general.admin.district.domain.District;
import io.step5.aakorea.modules.general.admin.group.application.AdminGroupNotFoundException;
import io.step5.aakorea.modules.general.admin.group.domain.Group;
import io.step5.aakorea.modules.general.admin.gsr.application.AdminGsrNotFoundException;
import io.step5.aakorea.modules.general.admin.gsr.application.GsrEmailAlreadyExistsException;
import io.step5.aakorea.modules.general.admin.gsr.domain.GSR;
import io.step5.aakorea.modules.general.admin.meeting.application.AdminMeetingNotFoundException;
import io.step5.aakorea.modules.general.admin.meeting.application.MeetingPlaceValidationException;
import io.step5.aakorea.modules.general.admin.meeting.domain.Meeting;
import io.step5.aakorea.modules.general.admin.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.general.admin.notice.application.AdminNoticeNotFoundException;
import io.step5.aakorea.modules.general.admin.notice.application.NoticeDisplayWindowInvalidException;
import jakarta.validation.ConstraintViolationException;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(GroupNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleGroupNotFound(GroupNotFoundException e) {
        return error(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(AdminGroupNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleAdminGroupNotFound(AdminGroupNotFoundException e) {
        return error(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(AdminGsrNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleAdminGsrNotFound(AdminGsrNotFoundException e) {
        return error(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(AdminMeetingNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleAdminMeetingNotFound(AdminMeetingNotFoundException e) {
        return error(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(AdminNoticeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleAdminNoticeNotFound(AdminNoticeNotFoundException e) {
        return error(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(DistrictNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleDistrictNotFound(DistrictNotFoundException e) {
        return error(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(DistrictNameAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiErrorResponse handleDistrictNameAlreadyExists(DistrictNameAlreadyExistsException e) {
        return error(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(GsrEmailAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiErrorResponse handleGsrEmailAlreadyExists(GsrEmailAlreadyExistsException e) {
        return error(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(MeetingPlaceValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleMeetingPlaceValidation(MeetingPlaceValidationException e) {
        return error(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(NoticeDisplayWindowInvalidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleNoticeDisplayWindowInvalid(NoticeDisplayWindowInvalidException e) {
        return error(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(DistrictDeleteConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiErrorResponse handleDistrictDeleteConflict(DistrictDeleteConflictException e) {
        return error(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleValidationException(Exception e) {
        if (e instanceof MethodArgumentNotValidException methodArgumentNotValidException) {
            List<ApiFieldError> fieldErrors = methodArgumentNotValidException.getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .map(this::toFieldError)
                    .toList();

            String message = fieldErrors.isEmpty()
                    ? "입력값을 확인해주세요."
                    : fieldErrors.getFirst().message();

            return error(HttpStatus.BAD_REQUEST, message, fieldErrors);
        }

        if (e instanceof ConstraintViolationException constraintViolationException) {
            List<ApiFieldError> fieldErrors = constraintViolationException.getConstraintViolations()
                    .stream()
                    .map(violation -> new ApiFieldError(
                            violation.getPropertyPath().toString(),
                            violation.getMessage()
                    ))
                    .toList();

            String message = fieldErrors.isEmpty()
                    ? "입력값을 확인해주세요."
                    : fieldErrors.getFirst().message();

            return error(HttpStatus.BAD_REQUEST, message, fieldErrors);
        }

        return error(HttpStatus.BAD_REQUEST, "입력값을 확인해주세요.");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        if (e.getRequiredType() != null && e.getRequiredType().isEnum()) {
            String allowedValues = Arrays.stream(e.getRequiredType().getEnumConstants())
                    .map(String::valueOf)
                    .reduce((left, right) -> left + ", " + right)
                    .orElse("");

            return error(
                    HttpStatus.BAD_REQUEST,
                    e.getName() + " 값이 올바르지 않습니다. 사용 가능한 값: " + allowedValues
            );
        }

        return error(HttpStatus.BAD_REQUEST, e.getName() + " 값이 올바르지 않습니다.");
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        return error(HttpStatus.BAD_REQUEST, "요청 본문 형식을 확인해주세요.");
    }

    private ApiFieldError toFieldError(FieldError fieldError) {
        return new ApiFieldError(fieldError.getField(), fieldError.getDefaultMessage());
    }

    private ApiErrorResponse error(HttpStatus status, String message) {
        return ApiErrorResponse.of(status, message);
    }

    private ApiErrorResponse error(HttpStatus status, String message, List<ApiFieldError> fieldErrors) {
        return ApiErrorResponse.of(status, message, fieldErrors);
    }
}
