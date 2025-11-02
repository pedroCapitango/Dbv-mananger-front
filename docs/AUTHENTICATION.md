# 📝 Documentação - Sistema de Autenticação

## 🔐 Funcionalidades de Autenticação

### 1. Login de Usuário

**Endpoint:** `POST /auth/login`

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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "usuario@email.com",
    "role": "USER",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

**Errors:**
- `401 Unauthorized`: Credenciais inválidas
- `400 Bad Request`: Dados de entrada inválidos
- `500 Internal Server Error`: Erro no servidor

**Frontend Implementation:**
```typescript
// src/services/api.ts
async login(email: string, password: string) {
  const response = await this.request<AuthResponseDto>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (response.access_token) {
    this.setToken(response.access_token);
  }
  
  return response;
}
```

---

### 2. Registro de Usuário

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senhaSegura123",
  "confirmPassword": "senhaSegura123"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 2,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "USER",
    "createdAt": "2025-01-15T14:30:00Z",
    "updatedAt": "2025-01-15T14:30:00Z"
  }
}
```

**Validações (Backend):**
- Nome: mínimo 3 caracteres, máximo 100
- Email: formato válido, único no sistema
- Senha: mínimo 6 caracteres
- Confirm Password: deve ser igual a password

**Errors:**
- `400 Bad Request`: 
  - Email já cadastrado
  - Senhas não coincidem
  - Dados inválidos
- `422 Unprocessable Entity`: Falha de validação
- `500 Internal Server Error`: Erro no servidor

**Frontend Implementation:**
```typescript
// src/services/api.ts
async register(data: RegisterDto) {
  const response = await this.request<AuthResponseDto>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  // Auto-save token after successful registration
  this.setToken(response.access_token);
  return response;
}
```

---

### 3. Logout

**Frontend Only:** Remove o token do localStorage e limpa o estado de autenticação.

```typescript
// src/services/api.ts
async logout() {
  this.setToken(null);
}
```

---

## 🎨 UI/UX - Tela de Registro

### Componente: `RegisterScreen`

**Localização:** `src/components/auth/RegisterScreen.tsx`

**Features:**

#### 1. Formulário de Registro
- **Nome Completo** (obrigatório, min 3 caracteres)
- **Email** (obrigatório, validação de formato)
- **Senha** (obrigatório, min 6 caracteres)
- **Confirmar Senha** (deve coincidir com senha)

#### 2. Validações em Tempo Real
```typescript
const validateForm = (): boolean => {
  const newErrors: Partial<Record<keyof RegisterDto, string>> = {};

  // Nome
  if (!formData.name || formData.name.trim().length < 3) {
    newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
  }

  // Email
  if (!validateEmail(formData.email)) {
    newErrors.email = 'Email inválido';
  }

  // Senha
  if (formData.password.length < 6) {
    newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
  }

  // Confirmação
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'As senhas não coincidem';
  }

  return Object.keys(newErrors).length === 0;
};
```

#### 3. Indicador de Força da Senha
```typescript
const passwordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { text: 'Fraca', color: 'bg-red-500' };
  if (strength <= 3) return { text: 'Média', color: 'bg-yellow-500' };
  return { text: 'Forte', color: 'bg-green-500' };
};
```

**Visual:**
- Barra de progresso colorida
- Texto indicador (Fraca/Média/Forte)
- Dica: "Use pelo menos 6 caracteres, incluindo letras e números"

#### 4. Auto-Login Após Registro
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Registrar usuário
  await apiService.register(formData);
  
  // 2. Fazer login automaticamente
  await login(formData.email, formData.password);
  
  // 3. Redirecionamento automático via AuthContext
};
```

#### 5. Links e Navegação
- **Voltar ao Login**: Botão no topo esquerdo
- **Já tem conta?**: Link no rodapé
- **Termos e Privacidade**: Links inline no aviso

#### 6. Features Preview
Lista de benefícios ao criar conta:
- ✅ Dashboard personalizado
- ✅ Eventos e atividades do clube
- ✅ Acompanhamento de progresso
- ✅ Comunidade e feed social

---

## 🔄 Fluxo de Registro Completo

```
┌─────────────────────────────────────────────┐
│ 1. Usuário acessa /register                 │
└─────────────────┬───────────────────────────┘
                  │
                  v
┌─────────────────────────────────────────────┐
│ 2. Preenche formulário:                     │
│    - Nome: João Silva                       │
│    - Email: joao@email.com                  │
│    - Senha: ******** (validação em tempo    │
│      real mostra força)                     │
│    - Confirmar: ******** (valida match)     │
└─────────────────┬───────────────────────────┘
                  │
                  v
┌─────────────────────────────────────────────┐
│ 3. Clica "Criar Conta"                      │
│    - Frontend valida todos os campos        │
│    - Se inválido: exibe erros               │
│    - Se válido: POST /auth/register         │
└─────────────────┬───────────────────────────┘
                  │
                  v
┌─────────────────────────────────────────────┐
│ 4. Backend processa:                        │
│    - Valida dados                           │
│    - Verifica email duplicado               │
│    - Hash da senha                          │
│    - Cria usuário (role: USER)              │
│    - Gera JWT token                         │
│    - Retorna token + user                   │
└─────────────────┬───────────────────────────┘
                  │
                  v
┌─────────────────────────────────────────────┐
│ 5. Frontend recebe resposta:                │
│    - Salva token no apiService              │
│    - Chama login(email, password)           │
│    - AuthContext atualiza estado            │
│    - isAuthenticated = true                 │
└─────────────────┬───────────────────────────┘
                  │
                  v
┌─────────────────────────────────────────────┐
│ 6. Redirecionamento automático:             │
│    - Se USER: → MemberDashboard (feed)      │
│    - Se ADMIN: → DashboardPage (analytics)  │
└─────────────────────────────────────────────┘
```

