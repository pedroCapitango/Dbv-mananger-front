# 🔧 Configuração da API

## ✅ Correção Aplicada

O sistema estava tentando conectar em `localhost:3000` mas a API real está em:
```
https://clube-black-api.onrender.com
```

## 🔧 Configurações Atualizadas

### 1. `.env` - Arquivo de Ambiente
```env
VITE_API_BASE_URL=https://clube-black-api.onrender.com
```

### 2. `src/utils/constants.ts` - Constantes
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://clube-black-api.onrender.com';
```

### 3. `src/contexts/AuthContext.tsx` - Auth Context
- Removida validação de token no carregamento inicial
- Token só será validado na primeira request

### 4. `src/hooks/useDashboardData.ts` - Dashboard Hook
- Adicionado tratamento de erro para cada request
- Sistema continua funcionando mesmo se a API estiver offline

## 🚀 Como Usar

### Produção (API Real)
```bash
# .env
VITE_API_BASE_URL=https://clube-black-api.onrender.com
```

### Desenvolvimento Local (Backend Local)
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000
```

### Desenvolvimento (Modo Mock)
O sistema já tem modo dev ativado que simula login sem backend.

## 🔍 Verificar Conexão

### 1. Health Check da API
```bash
curl https://clube-black-api.onrender.com/health
```

### 2. Testar Login
```bash
curl -X POST https://clube-black-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 🐛 Troubleshooting

### Erro: ERR_CONNECTION_REFUSED
**Causa:** URL da API incorreta
**Solução:** Verificar `.env` e `constants.ts`

### Erro: 401 Unauthorized
**Causa:** Token inválido ou expirado
**Solução:** Fazer login novamente

### Erro: CORS
**Causa:** Backend não permite requisições do frontend
**Solução:** Configurar CORS no backend

## ✅ Checklist

- [x] `.env` com URL correta
- [x] `constants.ts` com fallback correto
- [x] `AuthContext` sem validação prematura
- [x] `useDashboardData` com error handling
- [x] Servidor reiniciado

## 🔄 Restart Necessário

Após alterar `.env`, reinicie o servidor:
```bash
# Ctrl+C para parar
pnpm run dev
```

---

**Status:** ✅ Corrigido
**API Base URL:** https://clube-black-api.onrender.com
**Frontend:** http://localhost:5175
