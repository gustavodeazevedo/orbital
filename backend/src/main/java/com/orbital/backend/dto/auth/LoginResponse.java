/*
 * Resposta de login com dados do operador e codigos de acesso.
 * Usado no AuthServiceImpl e no frontend.
 */
/*
 * Usado para iniciar a sessao e guardar informacoes basicas.
 * A tela usa esses dados para seguir no fluxo.
 */
package com.orbital.backend.dto.auth;

public class LoginResponse {

    private final String accessToken;
    private final String refreshToken;
    private final OperatorResponse operator;

    public LoginResponse(String accessToken, String refreshToken, OperatorResponse operator) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.operator = operator;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public OperatorResponse getOperator() {
        return operator;
    }
}
