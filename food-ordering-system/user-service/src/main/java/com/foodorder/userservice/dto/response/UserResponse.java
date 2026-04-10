package com.foodorder.userservice.dto.response;

import com.foodorder.userservice.model.Role;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

/**
 * Public-facing user data (never exposes password hash).
 */
@Data
@Builder
public class UserResponse {
    private String  id;
    private String  username;
    private String  email;
    private String  fullName;
    private Role    role;
    private boolean active;
    private Instant createdAt;
}
