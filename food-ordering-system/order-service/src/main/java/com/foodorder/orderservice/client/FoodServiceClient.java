package com.foodorder.orderservice.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.util.Map;

@FeignClient(name = "food-service", url = "${services.food-service.url}")
public interface FoodServiceClient {

    @GetMapping("/api/v1/foods/{id}")
    FoodApiResponse getFoodByIdRaw(@PathVariable("id") String id);

    default FoodDto getFoodById(String id) {
        try {
            FoodApiResponse response = getFoodByIdRaw(id);
            if (response != null && response.getData() != null) {
                Map<String, Object> data = response.getData();
                FoodDto foodDto = new FoodDto();
                foodDto.setId((String) data.get("id"));
                foodDto.setName((String) data.get("name"));
                
                Object priceObj = data.get("price");
                if (priceObj instanceof Number) {
                    foodDto.setPrice(BigDecimal.valueOf(((Number) priceObj).doubleValue()));
                } else if (priceObj instanceof String) {
                    foodDto.setPrice(new BigDecimal((String) priceObj));
                }
                
                return foodDto;
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    @Data
    class FoodDto {
        private String id;
        private String name;
        private BigDecimal price;
    }

    @Data
    class FoodApiResponse {
        private boolean success;
        private int code;
        private String message;
        private Map<String, Object> data;
    }
}
