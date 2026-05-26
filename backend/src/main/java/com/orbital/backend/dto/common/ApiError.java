/*
 * Detalhes de erro da API.
 * Usado no ApiResponse e no GlobalExceptionHandler.
 */
/*
 * Guarda uma mensagem simples e um codigo de erro.
 * Ajuda a interface a explicar o problema.
 */
package com.orbital.backend.dto.common;

import java.time.LocalDateTime;

public class ApiError {

    private final String code;
    private final String message;
    private final LocalDateTime timestamp;

    public ApiError(String code, String message) {
        this.code = code;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
