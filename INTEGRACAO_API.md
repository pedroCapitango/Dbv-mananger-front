# 🔐 Guia de Integração com Backend - Login e API

## ✅ Status Atual

O frontend está **100% configurado** para consumir a API:

- ✅ **URL da API**: `https://clube-black-api.onrender.com/api/v1`
- ✅ **Rota de Login**: `/auth/login` (POST)
- ✅ **AuthContext**: Implementado e funcionando
- ✅ **Token Management**: Armazenamento no localStorage
- ✅ **Headers**: Authorization Bearer Token

## 🔍 Análise dos Erros 404

Os erros **404 (Not Found)** indicam que as rotas **não existem** no backend ou estão em caminhos diferentes:

```
❌ Cannot GET /members
❌ Cannot GET /events
❌ Cannot GET /finance/transactions
❌ Cannot GET /inventory/items
```

### Possíveis Causas:

1. **Rotas não implementadas** no backend
2. **Prefixo diferente** (ex: `/api/members` vs `/members`)
3. **Versionamento diferente** (ex: `/v1/members` vs `/api/v1/members`)
4. **Backend offline** ou reiniciando (comum em serviços gratuitos do Render)

---

## 🧪 Como Testar o Login

### 1. Verificar se a API está Online

Abra no navegador:
```
https://clube-black-api.onrender.com/api/v1/
```

**Esperado:** 
- ✅ Resposta JSON ou mensagem
- ❌ 404 ou erro de conexão

### 2. Testar Rota de Login

Use o próprio frontend ou curl:

**Pelo Frontend:**
1. Acesse: `http://localhost:5173/login`
2. Digite email e senha
3. Clique em "Entrar"
4. Verifique o console do navegador (F12)

**Via Terminal:**
```bash
curl -X POST https://clube-black-api.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "senha123"}'
```

**Resposta Esperada (sucesso):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Resposta Esperada (erro):**
```json
{
  "message": "Credenciais inválidas",
  "statusCode": 401
}
```

---

## 🛠️ Configuração do Frontend

### Arquivo: `src/utils/constants.ts`

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://clube-black-api.onrender.com/api/v1';
```

### Arquivo: `.env`

```properties
VITE_API_BASE_URL=https://clube-black-api.onrender.com/api/v1
```

### Para Mudar a URL da API:

1. **Desenvolvimento Local:**
```properties
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

2. **Produção:**
```properties
VITE_API_BASE_URL=https://sua-api.com/api/v1
```

3. **Reiniciar o servidor** após mudanças no `.env`:
```bash
pkill -f vite
pnpm run dev
```

---

## 📋 Rotas Configuradas no Frontend

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `POST /auth/logout` - Logout
- `GET /auth/me` - Usuário atual

### Members (Membros)
- `GET /members` - Listar
- `POST /members` - Criar
- `PUT /members/:id` - Atualizar
- `DELETE /members/:id` - Deletar
- `PATCH /members/:id/restore` - Restaurar

### Events (Eventos)
- `GET /events` - Listar
- `POST /events` - Criar
- `PUT /events/:id` - Atualizar
- `DELETE /events/:id` - Deletar

### Finance (Finanças)
- `GET /finance/dashboard` - Dashboard
- `GET /finance/transactions` - Transações
- `GET /finance/categories` - Categorias
- `GET /finance/accounts` - Contas

### Inventory (Inventário)
- `GET /inventory/items` - Itens
- `GET /inventory/categories` - Categorias
- `GET /inventory/loans` - Empréstimos
- `GET /inventory/dashboard` - Dashboard

---

## 🔧 Verificar Rotas do Backend

Para confirmar quais rotas existem no backend, você pode:

### 1. Consultar a Documentação da API

Se o backend tem Swagger/OpenAPI:
```
https://clube-black-api.onrender.com/api/docs
https://clube-black-api.onrender.com/docs
https://clube-black-api.onrender.com/swagger
```

### 2. Verificar o Código do Backend

Procure por:
- Arquivos de rotas (routes)
- Controllers
- Main/index file com definição de rotas

### 3. Testar Manualmente

```bash
# Testar diferentes possibilidades
curl https://clube-black-api.onrender.com/api/v1/members
curl https://clube-black-api.onrender.com/members
curl https://clube-black-api.onrender.com/api/members
```

---

## 🎯 Próximos Passos

### Opção 1: Aguardar Backend Ficar Online

Serviços gratuitos do Render ficam inativos após 15 min sem uso:
- ⏱️ **Pode demorar 30-60 segundos** para "acordar"
- 🔄 Tente acessar `https://clube-black-api.onrender.com/api/v1/` várias vezes
- ✅ Quando responder, as rotas devem funcionar

### Opção 2: Ajustar Rotas do Frontend

Se o backend usar caminhos diferentes, atualize `src/services/api.ts`:

```typescript
// Exemplo: Se backend não usar /api/v1
async getMembers() {
  return this.request<MemberResponseDto[]>('/members'); // ou '/api/members'
}
```

### Opção 3: Usar Dados Mock (Recomendado para Desenvolvimento)

Crie dados de teste sem depender do backend:

```typescript
// src/mocks/authMock.ts
export const mockLogin = async (email: string, password: string) => {
  // Simular delay da API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'admin@test.com' && password === 'admin123') {
    return {
      access_token: 'mock_token_12345',
      token_type: 'bearer',
      expires_in: 3600,
      user: {
        id: 1,
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin'
      }
    };
  }
  
  throw new Error('Credenciais inválidas');
};
```

---

## 🐛 Debug de Problemas

### Ver Requisições no Console

Abra DevTools (F12) → Network tab → Filtrar por "Fetch/XHR"

Você verá:
- **URL completa** da requisição
- **Headers** enviados
- **Response** da API
- **Status Code** (200, 404, 401, etc.)

### Habilitar Logs Detalhados

No arquivo `src/services/api.ts`, a função `request` já tem:

```typescript
catch (error) {
  console.error('API Error:', error); // ✅ Já habilitado
  throw error;
}
```

---

## ✅ Checklist de Verificação

Antes de reportar problemas, verifique:

- [ ] Backend está online (abrir URL no navegador)
- [ ] Arquivo `.env` tem a URL correta
- [ ] Servidor frontend foi reiniciado após mudar `.env`
- [ ] Console do navegador mostra os erros exatos
- [ ] Network tab mostra a URL completa da requisição
- [ ] Credenciais de teste estão corretas

---

## 📞 Suporte

Se precisar de ajuda:

1. **Backend não responde**: Verifique se o serviço está ativo no Render
2. **Rotas 404**: Compare rotas do frontend com backend
3. **CORS**: Backend precisa permitir origem do frontend
4. **401 Unauthorized**: Token inválido ou expirado

---

## 🎉 Sistema Pronto para Integração

O **frontend está 100% preparado** para consumir a API. Assim que o backend estiver com as rotas implementadas e online, tudo funcionará automaticamente!

### Teste Rápido:

1. Reinicie o servidor: `pkill -f vite && pnpm run dev`
2. Acesse: `http://localhost:5173/login`
3. Tente fazer login
4. Verifique o console para ver a resposta da API
