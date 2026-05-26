/*
 * Faz as consultas do dashboard no banco.
 * Usado pelos controllers e pelo DashboardHome.
 */
/*
 * Organiza consultas que montam listas e indicadores.
 * Devolve dados prontos para a tela.
 */
package com.orbital.backend.service.impl;

import com.orbital.backend.dto.dashboard.AppointmentListResponse;
import com.orbital.backend.dto.dashboard.ClientListResponse;
import com.orbital.backend.dto.dashboard.ServiceListResponse;
import com.orbital.backend.exception.BusinessException;
import com.orbital.backend.model.Operator;
import com.orbital.backend.repository.OperatorRepository;
import com.orbital.backend.service.DashboardReadService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class DashboardReadServiceImpl implements DashboardReadService {

        private final JdbcTemplate jdbcTemplate;
        private final OperatorRepository operatorRepository;

        public DashboardReadServiceImpl(JdbcTemplate jdbcTemplate, OperatorRepository operatorRepository) {
                this.jdbcTemplate = jdbcTemplate;
                this.operatorRepository = operatorRepository;
        }

        @Override
        public List<ClientListResponse> listClients(String operatorEmail) {
                Integer operatorId = resolveOperatorId(operatorEmail);

                String sql = """
                                SELECT c.id,
                                       c.nome,
                                       c.telefone,
                                       c.email,
                                       c.criado_em,
                                       COUNT(a.id) AS total_atendimentos
                                FROM clients c
                                LEFT JOIN appointments a ON a.cliente_id = c.id
                                WHERE c.operador_id = ?
                                GROUP BY c.id, c.nome, c.telefone, c.email, c.criado_em
                                ORDER BY c.nome ASC
                                """;

                return jdbcTemplate.query(sql, (rs, rowNum) -> new ClientListResponse(
                                rs.getInt("id"),
                                rs.getString("nome"),
                                rs.getString("telefone"),
                                rs.getString("email"),
                                rs.getLong("total_atendimentos"),
                                rs.getTimestamp("criado_em") != null
                                                ? rs.getTimestamp("criado_em").toLocalDateTime()
                                                : null),
                                operatorId);
        }

        @Override
        public List<ServiceListResponse> listServices(String operatorEmail) {
                Integer operatorId = resolveOperatorId(operatorEmail);

                String sql = """
                                SELECT s.id,
                                       s.nome,
                                       s.duracao_minutos,
                                       s.preco,
                                       COUNT(a.id) AS total_atendimentos
                                FROM services s
                                LEFT JOIN appointments a ON a.servico_id = s.id
                                WHERE s.operador_id = ?
                                GROUP BY s.id, s.nome, s.duracao_minutos, s.preco
                                ORDER BY s.nome ASC
                                """;

                return jdbcTemplate.query(sql, (rs, rowNum) -> new ServiceListResponse(
                                rs.getInt("id"),
                                rs.getString("nome"),
                                rs.getInt("duracao_minutos"),
                                rs.getBigDecimal("preco"),
                                rs.getLong("total_atendimentos")), operatorId);
        }

        @Override
        public List<AppointmentListResponse> listAppointments(String operatorEmail, LocalDate from, LocalDate to) {
                Integer operatorId = resolveOperatorId(operatorEmail);

                LocalDate startDate = from != null ? from : LocalDate.now();
                LocalDate endDate = to != null ? to : startDate;

                if (endDate.isBefore(startDate)) {
                        throw new BusinessException("VALIDATION_ERROR",
                                        "A data final não pode ser menor que a data inicial");
                }

                LocalDateTime fromDateTime = startDate.atStartOfDay();
                LocalDateTime toDateTime = endDate.atTime(LocalTime.MAX);

                String sql = """
                                SELECT a.id,
                                       c.id AS client_id,
                                       c.nome AS client_name,
                                       s.id AS service_id,
                                       s.nome AS service_name,
                                       s.duracao_minutos,
                                       s.preco,
                                       a.data_hora,
                                       a.status
                                FROM appointments a
                                INNER JOIN clients c ON c.id = a.cliente_id
                                INNER JOIN services s ON s.id = a.servico_id
                                WHERE c.operador_id = ?
                                  AND a.data_hora >= ?
                                  AND a.data_hora <= ?
                                ORDER BY a.data_hora ASC
                                """;

                return jdbcTemplate.query(sql, (rs, rowNum) -> new AppointmentListResponse(
                                rs.getInt("id"),
                                rs.getInt("client_id"),
                                rs.getString("client_name"),
                                rs.getInt("service_id"),
                                rs.getString("service_name"),
                                rs.getInt("duracao_minutos"),
                                rs.getBigDecimal("preco"),
                                rs.getTimestamp("data_hora").toLocalDateTime(),
                                rs.getString("status")),
                                operatorId,
                                fromDateTime,
                                toDateTime);
        }

        private Integer resolveOperatorId(String operatorEmail) {
                Operator operator = operatorRepository.findByEmail(operatorEmail.toLowerCase().trim())
                                .orElseThrow(() -> new BusinessException("AUTH_NOT_FOUND", "Operador não encontrado"));

                return operator.getId();
        }
}