---

## 🛡️ Segurança Implementada

### 1. Validação Client-Side
```typescript
// Validadores em src/utils/validators.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
```

### 2. Senha Forte
- Mínimo 6 caracteres (backend pode exigir mais)
- Indicador visual de força
- Sugestões para melhorar segurança

### 3. Token Storage
```typescript
// src/services/api.ts
setToken(token: string | null) {
  this.token = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}
```

### 4. Protected Routes
```typescript
// Usuários não autenticados não podem acessar /register se já logados
<Route 
  path="/register" 
  element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterScreen />} 
/>
```

---

## 🎯 Tratamento de Erros

### Frontend Error Handling

```typescript
try {
  const response = await apiService.register(formData);
  await login(formData.email, formData.password);
} catch (err: any) {
  // Exibe mensagem de erro amigável
  setApiError(err.message || 'Erro ao criar conta. Tente novamente.');
}
```

### Mensagens de Erro Comuns

| Erro Backend | Mensagem Exibida |
|--------------|------------------|
| Email já existe | "Este email já está cadastrado" |
| Senhas não coincidem | "As senhas não coincidem" |
| Validação falhou | "Falha de validação: [detalhes]" |
| Servidor offline | "Não foi possível conectar ao servidor" |
| Erro 500 | "Erro no servidor. Tente novamente mais tarde" |

---

## 📋 Types TypeScript

```typescript
// src/types/index.ts
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserResponseDto;
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🧪 Testes (Sugeridos)

### Testes Manuais

1. **Registro bem-sucedido:**
   - Preencher todos os campos corretamente
   - Verificar redirecionamento para dashboard
   - Confirmar token salvo no localStorage

2. **Validações:**
   - Submeter com campos vazios
   - Email inválido (sem @, sem domínio)
   - Senha < 6 caracteres
   - Senhas não coincidem

3. **Email duplicado:**
   - Tentar registrar com email já existente
   - Verificar mensagem de erro clara

4. **Força da senha:**
   - Senha fraca: "123456"
   - Senha média: "abc123XYZ"
   - Senha forte: "Abc@123!XyZ"

### Testes Automatizados (E2E Sugeridos)

```typescript
// Exemplo com Cypress
describe('Register Flow', () => {
  it('should register a new user successfully', () => {
    cy.visit('/register');
    cy.get('input[name="name"]').type('João Silva');
    cy.get('input[name="email"]').type('joao@test.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senha123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/');
    cy.contains('Olá, João Silva');
  });

  it('should show error for mismatched passwords', () => {
    cy.visit('/register');
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senha456');
    cy.get('button[type="submit"]').click();
    
    cy.contains('As senhas não coincidem');
  });
});
```

---

## 🎨 Customização Visual

### Cores e Estilos

```css
/* Gradiente de fundo */
bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950

/* Card principal */
bg-white rounded-2xl shadow-2xl

/* Botão primário */
bg-blue-600 hover:bg-blue-700

/* Indicador de força */
- Fraca: bg-red-500
- Média: bg-yellow-500
- Forte: bg-green-500
```

### Animações

```css
/* Fade in na entrada */
animate-fadeIn

/* Transições suaves */
transition-all duration-300
```

---

## 📱 Responsividade

- **Mobile**: Largura completa, padding reduzido
- **Tablet**: Card centralizado, max-width 28rem
- **Desktop**: Card centralizado, max-width 28rem

```css
/* Container responsivo */
className="w-full max-w-md p-8"
```

---

## 🔗 Rotas Configuradas

```typescript
// src/App.tsx
<Routes>
  {/* Página de login */}
  <Route 
    path="/login" 
    element={isAuthenticated ? <Navigate to="/" /> : <LoginScreen />} 
  />
  
  {/* Página de registro */}
  <Route 
    path="/register" 
    element={isAuthenticated ? <Navigate to="/" /> : <RegisterScreen />} 
  />
  
  {/* Dashboard (redirecionamento após login/registro) */}
  <Route 
    path="/" 
    element={
      <ProtectedRoute>
        {userIsAdmin ? <DashboardPage /> : <MemberDashboard />}
      </ProtectedRoute>
    } 
  />
</Routes>
```

---

## 🚀 Deploy & Produção

### Variáveis de Ambiente

```bash
# .env.production
VITE_API_BASE_URL=https://api.seudominio.com/api/v1
VITE_ENABLE_DEV_MODE=false
VITE_DEBUG_API=false
```

### Checklist de Produção

- [ ] Backend configurado com HTTPS
- [ ] CORS configurado corretamente
- [ ] Rate limiting no endpoint /auth/register
- [ ] Validação de força de senha no backend
- [ ] Email de confirmação (opcional)
- [ ] Captcha/reCAPTCHA (anti-bot)
- [ ] Logs de auditoria para novos registros

---

## 📚 Referências

- [React Router v7 - Authentication](https://reactrouter.com/en/main/start/tutorial#authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

**Versão:** 1.0.0  
**Data:** Janeiro 2025  
**Autor:** Sistema Desbravadores Team
