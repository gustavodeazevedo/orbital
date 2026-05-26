/*
 * Resposta de recuperacao de senha.
 * Usado no AuthController.
 */
/*
 * Mensagem simples para avisar que o email foi enviado.
 * A tela mostra esse retorno para o usuario.
 */
package com.orbital.backend.dto.auth;

public class ForgotPasswordResponse {

    private final String message;

    public ForgotPasswordResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
