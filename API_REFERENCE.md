# 📡 Referência Completa da API - Sistema Desbravadores

## 🌐 URL Base
```
https://clube-black-api.onrender.com
```

## 🔑 Autenticação

Todos os endpoints (exceto login/register) requerem token JWT no header:

```http
Authorization: Bearer {token}
```

---

## 📋 Endpoints Implementados (58 total)

### 🔐 Autenticação (2 endpoints)

#### POST /auth/login
Fazer login no sistema

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "usuario@email.com",
    "role": "admin"
  }
}
```

#### POST /auth/register
Registrar novo usuário

**Request:**
```json
{
  "name": "João Silva",
  "email": "usuario@email.com",
  "password": "senha123",
  "confirmPassword": "senha123"
}
```

---

### 👥 Membros (6 endpoints)

#### GET /members
Listar todos os membros

**Response:**
```json
[
  {
    "id": "uuid",
    "firstName": "João",
    "lastName": "Silva",
    "birthdate": "2010-05-15",
    "gender": "M",
    "parentName": "Maria Silva",
    "parentPhone": "+244923000000",
    "status": "active",
    "unitId": "uuid",
    "unit": { "id": "uuid", "name": "Lobinhos" }
  }
]
```

#### GET /members/:id
Obter detalhes de um membro específico

#### POST /members
Criar novo membro

**Request:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "birthdate": "2010-05-15",
  "gender": "M",
  "parentName": "Maria Silva",
  "parentPhone": "+244923000000",
  "parentEmail": "maria@email.com",
  "address": "Rua Principal, 123",
  "emergencyContact": "José Silva",
  "emergencyPhone": "+244923000001",
  "unitId": "uuid"
}
```

#### PUT /members/:id
Atualizar membro existente

#### DELETE /members/:id
Deletar membro (soft delete)

#### POST /members/:id/restore
Restaurar membro deletado

---

### 🏢 Unidades (5 endpoints)

#### GET /units
Listar todas as unidades

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Lobinhos",
    "description": "Unidade para crianças de 7 a 10 anos",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /units/:id
Obter detalhes de uma unidade

#### POST /units
Criar nova unidade

**Request:**
```json
{
  "name": "Pioneiros",
  "description": "Unidade para jovens de 15 a 17 anos"
}
```

#### PUT /units/:id
Atualizar unidade

#### DELETE /units/:id
Deletar unidade

---

### 📅 Eventos (9 endpoints)

