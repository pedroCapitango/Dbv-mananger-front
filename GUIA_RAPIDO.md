# 🚀 Guia Rápido - Sistema de Gestão Desbravadores

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### 1. Clone o Repositório
```bash
git clone https://github.com/pedroCapitango/Dbv-mananger-front.git
cd Dbv-mananger-front
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=https://clube-black-api.onrender.com
```

### 4. Execute o Projeto

#### Desenvolvimento:
```bash
npm run dev
```
Acesse: http://localhost:5173

#### Build para Produção:
```bash
npm run build
npm run preview
```

---

## 🔐 Login (Modo Desenvolvimento)

O sistema está em **modo dev** - aceita qualquer credencial para login:

```
Email: qualquer@email.com
Senha: qualquer-senha
```

Para produção, desative o modo dev em `src/utils/devMode.ts`:
```typescript
export const DEV_MODE = false;
```

---

## 📱 Estrutura de Navegação

### Páginas Disponíveis:

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Dashboard | Visão geral do sistema |
| `/members` | Membros | Gestão de membros |
| `/units` | Unidades | Gestão de unidades |
| `/events` | Eventos | Gestão de eventos |
| `/attendance` | Presenças | Registro de presença |
| `/progress` | Progresso | Classes e especialidades |
| `/finance` | Finanças | Gestão financeira |
| `/inventory` | Inventário | Gestão de itens |
| `/feed` | Feed Social | Posts e interações |

---

## 🔧 Comandos Úteis

### Desenvolvimento:
```bash
# Executar servidor de desenvolvimento
npm run dev

# Verificar erros TypeScript
npm run build

# Lint código
npm run lint
```

### Produção:
```bash
# Build para produção
npm run build

# Preview da build
npm run preview
```

---

## 📂 Estrutura de Arquivos Importantes

```
src/
├── App.tsx                 # Rotas principais
├── main.tsx               # Entry point
│
├── pages/                 # Páginas da aplicação
│   ├── members/          # 👥 Gestão de membros
│   ├── units/            # 🏢 Gestão de unidades
│   ├── events/           # 📅 Gestão de eventos
│   ├── attendance/       # ✅ Registro de presença
│   ├── progress/         # 🏆 Progresso
│   ├── finance/          # 💰 Finanças
│   ├── inventory/        # 📦 Inventário
│   └── feed/             # 💬 Feed social
│
├── hooks/                # Custom hooks
│   ├── useMembers.ts
│   ├── useEvents.ts
│   ├── useFinance.ts
│   └── ...
│
├── services/
│   └── api.ts            # 58 endpoints da API
│
├── components/
│   ├── ui/              # Componentes reutilizáveis
│   ├── dashboard/       # Componentes do dashboard
│   └── layout/          # Layout (Sidebar, Header)
│
└── utils/
    ├── constants.ts     # Constantes (API_BASE_URL)
    ├── formatters.ts    # Funções de formatação
    └── devMode.ts       # Modo desenvolvimento
```

---

## 🎯 Como Usar Cada Módulo

### 👥 Membros
1. Acesse `/members`
2. Clique em "Novo Membro" para adicionar
3. Use a busca para filtrar
4. Clique nos ícones para Ver/Editar/Deletar
5. Membros deletados podem ser restaurados

### 🏢 Unidades
1. Acesse `/units`
2. Crie unidades (Lobinhos, Pioneiros, etc.)
3. Visualize quantos membros tem em cada unidade
4. Edite ou delete conforme necessário

### 📅 Eventos
1. Acesse `/events`
2. Crie eventos (Reunião, Acampamento, etc.)
3. Clique em "Gerir Participantes" para adicionar membros
4. Adicione/remova participantes facilmente

### ✅ Presenças
1. Acesse `/attendance`
2. Registre presença individual OU
3. Use "Registro em Massa" para marcar todos
4. Selecione um evento para ver quem esteve presente
5. Dashboard mostra estatísticas de presença

### 🏆 Progresso
1. Acesse `/progress`
2. Registre progresso de classes (Pata Tenra, Saltador, etc.)
3. Adicione especialidades conquistadas
4. Selecione um membro para ver suas especialidades

### 💰 Finanças
1. Acesse `/finance`
2. Adicione transações (receitas/despesas)
3. Dashboard mostra resumo financeiro
4. Categorize transações
5. Gere relatórios mensais

### 📦 Inventário
1. Acesse `/inventory`
2. Adicione itens ao inventário
3. Crie empréstimos de itens
4. Registre devoluções
5. Alertas para estoque baixo

### 💬 Feed Social
1. Acesse `/feed`
2. Crie posts com título e conteúdo
3. Adicione comentários em posts
4. Reaja com likes
5. Controle visibilidade (público/privado)

