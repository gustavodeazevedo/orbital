/*
 * Codigo de sessao para renovar ou sair.
 * Usado no AuthController.
 */
/*
 * Enviado quando precisa renovar o acesso ou fazer logout.
 * Ajuda a manter a sessao ativa com seguranca.
 */
package com.orbital.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class RefreshTokenRequest {

    @NotBlank(message = "é obrigatório")
    private String refreshToken;

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
