package com.foodorder.userservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Centralized error codes for User Service.
 * Format: (HTTP_STATUS, "error message")
 */
@Getter
public enum ErrorCode {

    // ── 4xx Client Errors ──────────────────────────────────────
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "Validation failed"),
    USERNAME_EXISTED(HttpStatus.CONFLICT, "Username already exists"),
    EMAIL_EXISTED(HttpStatus.CONFLICT, "Email already exists"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Invalid username or password"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Unauthorized access"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Access denied"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "Invalid or expired token"),

    // ── 5xx Server Errors ──────────────────────────────────────
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"),
    DATABASE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Database operation failed"),
    ;

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus    = httpStatus;
        this.message       = message;
    }
}
