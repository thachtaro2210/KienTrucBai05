package com.foodorder.paymentservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {

    @Id
    private String        id;

    private String        orderId;
    private String        userId;
    private BigDecimal    amount;

    @Builder.Default
    private PaymentMethod method = PaymentMethod.COD;

    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    /** Transaction reference (fake for demo) */
    private String transactionRef;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
