package com.orbital.backend.dto.dashboard;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class UpdateServiceRequest {

    @NotBlank(message = "é obrigatório")
    @Size(max = 120, message = "deve ter no máximo 120 caracteres")
    private String nome;

    @NotNull(message = "é obrigatória")
    @Positive(message = "deve ser maior que zero")
    private Integer duracaoMinutos;

    @DecimalMin(value = "0.0", inclusive = true, message = "deve ser maior ou igual a zero")
    private BigDecimal preco;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public void setDuracaoMinutos(Integer duracaoMinutos) {
        this.duracaoMinutos = duracaoMinutos;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
}
