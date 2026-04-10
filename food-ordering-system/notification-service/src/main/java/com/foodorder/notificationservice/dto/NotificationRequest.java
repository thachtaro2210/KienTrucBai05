package com.foodorder.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NotificationRequest {
    @NotBlank(message = "User name is required")
    private String userName;

    @NotBlank(message = "Order ID is required")
    private String orderId;

    @NotBlank(message = "Amount is required")
    private String amount;
}
