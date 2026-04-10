package com.foodorder.orderservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemRequest> items;

    private String note;

    @Data
    public static class OrderItemRequest {
        @NotBlank(message = "Food ID is required")
        private String foodId;

        @Positive(message = "Quantity must be at least 1")
        private int quantity;
    }
}
