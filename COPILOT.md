# 🚀 Orbital - Context Engineering

## 📋 Project Overview

**Orbital** é um sistema de agendamento voltado para pequenos negócios (barbearias, clínicas, estúdios, consultórios, etc.).

Problema: muitos pequenos negócios ainda gerenciam agendamentos por **WhatsApp, papel ou planilhas**, causando desorganização, conflitos de horário e dificuldade para acompanhar atendimentos.

Solução: oferecer uma plataforma digital simples e focada em agendamento que permita registrar, visualizar e gerenciar horários de atendimento de forma organizada, reduzindo conflitos e facilitando o dia a dia do negócio.

O sistema possui duas áreas principais:

- **Landing Page** → aquisição de usuários
- **Dashboard SaaS** → gerenciamento de agenda e operações do dia a dia

O frontend funciona como **PWA**, permitindo uso em dispositivos móveis como aplicativo instalado.

---

## 🏗️ System Architecture

Arquitetura geral do sistema:

```text
Frontend (React + Vite) + PWA (focado em experiência mobile)
  ↓
Backend (Java + Gradle + Spring Boot)
  ↓
Database (PostgreSQL - Neon Cloud)
```

### Paradigma de Desenvolvimento: POO (Programação Orientada a Objetos)

Todo o código do projeto — frontend e backend — deve seguir o paradigma de **Programação Orientada a Objetos (POO)**. Este é um requisito obrigatório.

- **Backend (Java + Spring Boot):** POO nativa — entidades, services, controllers, repositories e DTOs como classes com encapsulamento, herança e polimorfismo quando aplicável.
- **Frontend (React + TypeScript):** Componentes React continuam funcionais (padrão do ecossistema), porém toda **lógica de negócio, services, models e utilitários** devem ser implementados como **classes TypeScript** com encapsulamento e responsabilidade única.

---

## 🎯 Business Domain

### Sistema de Agendamento para Pequenos Negócios

#### Problema

Muitos pequenos negócios (barbearias, clínicas, estúdios, consultórios) ainda controlam agendamentos via **WhatsApp, papel ou planilhas**, gerando desorganização, conflitos de horário e dificuldade para acompanhar o histórico de atendimentos.

#### Solução

Desenvolver um sistema digital de agendamento que permita registrar, visualizar e gerenciar horários de atendimento de forma organizada, simples e acessível.

#### Objetivo do sistema

Facilitar o controle de agendamentos e gerar dados que ajudem o negócio a entender melhor sua demanda e melhorar a organização dos atendimentos.

#### Funcionalidades principais

- Cadastro de operadores (donos de negócios que utilizam o SaaS)
- Cadastro de clientes
- Cadastro de serviços
- Agendamento de horários
- Visualização da agenda (calendar view)
- Edição e cancelamento de agendamentos
- Histórico de atendimentos

#### Análise de dados - Insights para o negócio/operador

O sistema fornecerá indicadores simples para apoiar decisões do negócio, por exemplo:

- Número de atendimentos por período
- Horários mais agendados
- Serviços mais solicitados
- Histórico de atendimentos por cliente

Esses insights ajudam o negócio a entender demanda, otimizar horários e priorizar serviços.

Responsabilidades:

- armazenamento de operadores (multi-tenant)
- clientes
- serviços
- agendamentos

---

## 🗄️ Modelagem do Banco de Dados (resumo)

Com base no conteúdo do Notion (onde foi planejado o projeto), as entidades principais são: `operadores`, `clientes`, `servicos` e `agendamentos`.

- Operadores: dono/operador do negócio (multi-tenant).
- Clientes: clientes atendidos pelo operador.
- Serviços: tipos de serviço oferecidos (duração, preço).
- Agendamentos: registros de horários vinculados a cliente + serviço.

Relacionamentos principais:

- Um `operador` possui vários `clientes`.
- Um `operador` oferece vários `servicos`.
- Um `cliente` pode ter vários `agendamentos`.
- Um `servico` pode estar associado a vários `agendamentos`.

Possibilidades de análise de dados (conforme Notion):

- quantidade de atendimentos por período
- horários mais agendados
- serviços mais solicitados
- histórico de atendimentos por cliente

Um modelo relacional inicial (camada conceitual) será detalhado em `context/guidelines.md`.

DDL completo (alinhado com o diagrama ER):

```sql
-- operators
CREATE TABLE operators (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha_hash VARCHAR NOT NULL,
  telefone VARCHAR(100),
  nome_negocio VARCHAR(150),
  criado_em TIMESTAMP DEFAULT now()
);

-- clients
CREATE TABLE clients (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  operador_id INT NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(100),
  email VARCHAR(100),
  criado_em TIMESTAMP DEFAULT now()
);

-- services
CREATE TABLE services (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  operador_id INT NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  nome VARCHAR NOT NULL,
  duracao_minutos INT NOT NULL,
  preco DECIMAL(10)
);

-- appointments
CREATE TABLE appointments (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  cliente_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  servico_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  data_hora TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL,
  criado_em TIMESTAMP DEFAULT now()
);
```

## 📁 Project Structure

Estrutura simplificada do projeto.

```text
orbital/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   └── shared/
│       ├── pages/
│       │   ├── landing/
│       │   │   ├── Home.tsx
│       │   │   ├── Features.tsx
│       │   │   └── Pricing.tsx
│       │   ├── auth/
│       │   │   ├── Login.tsx
│       │   │   └── Register.tsx
│       │   └── dashboard/
│       │       ├── Dashboard.tsx
│       │       ├── Calendar.tsx
│       │       ├── Appointments.tsx
│       │       └── Settings.tsx
│       ├── layouts/
│       │   ├── LandingLayout.tsx
│       │   └── DashboardLayout.tsx
│       ├── routes/
│       │   └── router.tsx
│       ├── services/
│       │   └── api.ts
│       ├── styles/
│       │   ├── globals.css
│       │   └── theme.css
│       └── main.tsx
├── backend/
│   ├── src/main/java/com/orbital/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── dtos/
│   │   ├── security/
│   │   └── config/
│   └── src/main/resources/
│       └── application.properties
├── context/
│   └── prompts/ui/ux/orbital-design-system.md
└── README.md
```

