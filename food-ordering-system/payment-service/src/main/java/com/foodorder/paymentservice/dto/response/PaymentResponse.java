package com.foodorder.paymentservice.dto.response;

import com.foodorder.paymentservice.model.PaymentMethod;
import com.foodorder.paymentservice.model.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class PaymentResponse {
    private String        id;
    private String        orderId;
    private String        userId;
    private BigDecimal    amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private String        transactionRef;
    private String        notificationMessage;
    private Instant       createdAt;
}
