package com.foodorder.foodservice.service;

import com.foodorder.foodservice.dto.request.FoodRequest;
import com.foodorder.foodservice.dto.response.FoodResponse;
import com.foodorder.foodservice.exception.AppException;
import com.foodorder.foodservice.exception.ErrorCode;
import com.foodorder.foodservice.model.Food;
import com.foodorder.foodservice.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;

    /* ── GET all ─────────────────────────────────────────────────── */
    public List<FoodResponse> getAllFoods() {
        return foodRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /* ── GET by id ───────────────────────────────────────────────── */
    public FoodResponse getFoodById(String id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));
        return toResponse(food);
    }

    /* ── CREATE ──────────────────────────────────────────────────── */
    public FoodResponse createFood(FoodRequest request) {
        if (foodRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.FOOD_NAME_EXISTED);
        }

        Food food = Food.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .stock(request.getStock())
                .available(request.isAvailable())
                .build();

        Food saved = foodRepository.save(food);
        log.info("[FoodService] Created food id={}, name={}", saved.getId(), saved.getName());
        return toResponse(saved);
    }

    /* ── UPDATE ──────────────────────────────────────────────────── */
    public FoodResponse updateFood(String id, FoodRequest request) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));

        // Check name uniqueness only if changed
        if (!food.getName().equals(request.getName()) && foodRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.FOOD_NAME_EXISTED);
        }

        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setCategory(request.getCategory());
        food.setImageUrl(request.getImageUrl());
        food.setStock(request.getStock());
        food.setAvailable(request.isAvailable());

        Food updated = foodRepository.save(food);
        log.info("[FoodService] Updated food id={}", updated.getId());
        return toResponse(updated);
    }

    /* ── DELETE ──────────────────────────────────────────────────── */
    public void deleteFood(String id) {
        if (!foodRepository.existsById(id)) {
            throw new AppException(ErrorCode.FOOD_NOT_FOUND);
        }
        foodRepository.deleteById(id);
        log.info("[FoodService] Deleted food id={}", id);
    }

    /* ── Mapper ──────────────────────────────────────────────────── */
    private FoodResponse toResponse(Food food) {
        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .price(food.getPrice())
                .category(food.getCategory())
                .imageUrl(food.getImageUrl())
                .stock(food.getStock())
                .available(food.isAvailable())
                .createdAt(food.getCreatedAt())
                .build();
    }
}
