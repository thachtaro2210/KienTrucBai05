package com.foodorder.userservice.exception;

import com.foodorder.userservice.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler — intercepts all exceptions and returns
 * a consistent {@link ApiResponse} envelope to the client.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /* ──────────────────────────────────────────────────────────
       Business / App exceptions
       ────────────────────────────────────────────────────────── */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException ex) {
        ErrorCode code = ex.getErrorCode();
        log.warn("[AppException] {} — {}", code.name(), ex.getMessage());
        return ResponseEntity
                .status(code.getHttpStatus())
                .body(ApiResponse.error(code.name(), ex.getMessage()));
    }

    /* ──────────────────────────────────────────────────────────
       Bean Validation (@Valid) failures
       ────────────────────────────────────────────────────────── */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            errors.put(fe.getField(), fe.getDefaultMessage());
        }
        log.warn("[ValidationError] Fields: {}", errors);
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.<Map<String, String>>builder()
                        .success(false)
                        .errorCode(ErrorCode.VALIDATION_FAILED.name())
                        .message(ErrorCode.VALIDATION_FAILED.getMessage())
                        .data(errors)
                        .build());
    }

    /* ──────────────────────────────────────────────────────────
       Catch-all
       ────────────────────────────────────────────────────────── */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        log.error("[UnhandledException] {}", ex.getMessage(), ex);
        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(ApiResponse.error(
                        ErrorCode.INTERNAL_SERVER_ERROR.name(),
                        ErrorCode.INTERNAL_SERVER_ERROR.getMessage()));
    }
}
