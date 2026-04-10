package com.foodorder.foodservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class FoodResponse {
    private String     id;
    private String     name;
    private String     description;
    private BigDecimal price;
    private String     category;
    private String     imageUrl;
    private int        stock;
    private boolean    available;
    private Instant    createdAt;
}
