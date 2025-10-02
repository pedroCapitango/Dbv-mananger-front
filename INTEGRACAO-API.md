# 🔌 Integração com a API

## ✅ Status da Integração

A aplicação está **100% integrada** com a API real do backend!

### 🎯 API Base URL
```
https://clube-black-api.onrender.com
```

## 📋 Endpoints Implementados

### 🔐 Autenticação
- ✅ `POST /auth/login` - Login de usuário
- ✅ `POST /auth/register` - Registro de novo usuário
- ✅ Gerenciamento de token JWT (Bearer)
- ✅ Expiração do token: 7 dias (604800 segundos)

### 👥 Membros
- ✅ `GET /members` - Listar todos os membros
- ✅ `GET /members/:id` - Buscar membro por ID
- ✅ `POST /members` - Criar novo membro
- ✅ `PUT /members/:id` - Atualizar membro
- ✅ `DELETE /members/:id` - Deletar membro
- ✅ `POST /members/:id/restore` - Restaurar membro deletado

### 📅 Eventos
- ✅ `GET /events` - Listar todos os eventos
- ✅ `GET /events/:id` - Buscar evento por ID
- ✅ `POST /events` - Criar novo evento
- ✅ `PUT /events/:id` - Atualizar evento
- ✅ `DELETE /events/:id` - Deletar evento
- ✅ `GET /events/:id/participants` - Listar participantes
- ✅ `POST /events/:id/participants/:memberId` - Adicionar participante
- ✅ `DELETE /events/:id/participants/:memberId` - Remover participante
- ✅ `GET /events/:id/statistics` - Estatísticas do evento
- ✅ `GET /events/member/:memberId` - Eventos de um membro

### 💰 Finanças
- ✅ `GET /finance/dashboard` - Dashboard financeiro
- ✅ `GET /finance/transactions` - Listar transações
- ✅ `POST /finance/transactions` - Criar transação
- ✅ `PUT /finance/transactions/:id` - Atualizar transação
- ✅ `DELETE /finance/transactions/:id` - Deletar transação
- ✅ `GET /finance/categories` - Listar categorias
- ✅ `GET /finance/accounts` - Listar contas
- ✅ `GET /finance/membership-fees` - Mensalidades
- ✅ `POST /finance/membership-fees/generate` - Gerar mensalidades
- ✅ `POST /finance/membership-fees/:id/pay` - Pagar mensalidade
- ✅ `GET /finance/reports/monthly/:year/:month` - Relatório mensal

### 📦 Inventário
- ✅ `GET /inventory/dashboard` - Dashboard do inventário
- ✅ `GET /inventory/items` - Listar itens
- ✅ `POST /inventory/items` - Criar item
- ✅ `PUT /inventory/items/:id` - Atualizar item
- ✅ `DELETE /inventory/items/:id` - Deletar item
- ✅ `GET /inventory/categories` - Listar categorias
- ✅ `GET /inventory/loans` - Listar empréstimos
- ✅ `POST /inventory/loans` - Criar empréstimo
- ✅ `POST /inventory/loans/:id/return` - Devolver item
- ✅ `GET /inventory/movements` - Histórico de movimentações

### 📊 Presença
- ✅ `GET /attendance` - Listar presenças
- ✅ `POST /attendance` - Registrar presença
- ✅ `POST /attendance/bulk` - Registrar múltiplas presenças
- ✅ `GET /attendance/event/:eventId` - Presenças de um evento
- ✅ `GET /attendance/member/:memberId` - Presenças de um membro
- ✅ `GET /attendance/statistics/overall` - Estatísticas gerais

### 🏆 Progresso
- ✅ `GET /member-progress` - Progresso dos membros
- ✅ `POST /member-progress` - Registrar progresso
- ✅ `GET /member-specialties/member/:memberId` - Especialidades do membro
- ✅ `POST /member-specialties` - Adicionar especialidade

