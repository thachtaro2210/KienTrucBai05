package com.foodorder.paymentservice.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import java.math.BigDecimal;
import java.util.Map;

@FeignClient(name = "order-service", url = "${services.order-service.url}")
public interface OrderServiceClient {

    @GetMapping("/api/v1/orders/{id}")
    OrderApiResponse getOrderByIdRaw(@PathVariable("id") String id);

    @PatchMapping("/api/v1/orders/{id}/status")
    void updateOrderStatusRaw(@PathVariable("id") String id, @RequestBody Map<String, String> statusBody);

    /**
     * Backward-compatible alias for older PaymentService code paths.
     */
    default OrderDto getOrder(String id) {
        return getOrderById(id);
    }

    default OrderDto getOrderById(String id) {
        try {
            OrderApiResponse response = getOrderByIdRaw(id);
            if (response != null && response.getData() != null) {
                Map<String, Object> data = response.getData();
                OrderDto dto = new OrderDto();
                dto.setId((String) data.get("id"));
                dto.setUserId((String) data.get("userId"));
                Object userNameObj = data.get("userName");
                if (userNameObj == null) {
                    userNameObj = data.get("fullName");
                }
                if (userNameObj != null) {
                    dto.setUserName(String.valueOf(userNameObj));
                }
                
                Object totalObj = data.get("totalAmount");
                if (totalObj instanceof Number) {
                    dto.setTotalAmount(BigDecimal.valueOf(((Number) totalObj).doubleValue()));
                } else if (totalObj instanceof String) {
                    dto.setTotalAmount(new BigDecimal((String) totalObj));
                }
                
                return dto;
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    default void updateOrderStatus(String orderId, String newStatus) {
        try {
            updateOrderStatusRaw(orderId, Map.of("status", newStatus));
        } catch (Exception ignored) { }
    }

    @Data
    class OrderDto {
        private String id;
        private String userId;
        private String userName;
        private BigDecimal totalAmount;
    }

    @Data
    class OrderApiResponse {
        private boolean success;
        private int code;
        private String message;
        private Map<String, Object> data;
    }
}
