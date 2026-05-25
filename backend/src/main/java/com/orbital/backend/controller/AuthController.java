package com.orbital.backend.controller;

import com.orbital.backend.dto.auth.ForgotPasswordRequest;
import com.orbital.backend.dto.auth.ForgotPasswordResponse;
import com.orbital.backend.dto.auth.LoginRequest;
import com.orbital.backend.dto.auth.LoginResponse;
import com.orbital.backend.dto.auth.OperatorResponse;
import com.orbital.backend.dto.auth.RefreshTokenRequest;
import com.orbital.backend.dto.auth.RegisterRequest;
import com.orbital.backend.dto.auth.ResetPasswordRequest;
import com.orbital.backend.dto.common.ApiResponse;
import com.orbital.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<OperatorResponse>> register(@Valid @RequestBody RegisterRequest request) {
        OperatorResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest) {
        String clientIp = servletRequest.getRemoteAddr();
        LoginResponse response = authService.login(request, clientIp);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        ForgotPasswordResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        ForgotPasswordResponse response = authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refresh(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(ApiResponse.success(new ForgotPasswordResponse("Sessão encerrada com sucesso")));
    }
}
