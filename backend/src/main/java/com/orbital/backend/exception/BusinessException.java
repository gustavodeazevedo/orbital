/*
 * Erro de regra de negocio com mensagem clara.
 * Lancado pelos services e tratado no GlobalExceptionHandler.
 */
/*
 * Usado quando algo esperado da regra falha.
 * Ajuda a mostrar um aviso simples para o usuario.
 */
package com.orbital.backend.exception;

public class BusinessException extends RuntimeException {

    private final String code;

    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
