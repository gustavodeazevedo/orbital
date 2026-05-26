/*
 * Define o limite de tentativas de login.
 * Usado no AuthServiceImpl e feito por AuthRateLimiterServiceImpl.
 */
/*
 * Ajuda a bloquear tentativas repetidas em pouco tempo.
 * Protege o sistema contra abuso de senha.
 */
package com.orbital.backend.service;

public interface AuthRateLimiterService {
    void validateLoginAttempt(String key);
}
