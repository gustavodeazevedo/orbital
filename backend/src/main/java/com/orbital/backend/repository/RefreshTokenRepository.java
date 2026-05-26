/*
 * Acesso aos codigos de sessao no banco.
 * Usado pelo AuthServiceImpl.
 */
/*
 * Guarda e remove codigos de sessao.
 * Ajuda a manter o login ativo com seguranca.
 */
package com.orbital.backend.repository;

import com.orbital.backend.model.Operator;
import com.orbital.backend.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByOperatorAndRevokedFalse(Operator operator);
}
