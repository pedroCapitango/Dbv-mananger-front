# 🔑 Credenciais de Teste - Modo DEV

## 👤 Conta de Diretor (Principal)

Use estas credenciais para fazer login no sistema:

```
📧 Email:    diretor@desbravadores.com
🔒 Senha:    diretor123
👔 Cargo:    Diretor
```

## ℹ️ Como Funciona

O sistema está configurado com **Modo DEV** ativado, que permite login sem conexão com backend.

### Para fazer login:

1. Acesse: http://localhost:5175
2. Use QUALQUER email e senha
3. O sistema criará um usuário simulado automaticamente

### Exemplos de credenciais que funcionam:

```
# Diretor
📧 diretor@desbravadores.com
🔒 diretor123

# Secretário
📧 secretario@desbravadores.com  
🔒 secretario123

# Tesoureiro
📧 tesoureiro@desbravadores.com
🔒 tesoureiro123

# Ou QUALQUER email/senha que você quiser!
📧 teste@teste.com
🔒 123456
```

## 🎯 Modo DEV vs Modo Produção

### 🔧 Modo DEV (Ativo agora)
- ✅ Login funciona sem backend
- ✅ Aceita qualquer email/senha
- ✅ Cria usuário simulado automaticamente
- ✅ Perfeito para testar a interface

### 🚀 Modo Produção (API Real)
Para conectar com a API real:

1. Configure a URL da API no `.env`:
```bash
VITE_API_BASE_URL=https://clube-black-api.onrender.com
```

2. A API precisa estar online e acessível

3. Use credenciais válidas cadastradas na API

## 🧪 Testando o Sistema

### 1. Login
- Vá para http://localhost:5175
- Digite qualquer email e senha
- Clique em "Entrar"
- ✅ Você será autenticado automaticamente!

### 2. Dashboard
- Após login, você verá o dashboard
- Estatísticas simuladas serão exibidas
- Gráficos e listas de exemplo

### 3. Navegação
- Use a sidebar para navegar
- Explore os diferentes módulos
- Todos funcionam em modo demonstração

## 🔄 Como Desativar o Modo DEV

Se quiser usar a API real:

1. Edite `src/utils/devMode.ts`:
```typescript
const DEV_MODE = false; // Mude para false
```

2. Configure a URL correta da API no `.env`

3. Reinicie o servidor:
```bash
pnpm run dev
```

## 📝 Observações

- 🔧 No modo DEV, os dados não são salvos
- 🔄 Ao recarregar a página, você precisará fazer login novamente
- ✅ Perfeito para desenvolvimento e testes de UI
- 🚀 Para produção, desative o modo DEV e use a API real

## 🎉 Comece Agora!

```bash
# 1. Acesse a aplicação
http://localhost:5175

# 2. Faça login com:
Email: diretor@desbravadores.com
Senha: diretor123

# 3. Explore o sistema! 🚀
```

---

**Sistema de Gestão de Desbravadores**
**Desenvolvido com ❤️**
