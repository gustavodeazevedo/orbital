/*
 * Gera e valida os codigos de acesso do login.
 * Usado pelo AuthServiceImpl e pelo filtro de autenticacao.
 */
/*
 * Cuida da criacao e checagem dos codigos de acesso.
 * Garantia de que o token ainda vale.
 */
package com.orbital.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtTokenService {

    private final SecretKey signingKey;
    private final long accessExpirationMinutes;
    private final long refreshExpirationDays;

    public JwtTokenService(
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.expiration-minutes}") long accessExpirationMinutes,
            @Value("${app.security.refresh.expiration-days}") long refreshExpirationDays) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpirationMinutes = accessExpirationMinutes;
        this.refreshExpirationDays = refreshExpirationDays;
    }

    public String generateAccessToken(String email) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(accessExpirationMinutes, ChronoUnit.MINUTES);

        return Jwts.builder()
                .subject(email)
                .claim("typ", "access")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(signingKey)
                .compact();
    }

    public String generateRefreshToken(String email) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(refreshExpirationDays, ChronoUnit.DAYS);

        return Jwts.builder()
                .subject(email)
                .claim("typ", "refresh")
                .id(UUID.randomUUID().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(signingKey)
                .compact();
    }

    public String extractSubject(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public boolean isValid(String token, String expectedEmail) {
        try {
            String subject = extractSubject(token);
            return subject.equalsIgnoreCase(expectedEmail);
        } catch (Exception ignored) {
            return false;
        }
    }

    public LocalDateTime extractExpiration(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return LocalDateTime.ofInstant(claims.getExpiration().toInstant(), ZoneId.systemDefault());
    }

    public boolean isRefreshToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return "refresh".equals(claims.get("typ", String.class));
        } catch (Exception ignored) {
            return false;
        }
    }
}
