package com.orbital.backend.dto.dashboard;

import java.math.BigDecimal;

public class ServiceListResponse {

    private final Integer id;
    private final String nome;
    private final Integer duracaoMinutos;
    private final BigDecimal preco;
    private final long totalAtendimentos;

    public ServiceListResponse(
            Integer id,
            String nome,
            Integer duracaoMinutos,
            BigDecimal preco,
            long totalAtendimentos) {
        this.id = id;
        this.nome = nome;
        this.duracaoMinutos = duracaoMinutos;
        this.preco = preco;
        this.totalAtendimentos = totalAtendimentos;
    }

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public Integer getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public long getTotalAtendimentos() {
        return totalAtendimentos;
    }
}