#### GET /events
Listar todos os eventos

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Acampamento de Inverno",
    "description": "Acampamento anual...",
    "type": "campamento",
    "startDate": "2024-07-15T08:00:00Z",
    "endDate": "2024-07-17T16:00:00Z",
    "location": "Serra da Leba",
    "maxParticipants": 50,
    "status": "scheduled"
  }
]
```

#### GET /events/:id
Obter detalhes de um evento

#### POST /events
Criar novo evento

**Request:**
```json
{
  "title": "Reunião Semanal",
  "description": "Reunião de rotina",
  "type": "meeting",
  "startDate": "2024-06-01T15:00:00Z",
  "endDate": "2024-06-01T17:00:00Z",
  "location": "Sede do Clube",
  "maxParticipants": 30,
  "status": "scheduled"
}
```

**Tipos de evento:**
- `meeting` - Reunião
- `campamento` - Acampamento
- `training` - Treinamento
- `social` - Social
- `service` - Serviço Comunitário
- `other` - Outro

**Status do evento:**
- `scheduled` - Agendado
- `ongoing` - Em Andamento
- `completed` - Concluído
- `cancelled` - Cancelado

#### PUT /events/:id
Atualizar evento

#### DELETE /events/:id
Deletar evento

#### GET /events/:id/participants
Listar participantes de um evento

**Response:**
```json
[
  {
    "id": "uuid",
    "memberId": "uuid",
    "eventId": "uuid",
    "status": "confirmed",
    "member": {
      "firstName": "João",
      "lastName": "Silva"
    }
  }
]
```

#### POST /events/:eventId/participants/:memberId
Adicionar participante ao evento

#### DELETE /events/:eventId/participants/:memberId
Remover participante do evento

#### GET /events/:id/statistics
Obter estatísticas do evento

**Response:**
```json
{
  "totalParticipants": 25,
  "confirmed": 20,
  "pending": 5,
  "attendanceRate": 80
}
```

---

### ✅ Presenças (6 endpoints)

#### GET /attendance
Listar todos os registros de presença

**Response:**
```json
[
  {
    "id": "uuid",
    "memberId": "uuid",
    "eventId": "uuid",
    "status": "present",
    "notes": "Chegou atrasado",
    "createdAt": "2024-06-01T15:30:00Z",
    "member": { "firstName": "João", "lastName": "Silva" },
    "event": { "title": "Reunião Semanal" }
  }
]
```

**Status de presença:**
- `present` - Presente
- `absent` - Ausente
- `late` - Atrasado
- `excused` - Justificado

#### POST /attendance
Registrar presença individual

**Request:**
```json
{
  "memberId": "uuid",
  "eventId": "uuid",
  "status": "present",
  "notes": "Participou ativamente"
}
```

#### POST /attendance/bulk
Registrar múltiplas presenças

**Request:**
```json
{
  "eventId": "uuid",
  "memberIds": ["uuid1", "uuid2", "uuid3"],
  "status": "present"
}
```

#### GET /attendance/event/:eventId
Listar presenças de um evento específico

#### GET /attendance/member/:memberId
Listar histórico de presenças de um membro

#### GET /attendance/statistics/overall
Obter estatísticas gerais de presença

**Response:**
```json
{
  "totalRecords": 150,
  "presentCount": 120,
  "absentCount": 20,
  "lateCount": 10,
  "attendanceRate": 80
}
```

---

### 🏆 Progresso de Membros (4 endpoints)

#### GET /member-progress
Listar todo o progresso de membros

**Response:**
```json
[
  {
    "id": "uuid",
    "memberId": "uuid",
    "classLevel": "saltador",
    "achievedAt": "2024-05-01",
    "notes": "Completou todos os requisitos",
    "member": { "firstName": "João", "lastName": "Silva" }
  }
]
```

**Classes disponíveis:**
- `pata_tenra` - Pata Tenra
- `saltador` - Saltador
- `rastreador` - Rastreador
- `cacador` - Caçador
- `cruzeiro_do_sul` - Cruzeiro do Sul

#### POST /member-progress
Registrar progresso de classe

**Request:**
```json
{
  "memberId": "uuid",
  "classLevel": "saltador",
  "achievedAt": "2024-05-01",
  "notes": "Completou todos os requisitos"
}
```

#### GET /member-specialties/member/:memberId
Listar especialidades de um membro

**Response:**
```json
[
  {
    "id": "uuid",
    "memberId": "uuid",
    "name": "Primeiros Socorros",
    "level": "2",
    "achievedAt": "2024-04-15"
  }
]
```

#### POST /member-specialties
Adicionar especialidade a um membro

**Request:**
```json
{
  "memberId": "uuid",
  "name": "Primeiros Socorros",
  "level": "2",
  "achievedAt": "2024-04-15"
}
```

---

### 💰 Finanças (11 endpoints)

#### GET /finance/dashboard
Obter dashboard financeiro

**Response:**
```json
{
  "totalIncome": 50000,
  "totalExpense": 30000,
  "balance": 20000,
  "monthlyIncome": 8000,
  "monthlyExpense": 5000,
  "recentTransactions": []
}
```

#### GET /finance/transactions
Listar todas as transações

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "income",
    "amount": 5000,
    "description": "Taxa de associação",
    "date": "2024-06-01",
    "categoryId": "uuid",
    "accountId": "uuid",
    "category": { "name": "Receitas" },
    "account": { "name": "Caixa Principal" }
  }
]
```

#### GET /finance/transactions/:id
Obter detalhes de uma transação

#### POST /finance/transactions
Criar nova transação

**Request:**
```json
{
  "type": "income",
  "amount": 5000,
  "description": "Taxa de associação - Junho",
  "date": "2024-06-01",
  "categoryId": "uuid",
  "accountId": "uuid"
}
```

**Tipos:**
- `income` - Receita
- `expense` - Despesa

#### PUT /finance/transactions/:id
Atualizar transação

#### DELETE /finance/transactions/:id
Deletar transação

#### GET /finance/categories
Listar categorias financeiras

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Receitas",
    "type": "income"
  }
]
```

#### GET /finance/accounts
Listar contas financeiras

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Caixa Principal",
    "balance": 20000
  }
]
```

#### GET /finance/membership-fees
Listar taxas de associação

**Response:**
```json
[
  {
    "id": "uuid",
    "memberId": "uuid",
    "amount": 2000,
    "dueDate": "2024-06-30",
    "status": "pending",
    "member": { "firstName": "João", "lastName": "Silva" }
  }
]
```

#### POST /finance/membership-fees/generate
Gerar taxas de associação em massa

**Request:**
```json
{
  "amount": 2000,
  "dueDate": "2024-06-30",
  "memberIds": ["uuid1", "uuid2"]
}
```

#### POST /finance/membership-fees/:id/pay
Registrar pagamento de taxa

**Request:**
```json
{
  "paymentDate": "2024-06-15",
  "paymentMethod": "cash"
}
```

#### GET /finance/reports/monthly/:year/:month
Obter relatório mensal

**Exemplo:** `/finance/reports/monthly/2024/6`

**Response:**
```json
{
  "month": 6,
  "year": 2024,
  "totalIncome": 25000,
  "totalExpense": 15000,
  "balance": 10000,
  "transactions": []
}
```

---

### 📦 Inventário (9 endpoints)

#### GET /inventory/dashboard
Obter dashboard do inventário

**Response:**
```json
{
  "totalItems": 150,
  "totalValue": 500000,
  "lowStockItems": 5,
  "activeLoans": 10
}
```