---

## Core Features

### 1. Agenda

- visualização de calendário
- compromissos diários
- compromissos semanais
- compromissos mensais

---

### 2. Clientes

- cadastro de clientes
- histórico de atendimentos

---

### 3. Agendamentos

- criar agendamento
- editar agendamento
- cancelar agendamento

---

### 4. Dashboard

- métricas de agenda
- compromissos do dia
- atividade recente

---

### 5. Autenticação

- login
- registro
- sessão segura

---

## 🔧 Development Standards

### Paradigma: POO Obrigatório

Todo código deve seguir **Programação Orientada a Objetos (POO)**:

- **Backend:** Classes Java com encapsulamento (`private` fields + getters/setters), injeção de dependência via construtor, interfaces para services, herança e polimorfismo quando aplicável.
- **Frontend:** Services e models como classes TypeScript. Componentes React permanecem funcionais (padrão do ecossistema), mas a lógica de domínio deve estar encapsulada em classes.

### React Components

Usar **PascalCase** — ex.: `DashboardPage.tsx`, `CalendarView.tsx`, `ClientList.tsx`.

Todo código novo deve usar **TypeScript** (`.tsx` / `.ts`).

### Hooks

Prefixo **use** — ex.: `useAuth.ts`, `useAppointments.ts`.

### Services

Nomes em camelCase — ex.: `appointmentService.ts`, `userService.ts`.

Services no frontend devem ser **classes com métodos**, não funções soltas.

---

## 🧩 Component Structure

Estrutura padrão de componentes React (funcionais):

```tsx
const ComponentName = () => {
  // hooks
  // states
  // handlers
  // effects

  return <div>{/* UI */}</div>;
};

export default ComponentName;
```

### Service Classes (Frontend - POO)

Services no frontend devem ser classes com encapsulamento:

```ts
class AppointmentService {
  private readonly baseUrl = "/appointments";

  async getAll(params: AppointmentParams): Promise<Appointment[]> {
    /* ... */
  }
  async create(payload: CreateAppointmentDTO): Promise<Appointment> {
    /* ... */
  }
  async update(
    id: number,
    payload: UpdateAppointmentDTO,
  ): Promise<Appointment> {
    /* ... */
  }
  async cancel(id: number): Promise<void> {
    /* ... */
  }
}

export const appointmentService = new AppointmentService();
```

### Model Classes (Frontend - POO)

Models de domínio como classes TypeScript:

```ts
class Appointment {
  constructor(
    public readonly id: number,
    public clienteId: number,
    public servicoId: number,
    public dataHora: Date,
    public status: AppointmentStatus,
  ) {}

  isCanceled(): boolean {
    return this.status === "canceled";
  }
}
```

### Backend Classes (Java - POO)

O backend segue POO nativa do Java:

```java
// Entity com encapsulamento
@Entity
public class Operator {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private String email;
    // getters e setters
}

// Service com interface e injeção de dependência
public interface AppointmentService {
    List<Appointment> findAll();
    Appointment create(CreateAppointmentDTO dto);
}

@Service
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository repository;

    public AppointmentServiceImpl(AppointmentRepository repository) {
        this.repository = repository;
    }
    // implementação dos métodos
}
```

---

## 🔄 Application Flows

### User Registration

1. usuário acessa landing
2. clica em criar conta
3. envia formulário
4. backend cria usuário
5. redirecionamento para dashboard

---

### Login Flow

1. usuário acessa `/login`
2. credenciais enviadas para API
3. backend retorna JWT
4. frontend armazena token
5. acesso liberado

---

### Appointment Flow

1. usuário abre calendário
2. cria novo compromisso
3. dados enviados para API
4. backend salva no banco
5. evento aparece no calendário

---

## 🎨 Design System

O design system do Orbital está presente em `context/prompts/ui/ux/orbital-design-system.md`.

---

## 📦 Base Components

Componentes principais:

- Button
- Input
- Card
- Modal
- Avatar
- Badge
- Dropdown
- Calendar
- Sidebar

---

## 📱 Mobile Strategy

Orbital é desenvolvido como **PWA**.

Isso permite:

- instalar como app
- uso offline parcial
- melhor experiência mobile

---

## 🔒 Security

- autenticação com JWT
- validação de dados
- proteção de rotas
- sanitização de inputs

---

## ⚡ Performance

Boas práticas:

- lazy loading
- code splitting
- otimização de bundle
- caching de API

---

## ⚙️ API & Endpoints

### Formato de resposta padrão

```json
{ "success": true, "data": { ... }, "error": null }
```

### Endpoints essenciais

- `POST /auth/login`, `POST /auth/register`
- `GET/PUT /operators/profile`
- `GET/POST/PUT/DELETE /clients`
- `GET/POST/PUT/DELETE /services`
- `GET/POST/PUT/DELETE /appointments`
- `GET /reports/summary`

---

## 🤖 Contexto para IA

Este documento serve como **contexto para ferramentas de IA**.

IA deve:

- seguir as `context/guidelines.md`
- respeitar a estrutura do projeto
- seguir o design system
- usar TypeScript em todo código novo
- **usar POO (Programação Orientada a Objetos) em todo código gerado** — services, models e lógica de domínio devem ser classes com encapsulamento
- reutilizar componentes existentes
- evitar duplicação de código

---

## End of Document
