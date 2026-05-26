/*
 * Dados para atualizar um cliente.
 * Usado no ClientController e no DashboardCommandServiceImpl.
 */
/*
 * Define os campos editaveis do cliente.
 * Usado quando a tela salva mudancas.
 */
package com.orbital.backend.dto.dashboard;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateClientRequest {

    @NotBlank(message = "é obrigatório")
    @Size(max = 100, message = "deve ter no máximo 100 caracteres")
    private String nome;

    @Size(max = 100, message = "deve ter no máximo 100 caracteres")
    private String telefone;

    @Email(message = "deve ser um e-mail válido")
    @Size(max = 100, message = "deve ter no máximo 100 caracteres")
    private String email;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