#### GET /inventory/items
Listar todos os itens

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Tenda 4 Pessoas",
    "description": "Tenda para acampamento",
    "quantity": 10,
    "minQuantity": 5,
    "value": 15000,
    "categoryId": "uuid",
    "category": { "name": "Equipamentos" }
  }
]
```

#### GET /inventory/items/:id
Obter detalhes de um item

#### POST /inventory/items
Criar novo item

**Request:**
```json
{
  "name": "Tenda 4 Pessoas",
  "description": "Tenda para acampamento",
  "quantity": 10,
  "minQuantity": 5,
  "value": 15000,
  "categoryId": "uuid"
}
```

#### PUT /inventory/items/:id
Atualizar item

#### DELETE /inventory/items/:id
Deletar item

#### GET /inventory/categories
Listar categorias de inventário

#### GET /inventory/loans
Listar empréstimos

**Response:**
```json
[
  {
    "id": "uuid",
    "itemId": "uuid",
    "memberId": "uuid",
    "quantity": 2,
    "loanDate": "2024-06-01",
    "expectedReturnDate": "2024-06-10",
    "returnDate": null,
    "status": "active",
    "item": { "name": "Tenda 4 Pessoas" },
    "member": { "firstName": "João", "lastName": "Silva" }
  }
]
```

**Status:**
- `active` - Ativo
- `returned` - Devolvido
- `overdue` - Atrasado

#### POST /inventory/loans
Criar novo empréstimo

**Request:**
```json
{
  "itemId": "uuid",
  "memberId": "uuid",
  "quantity": 2,
  "loanDate": "2024-06-01",
  "expectedReturnDate": "2024-06-10"
}
```

#### POST /inventory/loans/:id/return
Registrar devolução de item

**Request:**
```json
{
  "returnDate": "2024-06-09",
  "condition": "good",
  "notes": "Devolvido em perfeitas condições"
}
```

#### GET /inventory/movements
Listar movimentações de inventário

**Response:**
```json
[
  {
    "id": "uuid",
    "itemId": "uuid",
    "type": "loan",
    "quantity": 2,
    "date": "2024-06-01",
    "notes": "Empréstimo para acampamento"
  }
]
```

---

### 💬 Feed/Posts (9 endpoints)

#### GET /feed
Listar posts (feed privado)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Acampamento foi incrível!",
    "content": "Tivemos um ótimo acampamento...",
    "visibility": "members",
    "authorId": "uuid",
    "author": { "name": "João Silva" },
    "comments": [],
    "reactions": [],
    "createdAt": "2024-06-01T10:00:00Z"
  }
]
```

#### GET /feed/public
Listar posts públicos

#### GET /feed/:id
Obter detalhes de um post

#### POST /feed
Criar novo post

**Request:**
```json
{
  "title": "Novo Acampamento Marcado!",
  "content": "Galera, marcamos o acampamento para...",
  "visibility": "members"
}
```

**Visibilidade:**
- `public` - Público
- `members` - Somente Membros
- `private` - Privado

#### PUT /feed/:id
Atualizar post

#### DELETE /feed/:id
Deletar post

#### GET /feed/event/:eventId/posts
Listar posts relacionados a um evento

#### POST /feed/:postId/comments
Adicionar comentário a um post

**Request:**
```json
{
  "content": "Concordo totalmente!"
}
```

#### POST /feed/:postId/reactions
Adicionar reação a um post

**Request:**
```json
{
  "type": "like"
}
```

**Tipos de reação:**
- `like` - Curtir
- `love` - Amei
- `haha` - Haha
- `wow` - Uau
- `sad` - Triste
- `angry` - Irritado

---

### 👤 Usuários (5 endpoints)

#### GET /users
Listar usuários do sistema

**Response:**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@clube.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

**Roles:**
- `admin` - Administrador
- `staff` - Equipe
- `member` - Membro

#### GET /users/:id
Obter detalhes de um usuário

#### POST /users
Criar novo usuário

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@clube.com",
  "password": "senha123",
  "role": "staff"
}
```

#### PUT /users/:id
Atualizar usuário

#### DELETE /users/:id
Deletar usuário

---

### 🏥 Health Check (1 endpoint)

#### GET /health
Verificar status da API

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-06-01T12:00:00Z",
  "uptime": 3600
}
```

---

## 📊 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 204 | No Content - Sucesso sem conteúdo |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 🔒 Segurança

### Token JWT:
- Expiração: 1 hora (3600 segundos)
- Refresh: Re-login necessário após expiração
- Storage: localStorage no frontend

### Headers Necessários:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

---

## 📝 Notas Importantes

1. **Datas**: Todas as datas em formato ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)
2. **IDs**: UUIDs para recursos, números para usuários
3. **Paginação**: Disponível em endpoints de listagem (params: `page`, `perPage`)
4. **Filtros**: Alguns endpoints suportam filtros (query params)
5. **Soft Delete**: Membros são deletados logicamente (podem ser restaurados)

---

## 🌐 Documentação Interativa

Acesse a documentação Swagger da API:
```
https://clube-black-api.onrender.com/docs
```

---

**API Version: 1.0.0**  
**Last Updated: $(date +"%d/%m/%Y")**
