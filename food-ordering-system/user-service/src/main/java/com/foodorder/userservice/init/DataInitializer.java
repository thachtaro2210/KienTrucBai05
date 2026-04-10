package com.foodorder.userservice.init;

import com.foodorder.userservice.model.Role;
import com.foodorder.userservice.model.User;
import com.foodorder.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * DataInitializer — seeds sample user data on startup.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  TOGGLE via application.yml:                                │
 * │   app.data.init.enabled: true   →  seed data on startup     │
 * │   app.data.init.enabled: false  →  skip seeding             │
 * │                                                             │
 * │  Or via env var:  DATA_INIT_ENABLED=false                   │
 * └─────────────────────────────────────────────────────────────┘
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.data.init.enabled:true}")
    private boolean initEnabled;

    @Override
    public void run(String... args) {
        if (!initEnabled) {
            log.info("[DataInitializer] Seeding DISABLED (app.data.init.enabled=false)");
            return;
        }

        if (userRepository.count() > 0) {
            log.info("[DataInitializer] Users already exist — skipping seed");
            return;
        }

        log.info("[DataInitializer] Seeding sample users...");

        List<User> users = List.of(
            User.builder()
                .username("admin")
                .email("admin@foodorder.com")
                .fullName("System Administrator")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .build(),

            User.builder()
                .username("user1")
                .email("user1@foodorder.com")
                .fullName("Nguyen Van A")
                .passwordHash(passwordEncoder.encode("user123"))
                .role(Role.USER)
                .active(true)
                .build(),

            User.builder()
                .username("user2")
                .email("user2@foodorder.com")
                .fullName("Tran Thi B")
                .passwordHash(passwordEncoder.encode("user123"))
                .role(Role.USER)
                .active(true)
                .build()
        );

        userRepository.saveAll(users);
        log.info("[DataInitializer] Seeded {} users successfully", users.size());
        log.info("[DataInitializer] Default credentials — admin/admin123, user1/user123, user2/user123");
    }
}
