package com.foodorder.orderservice.dto.response;

import com.foodorder.orderservice.model.OrderItem;
import com.foodorder.orderservice.model.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private String          id;
    private String          userId;
    private String          userName;
    private List<OrderItem> items;
    private BigDecimal      totalAmount;
    private OrderStatus     status;
    private String          note;
    private Instant         createdAt;
    private Instant         updatedAt;
}
