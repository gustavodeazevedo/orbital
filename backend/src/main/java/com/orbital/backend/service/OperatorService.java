/*
 * Define como buscar o perfil do operador.
 * Usado pelo OperatorController e feito em OperatorServiceImpl.
 */
/*
 * Ajuda a montar as informacoes da conta exibidas no dashboard.
 * Deixa o controller mais simples.
 */
package com.orbital.backend.service;

import com.orbital.backend.dto.auth.OperatorResponse;

public interface OperatorService {
    OperatorResponse getProfile(String email);
}
