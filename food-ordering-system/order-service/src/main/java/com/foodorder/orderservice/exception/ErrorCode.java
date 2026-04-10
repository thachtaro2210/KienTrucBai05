package com.foodorder.orderservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "Validation failed"),
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "Order not found"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found or invalid"),
    FOOD_NOT_FOUND(HttpStatus.NOT_FOUND, "Food item not found"),
    SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "Upstream service unavailable"),
    INVALID_STATUS_TRANSITION(HttpStatus.BAD_REQUEST, "Invalid order status transition"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"),
    ;

    private final HttpStatus httpStatus;
    private final String     message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message    = message;
    }
}
