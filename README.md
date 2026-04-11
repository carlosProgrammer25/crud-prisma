# API de Clientes

API REST para gerenciamento de clientes usando Node.js, Express e Prisma com MariaDB.

## Rotas
- GET /clientes - Lista todos clientes
- GET /cliente/:id - Busca cliente específico
- POST /criar - Cria novo cliente
- PUT /atualizar/:id - Atualiza cliente
- DELETE /deletar/:id - Remove cliente

## Configuração
1. Clone o repositório
2. `npm install`
3. Configure o `.env` com DATABASE_URL
4. `npx prisma generate`
5. `npm start`