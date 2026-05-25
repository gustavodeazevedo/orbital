package com.orbital.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orbital.backend.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResendEmailService implements EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResendEmailService.class);
    private static final Pattern TOKEN_PATTERN = Pattern.compile("[?&]token=([^&]+)");

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String from;
    private final String resendApiUrl;
    private final String resendApiKey;

    public ResendEmailService(
            ObjectMapper objectMapper,
            @Value("${app.email.from}") String from,
            @Value("${app.email.resend.api-url}") String resendApiUrl,
            @Value("${app.email.resend.api-key}") String resendApiKey) {
        this.objectMapper = objectMapper;
        this.from = from;
        this.resendApiUrl = resendApiUrl;
        this.resendApiKey = resendApiKey;
        this.httpClient = HttpClient.newHttpClient();
    }

    @Override
    public void sendPasswordResetEmail(String to, String operatorName, String resetLink) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY nao configurada");
        }

        String payload = buildPayload(to, operatorName, resetLink);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(resendApiUrl))
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int statusCode = response.statusCode();

            if (statusCode < 200 || statusCode >= 300) {
                LOGGER.error("Falha no envio de e-mail via Resend. status={}, body={}", statusCode, response.body());
                throw new IllegalStateException("Falha ao enviar e-mail via Resend");
            }

            LOGGER.info("E-mail de recuperacao enviado para {}", to);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Envio de e-mail interrompido", exception);
        } catch (IOException exception) {
            throw new IllegalStateException("Falha de comunicacao com o Resend", exception);
        }
    }

    private String buildPayload(String to, String operatorName, String resetLink) {
        String resetToken = extractToken(resetLink);

        Map<String, Object> payload = Map.of(
                "from", from,
                "to", List.of(to),
                "subject", "Orbital - Redefinicao de senha",
                "text", buildTextBody(operatorName, resetLink, resetToken),
                "html", buildHtmlBody(operatorName, resetLink, resetToken));

        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Falha ao serializar payload de e-mail", exception);
        }
    }

    private String buildTextBody(String operatorName, String resetLink, String resetToken) {
        return "Ola, " + operatorName + "!\n\n"
                + "Recebemos uma solicitacao para redefinir sua senha na Orbital.\n"
                + "Token de recuperacao (copie e cole no app):\n"
                + resetToken + "\n\n"
                + "Use o link abaixo para continuar:\n"
                + resetLink + "\n\n"
                + "Se voce nao solicitou essa alteracao, ignore esta mensagem.\n\n"
                + "Equipe Orbital";
    }

    private String buildHtmlBody(String operatorName, String resetLink, String resetToken) {
        return "<div style=\"margin:0;padding:24px;background:#f5f7fb;\">"
                + "<div style=\"max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;"
                + "border-radius:16px;overflow:hidden;font-family:Arial,sans-serif;color:#111827;\">"
                + "<div style=\"padding:20px 24px;background:#0f172a;color:#ffffff;\">"
                + "<div style=\"font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:0.8;\">Orbital</div>"
                + "<h1 style=\"margin:8px 0 0 0;font-size:22px;line-height:1.3;\">Redefinicao de senha</h1>"
                + "</div>"
                + "<div style=\"padding:24px;line-height:1.6;\">"
                + "<p style=\"margin:0 0 12px 0;\">Ola, <strong>" + escapeHtml(operatorName) + "</strong>!</p>"
                + "<p style=\"margin:0 0 16px 0;color:#374151;\">"
                + "Recebemos uma solicitacao para redefinir sua senha. Siga os passos abaixo para continuar com seguranca."
                + "</p>"
                + "<div style=\"margin:0 0 16px 0;padding:14px;border:1px solid #d1d5db;border-radius:12px;background:#f9fafb;\">"
                + "<p style=\"margin:0 0 8px 0;font-size:13px;color:#4b5563;\">Passo 1: copie o token</p>"
                + "<div style=\"padding:12px;border-radius:10px;background:#111827;color:#f9fafb;"
                + "font-family:Consolas,Monaco,monospace;font-size:15px;word-break:break-all;\">"
                + escapeHtml(resetToken)
                + "</div>"
                + "<p style=\"margin:8px 0 0 0;font-size:12px;color:#6b7280;\">"
                + "Dica: selecione todo o codigo acima e use Ctrl+C (ou Cmd+C)."
                + "</p>"
                + "</div>"
                + "<div style=\"margin:0 0 16px 0;padding:14px;border:1px solid #d1d5db;border-radius:12px;background:#f9fafb;\">"
                + "<p style=\"margin:0 0 10px 0;font-size:13px;color:#4b5563;\">Passo 2: abra a tela de redefinicao</p>"
                + "<a href=\"" + escapeHtml(resetLink)
                + "\" style=\"display:inline-block;padding:11px 16px;background:#0f172a;"
                + "color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;\">Abrir Orbital</a>"
                + "</div>"
                + "<p style=\"margin:0 0 10px 0;color:#374151;\">"
                + "Na tela, cole o token no campo correspondente e defina a nova senha."
                + "</p>"
                + "<p style=\"margin:20px 0 0 0;font-size:12px;color:#6b7280;\">"
                + "Se voce nao solicitou essa alteracao, ignore este e-mail."
                + "</p>"
                + "</div>"
                + "</div>"
                + "</div>";
    }

    private String extractToken(String resetLink) {
        Matcher matcher = TOKEN_PATTERN.matcher(resetLink);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "";
    }

    private String escapeHtml(String value) {
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
