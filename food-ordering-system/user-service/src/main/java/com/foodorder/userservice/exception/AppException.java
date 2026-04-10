package com.foodorder.userservice.exception;

import lombok.Getter;

/**
 * Custom application exception that carries an {@link ErrorCode}.
 * All business logic exceptions should throw this.
 */
@Getter
public class AppException extends RuntimeException {

    private final ErrorCode errorCode;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public AppException(ErrorCode errorCode, String detail) {
        super(detail);
        this.errorCode = errorCode;
    }
}
