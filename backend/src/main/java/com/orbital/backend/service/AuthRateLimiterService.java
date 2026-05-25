package com.orbital.backend.service;

public interface AuthRateLimiterService {
    void validateLoginAttempt(String key);
}
