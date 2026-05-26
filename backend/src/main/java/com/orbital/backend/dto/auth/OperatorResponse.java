/*
 * Dados do perfil do operador.
 * Usado no AuthServiceImpl e no OperatorServiceImpl.
 */
/*
 * Resposta usada para mostrar informacoes da conta.
 * Usada no login e no carregamento do perfil.
 */
package com.orbital.backend.dto.auth;

public class OperatorResponse {

    private final Integer id;
    private final String nome;
    private final String email;
    private final String telefone;
    private final String nomeNegocio;

    public OperatorResponse(Integer id, String nome, String email, String telefone, String nomeNegocio) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.nomeNegocio = nomeNegocio;
    }

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getNomeNegocio() {
        return nomeNegocio;
    }
}
