/*
 * Tratamento geral de erros da API.
 * Devolve respostas padronizadas para o frontend.
 */
/*
 * Evita respostas diferentes para cada erro.
 * Deixa as mensagens mais claras na tela.
 */
package com.orbital.backend.exception;

import com.orbital.backend.dto.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException exception) {
        HttpStatus status = switch (exception.getCode()) {
            case "AUTH_CONFLICT" -> HttpStatus.CONFLICT;
            case "AUTH_INVALID_CREDENTIALS" -> HttpStatus.UNAUTHORIZED;
            case "AUTH_INVALID_REFRESH_TOKEN" -> HttpStatus.UNAUTHORIZED;
            case "AUTH_RATE_LIMITED" -> HttpStatus.TOO_MANY_REQUESTS;
            case "AUTH_INVALID_RESET_TOKEN" -> HttpStatus.BAD_REQUEST;
            case "AUTH_NOT_FOUND" -> HttpStatus.NOT_FOUND;
            case "RESOURCE_NOT_FOUND" -> HttpStatus.NOT_FOUND;
            case "MAIL_DELIVERY_FAILED" -> HttpStatus.SERVICE_UNAVAILABLE;
            default -> HttpStatus.BAD_REQUEST;
        };

        return ResponseEntity.status(status)
                .body(ApiResponse.failure(exception.getCode(), exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + " " + error.getDefaultMessage())
                .orElse("Dados inválidos");

        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("VALIDATION_ERROR", message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.failure("INTERNAL_ERROR", "Erro interno inesperado"));
    }
}
