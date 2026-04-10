package com.foodorder.apigateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> userServiceFallback() {
        return fallbackResponse("User Service hiện đang quá tải hoặc không phản hồi.");
    }

    @GetMapping("/food")
    public ResponseEntity<Map<String, Object>> foodServiceFallback() {
        return fallbackResponse("Food Service hiện đang quá tải hoặc không phản hồi.");
    }

    @GetMapping("/order")
    public ResponseEntity<Map<String, Object>> orderServiceFallback() {
        return fallbackResponse("Order Service hiện đang quá tải hoặc không phản hồi.");
    }

    @GetMapping("/payment")
    public ResponseEntity<Map<String, Object>> paymentServiceFallback() {
        return fallbackResponse("Payment Service hiện đang quá tải hoặc không phản hồi.");
    }

    private ResponseEntity<Map<String, Object>> fallbackResponse(String message) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "success", false,
                        "code", 503,
                        "message", message
                ));
    }
}
