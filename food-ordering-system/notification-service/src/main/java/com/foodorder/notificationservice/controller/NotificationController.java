package com.foodorder.notificationservice.controller;

import com.foodorder.notificationservice.dto.NotificationRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @PostMapping
    public ResponseEntity<Map<String, String>> sendNotification(@Valid @RequestBody NotificationRequest request) {
        String message = String.format(
                "✅ [NOTIFICATION] %s đã đặt đơn #%s thành công — Tổng tiền: %s VNĐ",
                request.getUserName(), request.getOrderId(), request.getAmount()
        );

        // ── Console log (as required by lab) ──────────────────────
        log.info("═══════════════════════════════════════════════════");
        log.info(message);
        log.info("═══════════════════════════════════════════════════");

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", message
        ));
    }
}
