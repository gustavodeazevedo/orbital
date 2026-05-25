CREATE TABLE IF NOT EXISTS operators (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR NOT NULL,
    telefone VARCHAR(100),
    nome_negocio VARCHAR(150),
    password_reset_token VARCHAR(255),
    password_reset_requested_at TIMESTAMP,
    password_reset_token_expires_at TIMESTAMP,
    criado_em TIMESTAMP NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_operators_password_reset_token
    ON operators (password_reset_token)
    WHERE password_reset_token IS NOT NULL;

CREATE TABLE IF NOT EXISTS clients (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    operador_id INT NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(100),
    email VARCHAR(100),
    criado_em TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_clients_operador_id ON clients (operador_id);

CREATE TABLE IF NOT EXISTS services (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    operador_id INT NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    nome VARCHAR NOT NULL,
    duracao_minutos INT NOT NULL,
    preco DECIMAL(10, 2)
);

CREATE INDEX IF NOT EXISTS ix_services_operador_id ON services (operador_id);

CREATE TABLE IF NOT EXISTS appointments (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    servico_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    data_hora TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_appointments_data_hora ON appointments (data_hora);
CREATE INDEX IF NOT EXISTS ix_appointments_servico_id ON appointments (servico_id);
CREATE INDEX IF NOT EXISTS ix_appointments_cliente_id ON appointments (cliente_id);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token VARCHAR(512) NOT NULL UNIQUE,
    operator_id INT NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_refresh_tokens_operator_revoked
    ON refresh_tokens (operator_id, revoked);
