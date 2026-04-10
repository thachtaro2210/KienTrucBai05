package com.foodorder.orderservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMongoAuditing
public class AppConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOriginsRaw;

    /** RestTemplate used by service clients for synchronous HTTP calls */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
