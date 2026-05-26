/*
 * Dados de login.
 * Usado no AuthController e no AuthServiceImpl.
 */
/*
 * Email e senha informados na tela de acesso.
 * Mantem o formato do pedido padronizado.
 */
package com.orbital.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "é obrigatório")
    @Email(message = "deve ser um e-mail válido")
    private String email;

    @NotBlank(message = "é obrigatória")
    private String senha;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
