/*
 * Define o envio de email de recuperacao de senha.
 * Usado no AuthServiceImpl e feito por ResendEmailService.
 */
/*
 * Serve para enviar mensagens de senha para o usuario.
 * A implementacao pode mudar sem afetar o resto.
 */
package com.orbital.backend.service;

public interface EmailService {
    void sendPasswordResetEmail(String to, String operatorName, String resetLink);
}
