package com.foodorder.orderservice.model;

/**
 * Possible states of an order in its lifecycle.
 */
public enum OrderStatus {
    PENDING,        // Order created, awaiting confirmation
    CONFIRMED,      // Confirmed by the system
    PROCESSING,     // Being prepared
    PAID,           // Payment successful
    DELIVERED,      // Delivered to customer
    CANCELLED       // Cancelled
}
