package com.foodorder.paymentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

@FeignClient(name = "notification-service", url = "${services.notification-service.url}")
public interface NotificationServiceClient {

    @PostMapping("/api/v1/notifications")
    Map<String, Object> sendNotificationRaw(@RequestBody Map<String, Object> payload);

    default void sendNotification(String userId, String orderId, String message) {
        try {
            sendNotificationRaw(Map.of(
                "userId", userId,
                "orderId", orderId,
                "message", message
            ));
        } catch (Exception ignored) { }
    }
}
