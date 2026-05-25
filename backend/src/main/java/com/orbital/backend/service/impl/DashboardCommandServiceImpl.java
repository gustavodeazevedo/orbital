package com.orbital.backend.service.impl;

import com.orbital.backend.dto.dashboard.AppointmentListResponse;
import com.orbital.backend.dto.dashboard.ClientListResponse;
import com.orbital.backend.dto.dashboard.CreateAppointmentRequest;
import com.orbital.backend.dto.dashboard.CreateClientRequest;
import com.orbital.backend.dto.dashboard.CreateServiceRequest;
import com.orbital.backend.dto.dashboard.ServiceListResponse;
import com.orbital.backend.dto.dashboard.UpdateAppointmentRequest;
import com.orbital.backend.dto.dashboard.UpdateClientRequest;
import com.orbital.backend.dto.dashboard.UpdateServiceRequest;
import com.orbital.backend.exception.BusinessException;
import com.orbital.backend.model.Operator;
import com.orbital.backend.repository.OperatorRepository;
import com.orbital.backend.service.DashboardCommandService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardCommandServiceImpl implements DashboardCommandService {

    private final JdbcTemplate jdbcTemplate;
    private final OperatorRepository operatorRepository;

    public DashboardCommandServiceImpl(JdbcTemplate jdbcTemplate, OperatorRepository operatorRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.operatorRepository = operatorRepository;
    }

    @Override
    public ClientListResponse createClient(String operatorEmail, CreateClientRequest request) {
        Integer operatorId = resolveOperatorId(operatorEmail);

        String normalizedName = request.getNome() != null ? request.getNome().trim() : "";
        if (normalizedName.isBlank()) {
            throw new BusinessException("VALIDATION_ERROR", "nome é obrigatório");
        }

        String normalizedPhone = normalizeNullable(request.getTelefone());
        String normalizedEmail = normalizeEmail(request.getEmail());

        String sql = """
                INSERT INTO clients (operador_id, nome, telefone, email)
                VALUES (?, ?, ?, ?)
                RETURNING id, nome, telefone, email, criado_em
                """;

        return jdbcTemplate.queryForObject(sql,
                (rs, rowNum) -> new ClientListResponse(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("telefone"),
                        rs.getString("email"),
                        0,
                        rs.getTimestamp("criado_em").toLocalDateTime()),
                operatorId,
                normalizedName,
                normalizedPhone,
                normalizedEmail);
    }

    @Override
    public ClientListResponse updateClient(
            String operatorEmail,
            Integer clientId,
            UpdateClientRequest request) {
        Integer operatorId = resolveOperatorId(operatorEmail);

        String normalizedName = request.getNome() != null ? request.getNome().trim() : "";
        if (normalizedName.isBlank()) {
            throw new BusinessException("VALIDATION_ERROR", "nome é obrigatório");
        }

        String normalizedPhone = normalizeNullable(request.getTelefone());
        String normalizedEmail = normalizeEmail(request.getEmail());

        String sql = """
                WITH updated AS (
                    UPDATE clients
                    SET nome = ?, telefone = ?, email = ?
                    WHERE id = ? AND operador_id = ?
                    RETURNING id, nome, telefone, email, criado_em
                )
                SELECT u.id,
                       u.nome,
                       u.telefone,
                       u.email,
                       u.criado_em,
                       COUNT(a.id) AS total_atendimentos
                FROM updated u
                LEFT JOIN appointments a ON a.cliente_id = u.id
                GROUP BY u.id, u.nome, u.telefone, u.email, u.criado_em
                """;

        try {
            return jdbcTemplate.queryForObject(sql,
                    (rs, rowNum) -> new ClientListResponse(
                            rs.getInt("id"),
                            rs.getString("nome"),
                            rs.getString("telefone"),
                            rs.getString("email"),
                            rs.getLong("total_atendimentos"),
                            rs.getTimestamp("criado_em") != null
                                    ? rs.getTimestamp("criado_em").toLocalDateTime()
                                    : null),
                    normalizedName,
                    normalizedPhone,
                    normalizedEmail,
                    clientId,
                    operatorId);
        } catch (EmptyResultDataAccessException ex) {
            throw new BusinessException("RESOURCE_NOT_FOUND", "Cliente não encontrado");
        }
    }

    @Override
    public void deleteClient(String operatorEmail, Integer clientId) {
        Integer operatorId = resolveOperatorId(operatorEmail);

        int rows = jdbcTemplate.update(
                "DELETE FROM clients WHERE id = ? AND operador_id = ?",
                clientId,
                operatorId);

        if (rows == 0) {
            throw new BusinessException("RESOURCE_NOT_FOUND", "Cliente não encontrado");
        }
    }

    @Override
    public ServiceListResponse createService(String operatorEmail, CreateServiceRequest request) {
        Integer operatorId = resolveOperatorId(operatorEmail);

        String normalizedName = request.getNome() != null ? request.getNome().trim() : "";
        if (normalizedName.isBlank()) {
            throw new BusinessException("VALIDATION_ERROR", "nome é obrigatório");
        }

        if (request.getDuracaoMinutos() == null || request.getDuracaoMinutos() <= 0) {
            throw new BusinessException("VALIDATION_ERROR", "duração deve ser maior que zero");
        }

        BigDecimal price = request.getPreco();
        if (price != null && price.signum() < 0) {
            throw new BusinessException("VALIDATION_ERROR", "preço deve ser maior ou igual a zero");
        }

        String sql = """
                INSERT INTO services (operador_id, nome, duracao_minutos, preco)
                VALUES (?, ?, ?, ?)
                RETURNING id, nome, duracao_minutos, preco
                """;

        return jdbcTemplate.queryForObject(sql,
                (rs, rowNum) -> new ServiceListResponse(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getInt("duracao_minutos"),
                        rs.getBigDecimal("preco"),
                        0),
                operatorId,
                normalizedName,
                request.getDuracaoMinutos(),
                price);
    }

    @Override
    public ServiceListResponse updateService(
            String operatorEmail,
            Integer serviceId,
            UpdateServiceRequest request) {
        Integer operatorId = resolveOperatorId(operatorEmail);

        String normalizedName = request.getNome() != null ? request.getNome().trim() : "";
        if (normalizedName.isBlank()) {
            throw new BusinessException("VALIDATION_ERROR", "nome é obrigatório");
        }

        if (request.getDuracaoMinutos() == null || request.getDuracaoMinutos() <= 0) {
            throw new BusinessException("VALIDATION_ERROR", "duração deve ser maior que zero");
        }

        BigDecimal price = request.getPreco();
        if (price != null && price.signum() < 0) {
            throw new BusinessException("VALIDATION_ERROR", "preço deve ser maior ou igual a zero");
        }

        String sql = """
                WITH updated AS (
                    UPDATE services
                    SET nome = ?, duracao_minutos = ?, preco = ?
                    WHERE id = ? AND operador_id = ?
                    RETURNING id, nome, duracao_minutos, preco
                )
                SELECT u.id,
                       u.nome,
                       u.duracao_minutos,
                       u.preco,
                       COUNT(a.id) AS total_atendimentos
                FROM updated u
                LEFT JOIN appointments a ON a.servico_id = u.id
                GROUP BY u.id, u.nome, u.duracao_minutos, u.preco
                """;

        try {
            return jdbcTemplate.queryForObject(sql,
                    (rs, rowNum) -> new ServiceListResponse(
                            rs.getInt("id"),
                            rs.getString("nome"),
                            rs.getInt("duracao_minutos"),
                            rs.getBigDecimal("preco"),
                            rs.getLong("total_atendimentos")),
                    normalizedName,
                    request.getDuracaoMinutos(),
                    price,
                    serviceId,
                    operatorId);
        } catch (EmptyResultDataAccessException ex) {
            throw new BusinessException("RESOURCE_NOT_FOUND", "Serviço não encontrado");
        }
    }

    @Override
    public void deleteService(String operatorEmail, Integer serviceId) {
        Integer operatorId = resolveOperatorId(operatorEmail);

        int rows = jdbcTemplate.update(
                "DELETE FROM services WHERE id = ? AND operador_id = ?",
                serviceId,
                operatorId);

        if (rows == 0) {
            throw new BusinessException("RESOURCE_NOT_FOUND", "Serviço não encontrado");
        }
    }

    @Override
    public AppointmentListResponse createAppointment(String operatorEmail, CreateAppointmentRequest request) {
        Integer operatorId = resolveOperatorId(operatorEmail);

        if (request.getClientId() == null || request.getServiceId() == null) {
            throw new BusinessException("VALIDATION_ERROR", "cliente e serviço são obrigatórios");
        }

        if (request.getScheduledAt() == null) {
            throw new BusinessException("VALIDATION_ERROR", "data/hora é obrigatória");
        }

        if (request.getScheduledAt().isBefore(java.time.LocalDateTime.now())) {
            throw new BusinessException("VALIDATION_ERROR", "a data/hora deve ser futura");
        }

        String normalizedStatus = normalizeStatus(request.getStatus());

        Long clientCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM clients WHERE id = ? AND operador_id = ?",
                Long.class,
                request.getClientId(),
                operatorId);
        if (clientCount == null || clientCount == 0) {
            throw new BusinessException("VALIDATION_ERROR", "cliente inválido para este operador");
        }

        Long serviceCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM services WHERE id = ? AND operador_id = ?",
                Long.class,
                request.getServiceId(),
                operatorId);
        if (serviceCount == null || serviceCount == 0) {
            throw new BusinessException("VALIDATION_ERROR", "serviço inválido para este operador");
        }

        Integer appointmentId = jdbcTemplate.queryForObject(
                """
                        INSERT INTO appointments (cliente_id, servico_id, data_hora, status)
                        VALUES (?, ?, ?, ?)
                        RETURNING id
                        """,
                Integer.class,
                request.getClientId(),
                request.getServiceId(),
                request.getScheduledAt(),
                normalizedStatus);

        if (appointmentId == null) {
            throw new BusinessException("INTERNAL_ERROR", "não foi possível criar o agendamento");
        }

        return jdbcTemplate.queryForObject(
                """
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
                        WHERE a.id = ?
                        """,
                (rs, rowNum) -> new AppointmentListResponse(
                        rs.getInt("id"),
                        rs.getInt("client_id"),
                        rs.getString("client_name"),
                        rs.getInt("service_id"),
                        rs.getString("service_name"),
                        rs.getInt("duracao_minutos"),
                        rs.getBigDecimal("preco"),
                        rs.getTimestamp("data_hora").toLocalDateTime(),
                        rs.getString("status")),
                appointmentId);
    }

    @Override
    public AppointmentListResponse updateAppointment(
            String operatorEmail,
            Integer appointmentId,
            UpdateAppointmentRequest request) {
        Integer operatorId = resolveOperatorId(operatorEmail);

        if (request.getClientId() == null || request.getServiceId() == null) {
            throw new BusinessException("VALIDATION_ERROR", "cliente e serviço são obrigatórios");
        }

        if (request.getScheduledAt() == null) {
            throw new BusinessException("VALIDATION_ERROR", "data/hora é obrigatória");
        }

        String normalizedStatus = normalizeStatus(request.getStatus());

        Long clientCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM clients WHERE id = ? AND operador_id = ?",
                Long.class,
                request.getClientId(),
                operatorId);
        if (clientCount == null || clientCount == 0) {
            throw new BusinessException("VALIDATION_ERROR", "cliente inválido para este operador");
        }

        Long serviceCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM services WHERE id = ? AND operador_id = ?",
                Long.class,
                request.getServiceId(),
                operatorId);
        if (serviceCount == null || serviceCount == 0) {
            throw new BusinessException("VALIDATION_ERROR", "serviço inválido para este operador");
        }

        String sql = """
                WITH updated AS (
                    UPDATE appointments a
                    SET cliente_id = ?,
                        servico_id = ?,
                        data_hora = ?,
                        status = ?
                    WHERE a.id = ?
                      AND EXISTS (
                          SELECT 1
                          FROM clients c
                          WHERE c.id = a.cliente_id AND c.operador_id = ?
                      )
                    RETURNING a.id
                )
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
                INNER JOIN updated u ON u.id = a.id
                INNER JOIN clients c ON c.id = a.cliente_id
                INNER JOIN services s ON s.id = a.servico_id
                """;

        try {
            return jdbcTemplate.queryForObject(sql,
                    (rs, rowNum) -> new AppointmentListResponse(
                            rs.getInt("id"),
                            rs.getInt("client_id"),
                            rs.getString("client_name"),
                            rs.getInt("service_id"),
                            rs.getString("service_name"),
                            rs.getInt("duracao_minutos"),
                            rs.getBigDecimal("preco"),
                            rs.getTimestamp("data_hora").toLocalDateTime(),
                            rs.getString("status")),
                    request.getClientId(),
                    request.getServiceId(),
                    request.getScheduledAt(),
                    normalizedStatus,
                    appointmentId,
                    operatorId);
        } catch (EmptyResultDataAccessException ex) {
            throw new BusinessException("RESOURCE_NOT_FOUND", "Agendamento não encontrado");
        }
    }

    private Integer resolveOperatorId(String operatorEmail) {
        Operator operator = operatorRepository.findByEmail(operatorEmail.toLowerCase().trim())
                .orElseThrow(() -> new BusinessException("AUTH_NOT_FOUND", "Operador não encontrado"));

        return operator.getId();
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeEmail(String value) {
        String normalized = normalizeNullable(value);
        if (normalized == null) {
            return null;
        }
        return normalized.toLowerCase();
    }

    private String normalizeStatus(String value) {
        String normalized = value != null ? value.trim().toLowerCase() : "";
        if (normalized.isBlank()) {
            throw new BusinessException("VALIDATION_ERROR", "status é obrigatório");
        }
        return normalized;
    }
}
