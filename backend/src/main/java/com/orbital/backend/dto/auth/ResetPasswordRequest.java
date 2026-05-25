package com.orbital.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @NotBlank(message = "é obrigatório")
    private String token;

    @NotBlank(message = "é obrigatória")
    @Size(min = 8, message = "deve ter no mínimo 8 caracteres")
    private String novaSenha;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }
}
