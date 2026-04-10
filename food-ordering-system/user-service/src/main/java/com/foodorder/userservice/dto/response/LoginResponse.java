package com.foodorder.userservice.dto.response;

import lombok.Builder;
import lombok.Data;

/**
 * Returned after a successful login.
 */
@Data
@Builder
public class LoginResponse {
    private String  accessToken;
    private String  tokenType;
    private long    expiresIn;   // milliseconds
    private UserResponse user;
}
