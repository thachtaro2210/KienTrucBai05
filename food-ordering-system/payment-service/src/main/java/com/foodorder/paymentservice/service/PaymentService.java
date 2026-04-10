package com.foodorder.paymentservice.service;

import com.foodorder.paymentservice.client.NotificationServiceClient;
import com.foodorder.paymentservice.client.OrderServiceClient;
import com.foodorder.paymentservice.client.OrderServiceClient.OrderDto;
import com.foodorder.paymentservice.dto.request.PaymentRequest;
import com.foodorder.paymentservice.dto.response.PaymentResponse;
import com.foodorder.paymentservice.exception.AppException;
import com.foodorder.paymentservice.exception.ErrorCode;
import com.foodorder.paymentservice.model.Payment;
import com.foodorder.paymentservice.model.PaymentStatus;
import com.foodorder.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository    paymentRepository;
    private final OrderServiceClient   orderServiceClient;
    private final NotificationServiceClient  notificationServiceClient;

    /* ── Process Payment ─────────────────────────────────────────── */
    public PaymentResponse processPayment(PaymentRequest request) {
        log.info("[PaymentService] Processing payment for orderId={}, method={}",
                request.getOrderId(), request.getMethod());

        // 1. Check if already paid
        paymentRepository.findByOrderId(request.getOrderId()).ifPresent(existing -> {
            if (existing.getStatus() == PaymentStatus.SUCCESS) {
                throw new AppException(ErrorCode.ORDER_ALREADY_PAID);
            }
        });

        // 2. Fetch order details from Order Service
        OrderDto order = orderServiceClient.getOrder(request.getOrderId());
        if (order == null) {
            throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        }

        // 3. Simulate payment processing (fake transaction ref)
        String transactionRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 4. Persist payment record
        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .amount(order.getTotalAmount())
                .method(request.getMethod())
                .status(PaymentStatus.SUCCESS)
                .transactionRef(transactionRef)
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("[PaymentService] Payment success — ref={}", transactionRef);

        // 5. Update order status → PAID (call Order Service)
        orderServiceClient.updateOrderStatus(request.getOrderId(), "PAID");

        // 6. Send notification (console log)
        String notifMsg = notificationServiceClient.sendPaymentSuccessNotification(
                order.getUserName(),
                order.getId(),
                order.getTotalAmount().toPlainString()
        );

        return PaymentResponse.builder()
                .id(saved.getId())
                .orderId(saved.getOrderId())
                .userId(saved.getUserId())
                .amount(saved.getAmount())
                .method(saved.getMethod())
                .status(saved.getStatus())
                .transactionRef(saved.getTransactionRef())
                .notificationMessage(notifMsg)
                .createdAt(saved.getCreatedAt())
                .build();
    }

    /* ── Get All Payments ────────────────────────────────────────── */
    public java.util.List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(p -> PaymentResponse.builder()
                        .id(p.getId())
                        .orderId(p.getOrderId())
                        .userId(p.getUserId())
                        .amount(p.getAmount())
                        .method(p.getMethod())
                        .status(p.getStatus())
                        .transactionRef(p.getTransactionRef())
                        .createdAt(p.getCreatedAt())
                        .build())
                .toList();
    }
}