---

## 🔌 Integração com API

### Configuração da API:

A URL base da API está em `src/utils/constants.ts`:

```typescript
export const API_BASE_URL = 'https://clube-black-api.onrender.com';
```

### Como Funciona:

1. **Autenticação**: Token JWT armazenado no localStorage
2. **Requisições**: Service centralizado em `src/services/api.ts`
3. **Hooks**: Cada módulo tem seu hook personalizado
4. **Estado**: Gerenciado com React Hooks (useState, useEffect)

### Exemplo de Uso:

```typescript
// Em um componente
import { useMembers } from '../../hooks/useMembers';

function MyComponent() {
  const { members, isLoading, createMember } = useMembers();
  
  const handleCreate = async (data) => {
    await createMember(data);
  };
  
  return (
    // ... seu JSX
  );
}
```

---

## 🎨 Personalização

### Cores e Tema

Edite `tailwind.config.js` para mudar cores:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#1E40AF',    // Azul principal
      secondary: '#10B981',  // Verde secundário
      // ...
    }
  }
}
```

### Componentes UI

Todos os componentes estão em `src/components/ui/`:
- `Button.tsx` - Botões com variantes
- `Modal.tsx` - Modais reutilizáveis
- `Form.tsx` - Formulários dinâmicos
- `Table.tsx` - Tabelas com ações
- etc.

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro de CORS na API
Verifique se a API está rodando e acessível:
```
https://clube-black-api.onrender.com/health
```

### Build falha com erros TypeScript
```bash
npm install --save-dev @types/node
npm run build
```

### Página em branco
1. Verifique o console do navegador (F12)
2. Verifique se a API está online
3. Limpe o localStorage: `localStorage.clear()`

---

## 📝 Criar Nova Funcionalidade

### 1. Crie o Hook (se necessário):

```typescript
// src/hooks/useMyFeature.ts
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useMyFeature = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchData = async () => {
    const result = await apiService.getMyData();
    setData(result);
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return { data, isLoading, fetchData };
};
```

### 2. Crie a Página:

```typescript
// src/pages/myfeature/MyFeaturePage.tsx
import React from 'react';
import { useMyFeature } from '../../hooks/useMyFeature';

export const MyFeaturePage = () => {
  const { data, isLoading } = useMyFeature();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Minha Feature</h1>
      {/* ... */}
    </div>
  );
};
```

### 3. Adicione a Rota:

```typescript
// src/App.tsx
import { MyFeaturePage } from './pages/myfeature/MyFeaturePage';

// Dentro de Routes:
<Route path="/myfeature" element={
  <ProtectedRoute>
    <MyFeaturePage />
  </ProtectedRoute>
} />
```

### 4. Adicione ao Menu:

```typescript
// src/components/layout/Sidebar.tsx
import { MyIcon } from 'lucide-react';

const menuItems = [
  // ...
  { id: 'myfeature', icon: MyIcon, label: 'Minha Feature' },
];
```

---

## 🚀 Deploy

### Vercel (Recomendado):
```bash
npm install -g vercel
vercel
```

### Netlify:
```bash
npm run build
# Upload pasta dist/ para Netlify
```

### GitHub Pages:
```bash
npm run build
# Configure GitHub Pages para servir da pasta dist/
```

---

## 📚 Recursos

### Documentação:
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

### Ícones:
- [Lucide React](https://lucide.dev)

### API:
- Documentação: `https://clube-black-api.onrender.com/docs`

---

## ✅ Checklist para Produção

- [ ] Desabilitar modo dev (`DEV_MODE = false`)
- [ ] Configurar variáveis de ambiente corretas
- [ ] Testar todas as funcionalidades
- [ ] Build sem erros: `npm run build`
- [ ] Otimizar imagens e assets
- [ ] Configurar HTTPS
- [ ] Configurar domínio personalizado
- [ ] Configurar analytics (opcional)
- [ ] Backup dos dados
- [ ] Monitoramento de erros (Sentry)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'feat: adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja LICENSE para mais detalhes.

---

## 💡 Dicas Finais

1. **Use DevTools**: React DevTools e Redux DevTools são seus amigos
2. **Console.log**: Use `console.log` para debug, mas remova antes do commit
3. **TypeScript**: Aproveite a tipagem para evitar bugs
4. **Componentes**: Reutilize componentes sempre que possível
5. **Hooks**: Mantenha lógica complexa em hooks customizados
6. **Error Handling**: Sempre trate erros com try/catch
7. **Loading States**: Sempre mostre feedback ao usuário
8. **Responsividade**: Teste em diferentes dispositivos

---

**Happy Coding! 🎉**

Se precisar de ajuda, abra uma issue no GitHub!
