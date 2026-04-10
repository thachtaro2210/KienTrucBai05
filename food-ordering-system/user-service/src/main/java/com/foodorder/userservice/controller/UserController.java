package com.foodorder.userservice.controller;

import com.foodorder.userservice.dto.request.LoginRequest;
import com.foodorder.userservice.dto.request.RegisterRequest;
import com.foodorder.userservice.dto.response.ApiResponse;
import com.foodorder.userservice.dto.response.LoginResponse;
import com.foodorder.userservice.dto.response.UserResponse;
import com.foodorder.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for User Service.
 * Base path: /api/v1/users
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /* ── POST /register ─────────────────────────────────────────── */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        UserResponse data = userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User registered successfully", data));
    }

    /* ── POST /login ────────────────────────────────────────────── */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse data = userService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", data));
    }

    /* ── GET /users ─────────────────────────────────────────────── */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> data = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    /* ── GET /users/{id} ────────────────────────────────────────── */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        UserResponse data = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    /* ── GET /users/{id}/validate — internal call by Order Service ─ */
    @GetMapping("/{id}/validate")
    public ResponseEntity<ApiResponse<UserResponse>> validateUser(@PathVariable String id) {
        UserResponse data = userService.validateUser(id);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}
