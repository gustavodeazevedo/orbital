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
