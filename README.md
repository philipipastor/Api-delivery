# Rocketlog — API de gerenciamento de entregas

API REST desenvolvida com **Node.js, TypeScript e Express** para gerenciar usuários, entregas e o histórico de movimentações de encomendas.

O projeto implementa **autenticação JWT**, autorização por perfil de usuário, validação de dados e persistência com **Prisma ORM e PostgreSQL**.

## Tecnologias

- Node.js e TypeScript
- Express
- Prisma ORM e PostgreSQL
- Zod
- JWT e bcrypt
- Docker Compose
- Jest, Supertest e ts-jest (estrutura de testes)
- tsx e tsup

## Funcionalidades

- Cadastro e listagem de usuários
- Login com geração de token JWT
- Proteção de senhas com bcrypt
- Perfis `customer` (cliente) e `sale` (responsável pelas entregas)
- Atualização do perfil de usuário para `sale`, mediante autorização
- Exclusão de usuários
- Cadastro e listagem de entregas
- Alteração do status das entregas: `processing`, `shipped` e `delivered`
- Registro automático de histórico ao alterar o status
- Inclusão de movimentações no histórico de entregas enviadas
- Consulta de entrega com dados do usuário e histórico
- Restrição de acesso: clientes consultam apenas suas próprias entregas
- Validação de requisições com Zod e tratamento centralizado de erros

## Perfis e permissões

| Ação | customer | sale |
| --- | --- | --- |
| Consultar histórico da própria entrega | Sim | Sim |
| Consultar histórico de qualquer entrega | Não | Sim |
| Cadastrar, listar e atualizar entregas | Não | Sim |
| Adicionar movimentações ao histórico | Não | Sim |
| Atualizar perfil de usuário | Não | Sim |

> Observação: as rotas de cadastro, listagem e exclusão de usuários estão definidas sem middleware de autenticação no código atual. A tabela acima descreve as regras das rotas de entregas e das operações protegidas.

## Endpoints

### Usuários

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/users` | Cadastrar usuário |
| GET | `/users` | Listar usuários |
| PATCH | `/users/:id` | Atualizar perfil (requer `sale`) |
| DELETE | `/users/:id` | Excluir usuário |

### Autenticação

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/sessions` | Autenticar usuário |

### Entregas

As rotas abaixo exigem autenticação e perfil `sale`.

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/deliveries` | Criar entrega |
| GET | `/deliveries` | Listar entregas |
| PATCH | `/deliveries/:id/status` | Alterar status e registrar log |

### Histórico

| Método | Rota | Descrição | Acesso |
| --- | --- | --- | --- |
| POST | `/delivery-logs` | Adicionar movimentação | `sale` |
| GET | `/delivery-logs/:delivery_id/show` | Consultar entrega e histórico | `customer` ou `sale` |

O cliente só pode consultar o histórico de entregas vinculadas à sua conta.

## Modelagem do banco

O banco possui três entidades relacionadas:

- **User:** dados de identificação, credenciais e perfil do usuário
- **Delivery:** descrição, status e usuário responsável pela entrega
- **DeliveryLog:** movimentações e alterações relacionadas à entrega

Cada usuário pode ter várias entregas, e cada entrega pode ter vários registros de histórico.

## Como executar localmente

**Pré-requisitos:** Node.js (o projeto declara Node 24), npm e PostgreSQL. O banco também pode ser executado com Docker Compose.

1. Clone o repositório e instale as dependências:

```bash
git clone https://github.com/philipipastor/Api-delivery.git
cd Api-delivery
npm install
```

2. Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rocketlog?schema=public"
JWT_SECRET="substitua-por-uma-chave-secreta-segura"
PORT=3333
```

Os valores de conexão acima são um exemplo para desenvolvimento local. Ajuste-os de acordo com seu banco de dados e não publique segredos reais.

3. Se optar pelo PostgreSQL via Docker, inicie o serviço:

```bash
docker compose up -d
```

4. Gere o Prisma Client, aplique as migrations e inicie a API:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

A API utilizará a porta configurada em `PORT` (padrão: `3333`).

## Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Executa a API em modo de desenvolvimento |
| `npm run build` | Compila o projeto com tsup |
| `npm start` | Executa a versão compilada |
| `npm run test:dev` | Executa Jest em modo watch (script configurado para Windows) |

## Aprendizados aplicados

- Estruturação de uma API REST com Express e TypeScript
- Autenticação JWT e autorização baseada em perfis
- Validação de entrada com Zod
- Modelagem de relacionamentos com Prisma ORM
- Persistência de dados em PostgreSQL
- Registro e consulta de histórico de movimentações
- Configuração de ambiente com Docker e variáveis de ambiente

---

**Desenvolvido por Philipi Pastor.**
