/*
 * Dados de cadastro do operador.
 * Usado no AuthController.
 */
/*
 * Campos basicos para criar a conta.
 * Mantem os dados organizados no cadastro.
 */
package com.orbital.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "é obrigatório")
    @Size(max = 100, message = "deve ter no máximo 100 caracteres")
    private String nome;

    @NotBlank(message = "é obrigatório")
    @Email(message = "deve ser um e-mail válido")
    @Size(max = 100, message = "deve ter no máximo 100 caracteres")
    private String email;

    @NotBlank(message = "é obrigatória")
    @Size(min = 6, message = "deve ter no mínimo 6 caracteres")
    private String senha;

    @Size(max = 100, message = "deve ter no máximo 100 caracteres")
    private String telefone;

    @Size(max = 150, message = "deve ter no máximo 150 caracteres")
    private String nomeNegocio;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getNomeNegocio() {
        return nomeNegocio;
    }

    public void setNomeNegocio(String nomeNegocio) {
        this.nomeNegocio = nomeNegocio;
    }
}
