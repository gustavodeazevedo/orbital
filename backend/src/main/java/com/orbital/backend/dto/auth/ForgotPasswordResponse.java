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
