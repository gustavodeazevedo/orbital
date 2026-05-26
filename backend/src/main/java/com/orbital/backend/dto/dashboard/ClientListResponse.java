/*
 * Lista de clientes do dashboard.
 * Sai da rota /clients.
 */
/*
 * Formato dos dados quando a tela lista clientes.
 * Deixa a resposta sempre igual para o frontend.
 */
package com.orbital.backend.dto.dashboard;

import java.time.LocalDateTime;

public class ClientListResponse {

    private final Integer id;
    private final String nome;
    private final String telefone;
    private final String email;
    private final long totalAtendimentos;
    private final LocalDateTime criadoEm;

    public ClientListResponse(
            Integer id,
            String nome,
            String telefone,
            String email,
            long totalAtendimentos,
            LocalDateTime criadoEm) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.totalAtendimentos = totalAtendimentos;
        this.criadoEm = criadoEm;
    }

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getEmail() {
        return email;
    }

    public long getTotalAtendimentos() {
        return totalAtendimentos;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}
