package com.foodorder.foodservice.controller;

import com.foodorder.foodservice.dto.request.FoodRequest;
import com.foodorder.foodservice.dto.response.ApiResponse;
import com.foodorder.foodservice.dto.response.FoodResponse;
import com.foodorder.foodservice.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Food Service.
 * Base path: /api/v1/foods
 */
@RestController
@RequestMapping("/api/v1/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    /* GET /foods */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getAllFoods() {
        return ResponseEntity.ok(ApiResponse.ok(foodService.getAllFoods()));
    }

    /* GET /foods/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> getFoodById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(foodService.getFoodById(id)));
    }

    /* POST /foods */
    @PostMapping
    public ResponseEntity<ApiResponse<FoodResponse>> createFood(
            @Valid @RequestBody FoodRequest request) {
        FoodResponse data = foodService.createFood(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Food created successfully", data));
    }

    /* PUT /foods/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> updateFood(
            @PathVariable String id,
            @Valid @RequestBody FoodRequest request) {
        FoodResponse data = foodService.updateFood(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Food updated successfully", data));
    }

    /* DELETE /foods/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFood(@PathVariable String id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok(ApiResponse.ok("Food deleted successfully", null));
    }
}
