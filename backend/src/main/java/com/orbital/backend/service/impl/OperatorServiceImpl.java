/*
 * Busca o perfil do operador no banco e monta a resposta.
 * Chamado pelo OperatorController.
 */
/*
 * Faz a consulta e prepara os dados do perfil.
 * Usado quando a tela precisa dessas informacoes.
 */
package com.orbital.backend.service.impl;

import com.orbital.backend.dto.auth.OperatorResponse;
import com.orbital.backend.exception.BusinessException;
import com.orbital.backend.model.Operator;
import com.orbital.backend.repository.OperatorRepository;
import com.orbital.backend.service.OperatorService;
import org.springframework.stereotype.Service;

@Service
public class OperatorServiceImpl implements OperatorService {

    private final OperatorRepository operatorRepository;

    public OperatorServiceImpl(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }

    @Override
    public OperatorResponse getProfile(String email) {
        Operator operator = operatorRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new BusinessException("AUTH_NOT_FOUND", "Operador não encontrado"));

        return new OperatorResponse(
                operator.getId(),
                operator.getNome(),
                operator.getEmail(),
                operator.getTelefone(),
                operator.getNomeNegocio());
    }
}
