/*
 * Regras de cadastro, login e reset de senha.
 * Chamado pelo AuthController e conecta com codigos de acesso e email.
 */
/*
 * Junta as regras principais do acesso.
 * Se algo muda no login, o ajuste fica aqui.
 */
package com.orbital.backend.service.impl;

import com.orbital.backend.dto.auth.ForgotPasswordRequest;
import com.orbital.backend.dto.auth.ForgotPasswordResponse;
import com.orbital.backend.dto.auth.LoginRequest;
import com.orbital.backend.dto.auth.LoginResponse;
import com.orbital.backend.dto.auth.OperatorResponse;
import com.orbital.backend.dto.auth.RefreshTokenRequest;
import com.orbital.backend.dto.auth.RegisterRequest;
import com.orbital.backend.dto.auth.ResetPasswordRequest;
import com.orbital.backend.config.JwtTokenService;
import com.orbital.backend.exception.BusinessException;
import com.orbital.backend.model.Operator;
import com.orbital.backend.model.RefreshToken;
import com.orbital.backend.repository.OperatorRepository;
import com.orbital.backend.repository.RefreshTokenRepository;
import com.orbital.backend.service.AuthRateLimiterService;
import com.orbital.backend.service.AuthService;
import com.orbital.backend.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final OperatorRepository operatorRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final AuthRateLimiterService authRateLimiterService;
    private final EmailService emailService;
    private final long passwordResetExpirationMinutes;
    private final String frontendResetPasswordUrl;

    public AuthServiceImpl(
            OperatorRepository operatorRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenService jwtTokenService,
            AuthRateLimiterService authRateLimiterService,
            EmailService emailService,
            @Value("${app.security.password-reset.expiration-minutes}") long passwordResetExpirationMinutes,
            @Value("${app.frontend.reset-password-url}") String frontendResetPasswordUrl) {
        this.operatorRepository = operatorRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
        this.authRateLimiterService = authRateLimiterService;
        this.emailService = emailService;
        this.passwordResetExpirationMinutes = passwordResetExpirationMinutes;
        this.frontendResetPasswordUrl = frontendResetPasswordUrl;
    }

    @Override
    public OperatorResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        operatorRepository.findByEmail(normalizedEmail).ifPresent(operator -> {
            throw new BusinessException("AUTH_CONFLICT", "E-mail já cadastrado");
        });

        Operator operator = new Operator();
        operator.setNome(request.getNome().trim());
        operator.setEmail(normalizedEmail);
        operator.setSenhaHash(passwordEncoder.encode(request.getSenha()));
        operator.setTelefone(request.getTelefone());
        operator.setNomeNegocio(request.getNomeNegocio());

        Operator savedOperator = operatorRepository.save(operator);
        LOGGER.info("Operador registrado com sucesso: {}", savedOperator.getEmail());
        return toOperatorResponse(savedOperator);
    }

    @Override
    public LoginResponse login(LoginRequest request, String clientIp) {
        authRateLimiterService.validateLoginAttempt(clientIp == null ? "unknown" : clientIp);
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Operator operator = operatorRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BusinessException("AUTH_INVALID_CREDENTIALS", "Credenciais inválidas"));

        if (!passwordEncoder.matches(request.getSenha(), operator.getSenhaHash())) {
            LOGGER.warn("Tentativa de login inválida para email: {}", normalizedEmail);
            throw new BusinessException("AUTH_INVALID_CREDENTIALS", "Credenciais inválidas");
        }

        revokeActiveTokens(operator);
        String accessToken = jwtTokenService.generateAccessToken(operator.getEmail());
        String refreshToken = jwtTokenService.generateRefreshToken(operator.getEmail());
        persistRefreshToken(operator, refreshToken);
        LOGGER.info("Login realizado com sucesso: {}", normalizedEmail);
        return new LoginResponse(accessToken, refreshToken, toOperatorResponse(operator));
    }

    @Override
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        operatorRepository.findByEmail(normalizedEmail).ifPresent(operator -> {
            String resetToken = UUID.randomUUID().toString();
            operator.setPasswordResetToken(resetToken);
            operator.setPasswordResetRequestedAt(LocalDateTime.now());
            operator.setPasswordResetTokenExpiresAt(
                    LocalDateTime.now().plus(passwordResetExpirationMinutes, ChronoUnit.MINUTES));
            operatorRepository.save(operator);
            String resetLink = frontendResetPasswordUrl + "?token=" + resetToken;
            try {
                emailService.sendPasswordResetEmail(operator.getEmail(), operator.getNome(), resetLink);
            } catch (Exception exception) {
                LOGGER.error("Falha no envio de e-mail de recuperação para {}", normalizedEmail, exception);
                throw new BusinessException("MAIL_DELIVERY_FAILED", "Não foi possível enviar o e-mail de recuperação");
            }
            LOGGER.info("Token de recuperação gerado para operador: {}", normalizedEmail);
        });

        return new ForgotPasswordResponse("Se o e-mail estiver cadastrado, enviaremos instruções de recuperação");
    }

    @Override
    public ForgotPasswordResponse resetPassword(ResetPasswordRequest request) {
        String token = request.getToken().trim();
        Operator operator = operatorRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new BusinessException("AUTH_INVALID_RESET_TOKEN", "Token inválido ou expirado"));

        LocalDateTime expiresAt = operator.getPasswordResetTokenExpiresAt();
        if (expiresAt == null || LocalDateTime.now().isAfter(expiresAt)) {
            operator.setPasswordResetToken(null);
            operator.setPasswordResetRequestedAt(null);
            operator.setPasswordResetTokenExpiresAt(null);
            operatorRepository.save(operator);
            throw new BusinessException("AUTH_INVALID_RESET_TOKEN", "Token inválido ou expirado");
        }

        operator.setSenhaHash(passwordEncoder.encode(request.getNovaSenha()));
        operator.setPasswordResetToken(null);
        operator.setPasswordResetRequestedAt(null);
        operator.setPasswordResetTokenExpiresAt(null);
        operatorRepository.save(operator);
        revokeActiveTokens(operator);

        LOGGER.info("Senha redefinida com sucesso para operador: {}", operator.getEmail());
        return new ForgotPasswordResponse("Senha redefinida com sucesso");
    }

    @Override
    public LoginResponse refresh(RefreshTokenRequest request) {
        String rawRefreshToken = request.getRefreshToken().trim();

        if (!jwtTokenService.isRefreshToken(rawRefreshToken)) {
            throw new BusinessException("AUTH_INVALID_REFRESH_TOKEN", "Refresh token inválido");
        }

        RefreshToken persistedToken = refreshTokenRepository.findByToken(rawRefreshToken)
                .orElseThrow(() -> new BusinessException("AUTH_INVALID_REFRESH_TOKEN", "Refresh token inválido"));

        if (persistedToken.isRevoked() || LocalDateTime.now().isAfter(persistedToken.getExpiresAt())) {
            persistedToken.setRevoked(true);
            refreshTokenRepository.save(persistedToken);
            throw new BusinessException("AUTH_INVALID_REFRESH_TOKEN", "Refresh token inválido");
        }

        String email = jwtTokenService.extractSubject(rawRefreshToken);
        if (!jwtTokenService.isValid(rawRefreshToken, persistedToken.getOperator().getEmail())
                || !email.equalsIgnoreCase(persistedToken.getOperator().getEmail())) {
            persistedToken.setRevoked(true);
            refreshTokenRepository.save(persistedToken);
            throw new BusinessException("AUTH_INVALID_REFRESH_TOKEN", "Refresh token inválido");
        }

        persistedToken.setRevoked(true);
        refreshTokenRepository.save(persistedToken);

        Operator operator = persistedToken.getOperator();
        String accessToken = jwtTokenService.generateAccessToken(operator.getEmail());
        String newRefreshToken = jwtTokenService.generateRefreshToken(operator.getEmail());
        persistRefreshToken(operator, newRefreshToken);

        return new LoginResponse(accessToken, newRefreshToken, toOperatorResponse(operator));
    }

    @Override
    public void logout(RefreshTokenRequest request) {
        String rawRefreshToken = request.getRefreshToken().trim();
        refreshTokenRepository.findByToken(rawRefreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            LOGGER.info("Sessão invalidada para operador: {}", token.getOperator().getEmail());
        });
    }

    private void persistRefreshToken(Operator operator, String refreshToken) {
        RefreshToken entity = new RefreshToken();
        entity.setOperator(operator);
        entity.setToken(refreshToken);
        entity.setExpiresAt(jwtTokenService.extractExpiration(refreshToken));
        entity.setRevoked(false);
        refreshTokenRepository.save(entity);
    }

    private void revokeActiveTokens(Operator operator) {
        List<RefreshToken> activeTokens = refreshTokenRepository.findByOperatorAndRevokedFalse(operator);
        if (activeTokens.isEmpty()) {
            return;
        }

        activeTokens.forEach(token -> token.setRevoked(true));
        refreshTokenRepository.saveAll(activeTokens);
    }

    private OperatorResponse toOperatorResponse(Operator operator) {
        return new OperatorResponse(
                operator.getId(),
                operator.getNome(),
                operator.getEmail(),
                operator.getTelefone(),
                operator.getNomeNegocio());
    }
}
