package com.foodorder.orderservice.service;

import com.foodorder.orderservice.client.FoodServiceClient;
import com.foodorder.orderservice.client.FoodServiceClient.FoodDto;
import com.foodorder.orderservice.client.UserServiceClient;
import com.foodorder.orderservice.client.UserServiceClient.UserDto;
import com.foodorder.orderservice.dto.request.CreateOrderRequest;
import com.foodorder.orderservice.dto.response.OrderResponse;
import com.foodorder.orderservice.exception.AppException;
import com.foodorder.orderservice.exception.ErrorCode;
import com.foodorder.orderservice.model.Order;
import com.foodorder.orderservice.model.OrderItem;
import com.foodorder.orderservice.model.OrderStatus;
import com.foodorder.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository    orderRepository;
    private final UserServiceClient  userServiceClient;
    private final FoodServiceClient  foodServiceClient;

    /* ── Create Order ────────────────────────────────────────────── */
    public OrderResponse createOrder(CreateOrderRequest request) {
        log.info("[OrderService] Creating order for userId={}", request.getUserId());

        // 1. Validate user via User Service
        UserDto user = userServiceClient.validateUser(request.getUserId());
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // 2. Fetch food details via Food Service & build items
        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            FoodDto food = foodServiceClient.getFoodById(itemReq.getFoodId());
            if (food == null) {
                throw new AppException(ErrorCode.FOOD_NOT_FOUND,
                        "Food not found: " + itemReq.getFoodId());
            }

            BigDecimal subtotal = food.getPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            items.add(OrderItem.builder()
                    .foodId(food.getId())
                    .foodName(food.getName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(food.getPrice())
                    .subtotal(subtotal)
                    .build());

            total = total.add(subtotal);
        }

        // 3. Persist order
        Order order = Order.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .items(items)
                .totalAmount(total)
                .status(OrderStatus.PENDING)
                .note(request.getNote())
                .build();

        Order saved = orderRepository.save(order);
        log.info("[OrderService] Order created id={}, total={}", saved.getId(), saved.getTotalAmount());
        return toResponse(saved);
    }

    /* ── Get All Orders ──────────────────────────────────────────── */
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /* ── Get Orders By User ──────────────────────────────────────── */
    public List<OrderResponse> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /* ── Get Order By ID ─────────────────────────────────────────── */
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return toResponse(order);
    }

    /* ── Update Status (called by Payment Service) ───────────────── */
    public OrderResponse updateOrderStatus(String orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        log.info("[OrderService] Status transition: {} → {} for order id={}",
                order.getStatus(), newStatus, orderId);

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return toResponse(updated);
    }

    /* ── Mapper ──────────────────────────────────────────────────── */
    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .userName(order.getUserName())
                .items(order.getItems())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
