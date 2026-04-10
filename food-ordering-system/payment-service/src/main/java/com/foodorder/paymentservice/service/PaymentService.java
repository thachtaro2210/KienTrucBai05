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

        // 1. Return existing success payment if this order is already paid
        Payment existingPaidPayment = paymentRepository.findByOrderId(request.getOrderId())
            .filter(existing -> existing.getStatus() == PaymentStatus.SUCCESS)
            .orElse(null);

        if (existingPaidPayment != null) {
            log.info("[PaymentService] Order already paid, returning existing payment ref={}",
                existingPaidPayment.getTransactionRef());
            return toPaymentResponse(existingPaidPayment,
                "Đơn hàng này đã được thanh toán trước đó.");
        }

        // 2. Fetch order details from Order Service
        OrderDto order = orderServiceClient.getOrderById(request.getOrderId());
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
        String notifMsg = String.format("Đã thanh toán thành công đơn hàng %s với số tiền %s VNĐ.", order.getId(), order.getTotalAmount().toPlainString());
        notificationServiceClient.sendNotification(
                order.getUserId(),
                order.getId(),
                notifMsg
        );

        return toPaymentResponse(saved, notifMsg);
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

    private PaymentResponse toPaymentResponse(Payment payment, String notificationMessage) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .transactionRef(payment.getTransactionRef())
                .notificationMessage(notificationMessage)
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
