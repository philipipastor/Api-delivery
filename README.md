# API Delivery

API REST para gerenciamento de entregas, usuários e histórico de movimentações de uma encomenda.

O projeto utiliza autenticação JWT, autorização baseada em perfil e registra logs sempre que o status de uma entrega é alterado.

## Funcionalidades

- Cadastro de usuários
- Autenticação com JWT
- Senhas protegidas com bcrypt
- Perfis de usuário `customer` e `sale`
- Cadastro e listagem de entregas
- Atualização do status da entrega
- Status disponíveis: `processing`, `shipped` e `delivered`
- Registro de logs das alterações de status
- Validação de dados com Zod
- Persistência em PostgreSQL com Prisma ORM
- Banco PostgreSQL configurável com Docker Compose

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Docker
- Zod
- JSON Web Token (JWT)
- bcrypt

## Modelo de dados

A API trabalha principalmente com três entidades:

- **User** — usuário da aplicação
- **Delivery** — entrega vinculada a um usuário
- **DeliveryLog** — histórico de alterações da entrega

## Principais rotas

```text
/users
/sessions
/deliveries
/delivery-logs
```

## Como executar

Instale as dependências:

```bash
npm install
```

Configure a variável `DATABASE_URL` no arquivo `.env`.

Caso utilize o Docker Compose do projeto, inicie o banco PostgreSQL:

```bash
docker compose up -d
```

Execute as migrations do Prisma e inicie a aplicação:

```bash
npx prisma migrate dev
npm run dev
```

## Aprendizados

O projeto explora construção de APIs REST com autenticação e autorização, modelagem de relacionamentos com Prisma, validação de requisições, regras de negócio e utilização de PostgreSQL em ambiente Docker.

## Autor

Desenvolvido por **Philipi Pastor**.
