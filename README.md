# Orbital - Visão Técnica

## Stack

- Frontend: React + Vite + TypeScript (PWA)
- Backend: Java 17 + Spring Boot + Gradle
- Banco de Dados: PostgreSQL (Neon)

## Principais Funcionalidades

- Autenticação com JWT + refresh tokens
- Dados multi-tenant (operadores, clientes, serviços e agendamentos)
- Insights de dashboard e fluxos de agendamento

## API

- URL base: /auth, /operators, /clients, /services, /appointments
- Resposta padrão: { success, data, error }

## Build

- Frontend: npm install && npm run build
- Backend: ./gradlew build -x test

## Variáveis de Ambiente (backend)

- DB_URL, DB_USER, DB_PASSWORD
- JWT_SECRET, JWT_EXPIRATION_MINUTES, REFRESH_TOKEN_EXPIRATION_DAYS
- CORS_ALLOWED_ORIGINS
- RESEND_API_KEY, RESEND_API_URL, EMAIL_FROM
