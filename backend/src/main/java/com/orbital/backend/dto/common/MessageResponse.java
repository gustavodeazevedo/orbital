/*
 * Mensagem simples para respostas de sucesso.
 * Usada em acoes como excluir e logout.
 */
/*
 * Usada quando nao precisa devolver dados.
 * Deixa a resposta mais leve e direta.
 */
package com.orbital.backend.dto.common;

public class MessageResponse {

    private final String message;

    public MessageResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
