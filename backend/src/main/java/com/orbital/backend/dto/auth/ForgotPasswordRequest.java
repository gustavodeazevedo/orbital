/*
 * Pedido de recuperacao de senha.
 * Usado no AuthController e no AuthServiceImpl.
 */
/*
 * Envia o email que vai receber o link ou codigo.
 * Serve para iniciar o processo de troca.
 */
package com.orbital.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {

    @NotBlank(message = "é obrigatório")
    @Email(message = "deve ser um e-mail válido")
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
