package com.foodorder.userservice.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Handles JWT token generation and validation.
 */
@Slf4j
@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expirationMs;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private Key signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String userId, String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId",   userId);
        claims.put("username", username);
        claims.put("role",     role);

        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(signingKey(), SignatureAlgorithm.HS256)
                .compact();

        // Save token to Redis
        redisTemplate.opsForValue().set("auth:token:" + token, userId, expirationMs, TimeUnit.MILLISECONDS);
        
        return token;
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token) {
        try {
            // Validate signature
            extractAllClaims(token);
            // Check Redis
            return Boolean.TRUE.equals(redisTemplate.hasKey("auth:token:" + token));
        } catch (Exception ex) {
            log.warn("[JWT] Invalid token: {}", ex.getMessage());
            return false;
        }
    }

    public void revokeToken(String token) {
        redisTemplate.delete("auth:token:" + token);
    }

    public long getExpirationMs() {
        return expirationMs;
    }
}
