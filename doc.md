# CommerceHub MVP — Documentação do Projeto

> **Versão:** 1.0.0-MVP  
> **Status:** Em Desenvolvimento  
> **Arquitetura:** Microsserviços com Event-Driven Saga Coreografada  
> **Repositório:** `commerce-hub-mvp/`

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Stack Tecnológica](#stack-tecnológica)
4. [Estrutura do Monorepo](#estrutura-do-monorepo)
5. [Pré-requisitos](#pré-requisitos)
6. [Instalação e Execução](#instalação-e-execução)
7. [Variáveis de Ambiente](#variáveis-de-ambiente)
8. [Fluxo da Saga (Pedido)](#fluxo-da-saga-pedido)
9. [Endpoints Principais (API Gateway)](#endpoints-principais-api-gateway)
10. [RabbitMQ — Eventos e Filas](#rabbitmq-eventos-e-filas)
11. [Modelos de Dados (Prisma)](#modelos-de-dados-prisma)
12. [Comandos de Desenvolvimento](#comandos-de-desenvolvimento)
13. [Testes](#testes)
14. [Próximos Passos (Pós-MVP)](#próximos-passos-pós-mvp)
15. [Contribuição](#contribuição)

---

## Visão Geral

O **CommerceHub MVP** é uma plataforma de e-commerce baseada em microsserviços, desenvolvida para demonstrar na prática conceitos avançados de engenharia de software:

- **Domain-Driven Design (DDD)** — cada serviço possui seu próprio domínio e banco de dados.
- **Event-Driven Architecture** — comunicação assíncrona via RabbitMQ.
- **Saga Pattern (Coreografada)** — orquestração do fluxo de criação de pedidos sem um coordenador central.
- **API Gateway** — ponto único de entrada para o frontend, com roteamento e autenticação JWT.
- **Monorepo com pnpm + Turborepo** — gerenciamento eficiente de múltiplos serviços e pacotes compartilhados.

### Objetivo do MVP

Entregar o **caminho feliz** completo de uma compra:

1. Usuário se cadastra e faz login.
2. Visualiza lista de produtos.
3. Cria um pedido.
4. O sistema reserva o estoque (via fila).
5. O sistema simula a aprovação do pagamento (via fila).
6. O pedido é confirmado.

---

## Arquitetura

### Diagrama de Containers (C4 Nível 2)

# Arquitetura da Solução

```text
                            React (Frontend)
                                   │
                                   ▼
                      API Gateway (NestJS)
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
   Auth Service             Product Service             Order Service
    (Porta 3001)             (Porta 3002)               (Porta 3004)
        │                          │                          │
        └──────────────────────────┼──────────────────────────┘
                                   ▼
                           RabbitMQ Broker
                             (Porta 5672)
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
 Inventory Service         Payment Service     Notification Service
   (Porta 3003)             (Porta 3005)            (Futuro)
```

### Comunicação

| Tipo       | Protocolo | Caso de Uso                                                             |
| :--------- | :-------- | :---------------------------------------------------------------------- |
| Síncrona   | REST      | Frontend → Gateway → Serviços (consultas e comandos imediatos)          |
| Assíncrona | RabbitMQ  | Orquestração de pedidos, reserva de estoque, processamento de pagamento |

### Padrões Aplicados

- **Database per Service**: Cada serviço possui seu próprio banco PostgreSQL.
- **Saga Coreografada**: Cada serviço publica eventos e reage a eventos de outros serviços.
- **API Versioning**: Prefixo `/api/v1` em todas as rotas.
- **JWT Stateless**: Gateway valida tokens localmente usando chave pública (RSA).

---

## Stack Tecnológica

### Backend (Microsserviços)

| Ferramenta     | Versão | Finalidade                          |
| :------------- | :----- | :---------------------------------- |
| Node.js        | 20.x   | Runtime                             |
| TypeScript     | 5.x    | Linguagem                           |
| NestJS         | 10.x   | Framework principal                 |
| Fastify        | 4.x    | Motor HTTP (alternativa ao Express) |
| Prisma ORM     | 5.x    | ORM e migrações                     |
| PostgreSQL     | 16     | Banco de dados relacional           |
| RabbitMQ       | 4.0    | Message Broker                      |
| Redis (futuro) | 7.x    | Cache e Rate Limit                  |
| JWT / Passport | -      | Autenticação                        |

### Frontend

| Ferramenta           | Versão | Finalidade                         |
| :------------------- | :----- | :--------------------------------- |
| React                | 18.x   | UI Library                         |
| Vite                 | 5.x    | Build tool                         |
| TanStack Query       | 5.x    | Gerenciamento de estado assíncrono |
| React Router         | 6.x    | Roteamento                         |
| Zustand              | 4.x    | Gerenciamento de estado global     |
| TailwindCSS + shadcn | -      | Estilização                        |

### Infraestrutura (Desenvolvimento)

| Ferramenta        | Finalidade                                |
| :---------------- | :---------------------------------------- |
| Docker Compose    | Orquestração local (PostgreSQL, RabbitMQ) |
| pnpm Workspaces   | Gerenciamento de monorepo                 |
| Turborepo         | Cache e execução paralela de tarefas      |
| ESLint / Prettier | Qualidade de código                       |

---

## Estrutura do Monorepo

## 📁 Estrutura do Projeto

## 📁 Estrutura do Projeto

```text
commerce-hub-mvp/
├── apps/                                   # Aplicações
│   ├── gateway/                            # API Gateway (NestJS)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── gateway.module.ts
│   │   │   └── ...
│   │   ├── .env
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth-service/                       # Autenticação e usuários (NestJS)
│   │   ├── src/
│   │   ├── prisma/                         # Schema e migrations
│   │   ├── .env
│   │   └── package.json
│   │
│   ├── product-service/                    # Cadastro de produtos (NestJS)
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── .env
│   │   └── package.json
│   │
│   ├── inventory-service/                  # Gestão de estoque (NestJS)
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── .env
│   │   └── package.json
│   │
│   ├── order-service/                      # Pedidos e Saga (NestJS)
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── .env
│   │   └── package.json
│   │
│   ├── payment-service/                    # Processador de pagamentos (NestJS)
│   │   ├── src/
│   │   ├── .env                            # (SEM banco de dados próprio)
│   │   └── package.json
│   │
│   └── frontend/                           # Aplicação React (Vite)
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── services/
│       │   └── App.tsx
│       ├── .env
│       ├── package.json
│       └── vite.config.ts
│
├── packages/                               # Pacotes compartilhados
│   └── shared/                             # Tipos, eventos e DTOs
│       ├── src/
│       │   ├── events/                     # Eventos do RabbitMQ
│       │   │   ├── order.events.ts
│       │   │   └── inventory.events.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docker-compose.yml                      # Infraestrutura local
├── package.json                            # Dependências e scripts raiz
├── pnpm-workspace.yaml                     # Configuração do Workspace
├── turbo.json                              # Configuração do Turborepo
└── README.md
```

## Pré-requisitos

- **Node.js** 20.x ou superior
- **pnpm** 8.15.0 ou superior (`npm install -g pnpm`)
- **Docker** e **Docker Compose** (para os bancos e RabbitMQ)
- **Git** (opcional, para versionamento)

---

## Instalação e Execução

### 1. Clone o repositório (ou crie a estrutura)

```bash
git clone <seu-repositorio>
cd commerce-hub-mvp
```

### 2. Instale as dependências

Na raiz do projeto, execute:

```bash
pnpm install
```

### 3. Suba a infraestrutura (PostgreSQL + RabbitMQ)

```bash
pnpm docker:up
```

Verifique se os containers estão rodando:

```bash
docker ps
```

Você deve ver **5 containers**: `auth-db`, `product-db`, `inventory-db`, `order-db` e `rabbitmq`.

### 4. Configure as variáveis de ambiente

Entre em cada serviço (`apps/*/`) e crie um arquivo `.env` com base nas instruções da seção **Variáveis de Ambiente**.

### 5. Execute as migrações do Prisma

Para cada serviço que possui banco de dados (`auth`, `product`, `inventory` e `order`), execute:

```bash
cd apps/auth-service
npx prisma migrate dev --name init
```

Repita o processo para:

- `product-service`
- `inventory-service`
- `order-service`

### 6. Rode todos os serviços em modo desenvolvimento

Na raiz do projeto:

```bash
pnpm dev
```

O Turborepo iniciará todos os serviços e o frontend simultaneamente.

### 7. Acesse a aplicação

| Serviço           | URL                                    |
| ----------------- | -------------------------------------- |
| Frontend (React)  | http://localhost:5173                  |
| API Gateway       | http://localhost:3000                  |
| RabbitMQ Manager  | http://localhost:15672 _(guest/guest)_ |
| Auth Service      | http://localhost:3001                  |
| Product Service   | http://localhost:3002                  |
| Inventory Service | http://localhost:3003                  |
| Order Service     | http://localhost:3004                  |
| Payment Service   | http://localhost:3005                  |

---

---

## Variáveis de Ambiente

Cada serviço possui seu próprio arquivo `.env`. Abaixo estão os exemplos:

### `.env` para `gateway`

```env
PORT=3000
AUTH_SERVICE_HOST=http://localhost:3001
PRODUCT_SERVICE_HOST=http://localhost:3002
INVENTORY_SERVICE_HOST=http://localhost:3003
ORDER_SERVICE_HOST=http://localhost:3004
PAYMENT_SERVICE_HOST=http://localhost:3005
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
```

### `.env` para `auth-service`

```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_db?schema=public"
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
JWT_EXPIRES_IN="1d"
REFRESH_EXPIRES_IN="7d"
```

### `.env` para `product-service`

```env
PORT=3002
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/product_db?schema=public"
```

### `.env` para `inventory-service`

```env
PORT=3003
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/inventory_db?schema=public"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
```

### `.env` para `order-service`

```env
PORT=3004
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/order_db?schema=public"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
```

### `.env` para `payment-service`

```env
PORT=3005
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
```

### `.env` para `frontend`

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

---

## Fluxo da Saga (Pedido)

A criação de um pedido no **CommerceHub** é orquestrada através de uma **Saga Coreografada**, onde cada serviço publica eventos e reage aos eventos publicados por outros serviços.

### Diagrama de Sequência

```text
+------------+     +-----------+     +---------------+     +----------------+     +---------------+
|  Frontend  |     |  Gateway  |     | Order Service |     | Inventory Svc  |     | Payment Svc   |
+-----+------+     +-----+-----+     +-------+-------+     +--------+-------+     +-------+-------+
      |                  |                   |                      |                     |
      | POST /orders     |                   |                      |                     |
      |----------------->|                   |                      |                     |
      |                  | Forward           |                      |                     |
      |                  |------------------>|                      |                     |
      |                  |                   | Cria PENDING         |                     |
      |                  |                   | Publica ORDER_CREATED|                     |
      |                  |                   |--------------------->|                     |
      |                  |                   |                      | Consome evento      |
      |                  |                   |                      | Verifica estoque    |
      |<-----------------| 201 Created       |                      |                     |
      |                  |<------------------|                      |                     |
      |                  |                   |                      | Se OK: reserva      |
      |                  |                   |<---------------------| INVENTORY_RESERVED  |
      |                  |                   | Consome evento       |                     |
      |                  |                   | Atualiza RESERVED    |                     |
      |                  |                   | Publica              |                     |
      |                  |                   |--------------------->|                     |
      |                  |                   | ORDER_READY_FOR_PAYMENT                    |
      |                  |                   |                      |                     |
      |                  |                   |                      | Consome evento      |
      |                  |                   |                      | Simula 2s           |
      |                  |                   |                      | Se <= 1000: OK      |
      |                  |                   |<------------------------------------------|
      |                  |                   | PAYMENT_APPROVED                           |
      |                  |                   | Consome evento                             |
      |                  |                   | Atualiza CONFIRMED                         |
      |                  |                   |                                            |
```

### Estados do Pedido

| Estado      | Descrição                                                 |
| :---------- | :-------------------------------------------------------- |
| `PENDING`   | Pedido criado, aguardando reserva de estoque.             |
| `RESERVED`  | Estoque reservado, aguardando processamento de pagamento. |
| `CONFIRMED` | Pagamento aprovado e pedido concluído.                    |
| `FAILED`    | Falha na reserva de estoque ou no pagamento.              |
| `CANCELED`  | Pedido cancelado (estoque liberado).                      |

---

---

## Endpoints Principais (API Gateway)

### Autenticação

#### `POST /api/v1/auth/register`

Cria uma nova conta de usuário.

**Request Body:**

```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "email": "usuario@email.com",
  "name": "Nome do Usuário"
}
```

---

#### `POST /api/v1/auth/login`

Realiza login e retorna os tokens JWT.

**Request Body:**

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

---

#### `POST /api/v1/auth/refresh`

Renova o **Access Token** utilizando o **Refresh Token**.

**Headers:**

```text
Authorization: Bearer <refresh_token>
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

---

### Pedidos

#### `POST /api/v1/orders`

Cria um novo pedido (inicia a saga).

**Headers:**

```text
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "productId": "uuid",
  "quantity": 2,
  "paymentMethod": "PIX"
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "productId": "uuid",
  "quantity": 2,
  "total": 199.8,
  "status": "PENDING",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

#### `GET /api/v1/orders/:id`

Busca um pedido específico.

**Headers:**

```text
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "productId": "uuid",
  "quantity": 2,
  "total": 199.8,
  "status": "CONFIRMED",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:10.000Z"
}
```

---

#### `GET /api/v1/orders`

Lista todos os pedidos do usuário autenticado.

**Headers:**

```text
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "productId": "uuid",
    "quantity": 2,
    "total": 199.8,
    "status": "CONFIRMED",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

---

## RabbitMQ — Eventos e Filas

### Eventos Publicados

| Evento                    | Origem            | Destino(s)        | Descrição                                        |
| :------------------------ | :---------------- | :---------------- | :----------------------------------------------- |
| `order.created`           | Order Service     | Inventory Service | Novo pedido criado, solicita reserva de estoque. |
| `inventory.reserved`      | Inventory Service | Order Service     | Estoque reservado com sucesso.                   |
| `inventory.failed`        | Inventory Service | Order Service     | Falha na reserva de estoque.                     |
| `order.ready_for_payment` | Order Service     | Payment Service   | Pedido aguardando processamento de pagamento.    |
| `payment.approved`        | Payment Service   | Order Service     | Pagamento aprovado.                              |
| `payment.failed`          | Payment Service   | Order Service     | Pagamento recusado.                              |
| `order.canceled`          | Order Service     | Inventory Service | Pedido cancelado (liberar estoque).              |

### Filas (Queues)

| Fila                       | Vinculada ao Exchange | Routing Key               |
| :------------------------- | :-------------------- | :------------------------ |
| `order.created.queue`      | `commerce.exchange`   | `order.created`           |
| `inventory.reserved.queue` | `commerce.exchange`   | `inventory.reserved`      |
| `inventory.failed.queue`   | `commerce.exchange`   | `inventory.failed`        |
| `order.payment.queue`      | `commerce.exchange`   | `order.ready_for_payment` |
| `payment.approved.queue`   | `commerce.exchange`   | `payment.approved`        |
| `payment.failed.queue`     | `commerce.exchange`   | `payment.failed`          |
| `order.canceled.queue`     | `commerce.exchange`   | `order.canceled`          |

### Exchange

- **Nome:** `commerce.exchange`
- **Tipo:** `topic`
- **Durabilidade:** `true`

---

## Modelos de Dados (Prisma)

### Auth Service (`auth_db`)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Product Service (`product_db`)

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Float
  imageUrl    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Inventory Service (`inventory_db`)

```prisma
model Inventory {
  id        String   @id @default(uuid())
  productId String   @unique
  quantity  Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Order Service (`order_db`)

```prisma
model Order {
  id        String   @id @default(uuid())
  userId    String
  productId String
  quantity  Int
  total     Float
  status    OrderStatus @default(PENDING)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

enum OrderStatus {
  PENDING
  RESERVED
  CONFIRMED
  FAILED
  CANCELED
}
```

---

## Comandos de Desenvolvimento

| Comando                             | Descrição                                                  |
| :---------------------------------- | :--------------------------------------------------------- |
| `pnpm install`                      | Instala todas as dependências do monorepo.                 |
| `pnpm dev`                          | Roda todos os serviços e frontend em modo desenvolvimento. |
| `pnpm build`                        | Compila todos os serviços e frontend.                      |
| `pnpm lint`                         | Executa ESLint em todos os projetos.                       |
| `pnpm docker:up`                    | Sobe os containers (PostgreSQL e RabbitMQ).                |
| `pnpm docker:down`                  | Derruba os containers.                                     |
| `pnpm --filter <service> add <pkg>` | Adiciona dependência a um serviço específico.              |
| `pnpm --filter <service> test`      | Roda testes de um serviço específico.                      |

---

## Testes

### Estratégia de Testes (MVP)

| Tipo           | Ferramenta                 | Cobertura Atual         |
| :------------- | :------------------------- | :---------------------- |
| **Unitários**  | Jest                       | 80% (críticos)          |
| **Integração** | Supertest + Testcontainers | Fluxo principal (saga)  |
| **Contrato**   | Pact (futuro)              | Não implementado no MVP |
| **E2E**        | Playwright (futuro)        | Não implementado no MVP |

### Executando Testes

```bash
# Executa testes de todos os serviços
pnpm test

# Executa testes de um serviço específico
pnpm --filter auth-service test
```
