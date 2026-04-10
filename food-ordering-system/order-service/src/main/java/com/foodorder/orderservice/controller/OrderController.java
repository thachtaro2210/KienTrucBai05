package com.foodorder.orderservice.controller;

import com.foodorder.orderservice.dto.request.CreateOrderRequest;
import com.foodorder.orderservice.dto.response.ApiResponse;
import com.foodorder.orderservice.dto.response.OrderResponse;
import com.foodorder.orderservice.model.OrderStatus;
import com.foodorder.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Order Service.
 * Base path: /api/v1/orders
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /* POST /orders */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponse data = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order created successfully", data));
    }

    /* GET /orders */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAllOrders()));
    }

    /* GET /orders/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderById(id)));
    }

    /* GET /orders/user/{userId} */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByUser(
            @PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrdersByUser(userId)));
    }

    /* PATCH /orders/{id}/status — called by Payment Service */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        OrderStatus status = OrderStatus.valueOf(statusStr.toUpperCase());
        OrderResponse data = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", data));
    }
}
