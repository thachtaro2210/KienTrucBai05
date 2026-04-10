package com.foodorder.foodservice.repository;

import com.foodorder.foodservice.model.Food;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodRepository extends MongoRepository<Food, String> {
    Optional<Food> findByName(String name);
    boolean existsByName(String name);
    List<Food> findByCategory(String category);
    List<Food> findByAvailableTrue();
}
