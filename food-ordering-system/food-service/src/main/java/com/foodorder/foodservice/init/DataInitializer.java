package com.foodorder.foodservice.init;

import com.foodorder.foodservice.model.Food;
import com.foodorder.foodservice.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * DataInitializer — seeds sample food menu data on startup.
 *
 * ┌────────────────────────────────────────────────────────────┐
 * │  TOGGLE via application.yml:                               │
 * │   app.data.init.enabled: true   → seed data on startup    │
 * │   app.data.init.enabled: false  → skip seeding            │
 * │                                                            │
 * │  Or via env var:  DATA_INIT_ENABLED=false                  │
 * └────────────────────────────────────────────────────────────┘
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final FoodRepository foodRepository;

    @Value("${app.data.init.enabled:true}")
    private boolean initEnabled;

    @Override
    public void run(String... args) {
        if (!initEnabled) {
            log.info("[DataInitializer] Food seeding DISABLED");
            return;
        }
        if (foodRepository.count() > 0) {
            log.info("[DataInitializer] Foods already exist — skipping seed");
            return;
        }

        log.info("[DataInitializer] Seeding food menu...");

        List<Food> foods = List.of(
            Food.builder().name("Cơm tấm sườn bì chả").description("Cơm tấm đặc biệt đầy đủ món").price(new BigDecimal("45000")).category("Cơm").stock(50).available(true).imageUrl("https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400").build(),
            Food.builder().name("Phở bò tái nạm").description("Phở truyền thống với bò tái và nạm mềm").price(new BigDecimal("55000")).category("Phở").stock(30).available(true).imageUrl("https://images.unsplash.com/photo-1582878826629-29b7ad1ddc7e?w=400").build(),
            Food.builder().name("Bún bò Huế").description("Bún bò cay đặc trưng miền Trung").price(new BigDecimal("50000")).category("Bún").stock(40).available(true).imageUrl("https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400").build(),
            Food.builder().name("Bánh mì thịt đặc biệt").description("Bánh mì Sài Gòn với nhân đầy đủ").price(new BigDecimal("25000")).category("Bánh mì").stock(100).available(true).imageUrl("https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400").build(),
            Food.builder().name("Gà nướng sa tế").description("Gà nướng thơm với sốt sa tế đặc biệt").price(new BigDecimal("85000")).category("Gà").stock(20).available(true).imageUrl("https://images.unsplash.com/photo-1598103442097-8b74394b95c1?w=400").build(),
            Food.builder().name("Bún chả Hà Nội").description("Bún chả đúng điệu Hà Nội").price(new BigDecimal("60000")).category("Bún").stock(25).available(true).imageUrl("https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400").build(),
            Food.builder().name("Cháo lòng đặc biệt").description("Cháo nóng hổi với lòng heo tươi").price(new BigDecimal("40000")).category("Cháo").stock(35).available(true).imageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400").build(),
            Food.builder().name("Mì Ý sốt bò bằm").description("Spaghetti Bolognese kiểu Việt").price(new BigDecimal("70000")).category("Mì").stock(30).available(true).imageUrl("https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400").build(),
            Food.builder().name("Trà sữa trân châu").description("Trà sữa thơm ngon với trân châu dai").price(new BigDecimal("35000")).category("Đồ uống").stock(80).available(true).imageUrl("https://images.unsplash.com/photo-1558857563-c0c8e538efe0?w=400").build(),
            Food.builder().name("Nước cam ép tươi").description("Cam ép nguyên chất 100% không đường").price(new BigDecimal("30000")).category("Đồ uống").stock(60).available(true).imageUrl("https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400").build()
        );

        foodRepository.saveAll(foods);
        log.info("[DataInitializer] Seeded {} food items successfully", foods.size());
    }
}
