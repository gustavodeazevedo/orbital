/*
 * Limita tentativas de login em um intervalo de tempo.
 * Chamado pelo AuthServiceImpl.
 */
/*
 * Decide se o usuario pode tentar de novo agora.
 * Usa uma janela de tempo para contar tentativas.
 */
package com.orbital.backend.service.impl;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import com.orbital.backend.exception.BusinessException;
import com.orbital.backend.service.AuthRateLimiterService;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthRateLimiterServiceImpl implements AuthRateLimiterService {

    private static final int MAX_ATTEMPTS = 10;
    private static final Duration REFILL_DURATION = Duration.ofMinutes(1);

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public void validateLoginAttempt(String key) {
        Bucket bucket = buckets.computeIfAbsent(key, ignored -> createBucket());
        if (!bucket.tryConsume(1)) {
            throw new BusinessException("AUTH_RATE_LIMITED", "Muitas tentativas. Tente novamente em instantes");
        }
    }

    private Bucket createBucket() {
        Bandwidth limit = Bandwidth.classic(MAX_ATTEMPTS, Refill.greedy(MAX_ATTEMPTS, REFILL_DURATION));
        return Bucket.builder().addLimit(limit).build();
    }
}
