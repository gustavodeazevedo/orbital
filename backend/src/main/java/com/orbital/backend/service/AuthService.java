/*
 * Define cadastro, login e reset de senha.
 * Usado no AuthController e feito por AuthServiceImpl.
 */
/*
 * Centraliza as regras de acesso do sistema.
 * Mantem tudo em um lugar para ficar mais facil de manter.
 */
package com.orbital.backend.service;

import com.orbital.backend.dto.auth.ForgotPasswordRequest;
import com.orbital.backend.dto.auth.ForgotPasswordResponse;
import com.orbital.backend.dto.auth.LoginRequest;
import com.orbital.backend.dto.auth.LoginResponse;
import com.orbital.backend.dto.auth.OperatorResponse;
import com.orbital.backend.dto.auth.RefreshTokenRequest;
import com.orbital.backend.dto.auth.RegisterRequest;
import com.orbital.backend.dto.auth.ResetPasswordRequest;

public interface AuthService {

    OperatorResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request, String clientIp);

    ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request);

    ForgotPasswordResponse resetPassword(ResetPasswordRequest request);

    LoginResponse refresh(RefreshTokenRequest request);

    void logout(RefreshTokenRequest request);
}
