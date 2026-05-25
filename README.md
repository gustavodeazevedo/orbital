# Orbital - Technical Overview

## Stack
- Frontend: React + Vite + TypeScript (PWA)
- Backend: Java 17 + Spring Boot + Gradle
- Database: PostgreSQL (Neon)

## Key Features
- Auth with JWT + refresh tokens
- Multi-tenant data (operators, clients, services, appointments)
- Dashboard insights and scheduling flows

## API
- Base URL: /auth, /operators, /clients, /services, /appointments
- Standard response: { success, data, error }

## Build
- Frontend: npm install && npm run build
- Backend: ./gradlew build -x test

## Env (backend)
- DB_URL, DB_USER, DB_PASSWORD
- JWT_SECRET, JWT_EXPIRATION_MINUTES, REFRESH_TOKEN_EXPIRATION_DAYS
- CORS_ALLOWED_ORIGINS
- RESEND_API_KEY, RESEND_API_URL, EMAIL_FROM
