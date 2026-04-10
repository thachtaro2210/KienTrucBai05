package com.foodorder.userservice.service;

import com.foodorder.userservice.dto.request.LoginRequest;
import com.foodorder.userservice.dto.request.RegisterRequest;
import com.foodorder.userservice.dto.response.LoginResponse;
import com.foodorder.userservice.dto.response.UserResponse;
import com.foodorder.userservice.exception.AppException;
import com.foodorder.userservice.exception.ErrorCode;
import com.foodorder.userservice.model.Role;
import com.foodorder.userservice.model.User;
import com.foodorder.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository  userRepository;
    private final JwtService      jwtService;
    private final PasswordEncoder passwordEncoder;

    /* ── Register ──────────────────────────────────────────────── */

    public UserResponse register(RegisterRequest request) {
        log.info("[UserService] Register attempt — username={}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .active(true)
                .build();

        User saved = userRepository.save(user);
        log.info("[UserService] Registered user id={}", saved.getId());
        return toResponse(saved);
    }

    /* ── Login ──────────────────────────────────────────────────── */

    public LoginResponse login(LoginRequest request) {
        log.info("[UserService] Login attempt — username={}", request.getUsername());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = jwtService.generateToken(user.getId(), user.getUsername(), user.getRole().name());
        log.info("[UserService] Login success — userId={}", user.getId());

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationMs())
                .user(toResponse(user))
                .build();
    }

    /* ── Get Users ──────────────────────────────────────────────── */

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return toResponse(user);
    }

    /* ── Validate (called by Order Service internally) ─────────── */

    public UserResponse validateUser(String userId) {
        return getUserById(userId);
    }

    /* ── Mapper ─────────────────────────────────────────────────── */

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
