package com.foodorder.paymentservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableMongoAuditing
public class AppConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOriginsRaw;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
