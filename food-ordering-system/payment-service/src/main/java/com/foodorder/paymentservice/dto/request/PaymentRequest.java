package com.foodorder.paymentservice.dto.request;

import com.foodorder.paymentservice.model.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotBlank(message = "Order ID is required")
    private String orderId;

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod method;  // COD or BANKING
}
