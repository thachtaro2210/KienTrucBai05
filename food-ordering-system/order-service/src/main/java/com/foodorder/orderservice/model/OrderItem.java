package com.foodorder.orderservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Embedded sub-document representing a single item in an order.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String     foodId;
    private String     foodName;
    private int        quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;  // unitPrice * quantity
}