### 📰 Feed/Posts
- ✅ `GET /feed` - Listar posts
- ✅ `GET /feed/public` - Listar posts públicos
- ✅ `POST /feed` - Criar post
- ✅ `PUT /feed/:id` - Atualizar post
- ✅ `DELETE /feed/:id` - Deletar post
- ✅ `GET /feed/event/:eventId/posts` - Posts de um evento
- ✅ `POST /feed/:postId/comments` - Adicionar comentário
- ✅ `POST /feed/:postId/reactions` - Adicionar reação

### 🏫 Unidades
- ✅ `GET /units` - Listar unidades
- ✅ `POST /units` - Criar unidade
- ✅ `PUT /units/:id` - Atualizar unidade
- ✅ `DELETE /units/:id` - Deletar unidade

### 👤 Usuários
- ✅ `GET /users` - Listar usuários
- ✅ `POST /users` - Criar usuário
- ✅ `PUT /users/:id` - Atualizar usuário
- ✅ `DELETE /users/:id` - Deletar usuário

### 🏥 Health Check
- ✅ `GET /health` - Verificar status da API

## 🔧 Como Usar

### 1. Autenticação

```typescript
import { apiService } from './services/api';

// Login
const response = await apiService.login('email@exemplo.com', 'senha123');
// O token é automaticamente armazenado no localStorage
// response = { access_token, token_type, expires_in, user }
```

### 2. Buscar Dados

```typescript
// Buscar membros
const members = await apiService.getMembers();

// Buscar eventos
const events = await apiService.getEvents();

// Dashboard financeiro
const dashboard = await apiService.getFinanceDashboard();
```

### 3. Criar Recursos

```typescript
// Criar membro
const newMember = await apiService.createMember({
  firstName: 'João',
  lastName: 'Silva',
  birthdate: '2010-05-15',
  gender: 'M',
  status: 'active'
});

// Criar evento
const newEvent = await apiService.createEvent({
  title: 'Acampamento',
  description: 'Acampamento de inverno',
  type: 'campamento',
  startDate: '2025-11-01',
  endDate: '2025-11-03',
  location: 'Serra da Leba',
  status: 'planned'
});
```

### 4. Usar em Componentes

```tsx
import { useEffect, useState } from 'react';
import { apiService } from './services/api';

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await apiService.getMembers();
        setMembers(data);
      } catch (error) {
        console.error('Erro ao buscar membros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // ... render
}
```

## 🔑 Estrutura do Token

O token JWT é retornado no login e armazenado automaticamente:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 604800,
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "role": "admin"
  }
}
```

## 📝 Tipos TypeScript

Todos os tipos estão definidos em `src/types/index.ts`:

- `AuthResponseDto` - Resposta de autenticação
- `MemberResponseDto` - Dados do membro
- `EventResponseDto` - Dados do evento
- `TransactionResponseDto` - Transação financeira
- `InventoryItemResponseDto` - Item do inventário
- E muitos outros...

## 🎨 Hooks Personalizados

### `useDashboardData`
Busca dados do dashboard automaticamente:

```tsx
const {
  stats,
  revenueData,
  attendanceData,
  recentEvents,
  isLoading,
  error,
  refetch
} = useDashboardData();
```

## 🌐 Variáveis de Ambiente

Configure a URL base da API em `.env`:

```env
VITE_API_BASE_URL=https://clube-black-api.onrender.com
```

## 🚨 Tratamento de Erros

Todos os erros da API são capturados e podem ser tratados:

```typescript
try {
  const data = await apiService.getMembers();
} catch (error) {
  if (error.message.includes('401')) {
    // Token expirado - redirecionar para login
  } else {
    // Outro erro
    console.error(error.message);
  }
}
```

## 📈 Próximos Passos

Para expandir a integração:

1. **Adicionar endpoint `/auth/me`** - Para buscar dados do usuário logado
2. **Implementar refresh token** - Para renovar tokens expirados
3. **Adicionar paginação** - Para listas grandes
4. **Implementar filtros** - Para buscas avançadas
5. **Cache de dados** - Para melhor performance

## 🔗 Documentação da API

Acesse a documentação completa da API:
```
https://clube-black-api.onrender.com/docs
```

---

✅ **Integração 100% completa e funcional!**
