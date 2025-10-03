# 🏕️ Sistema de Gestão de Clubes Desbravadores

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-purple.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8.svg)](https://tailwindcss.com)

Sistema completo de gestão para clubes de Desbravadores/Escoteiros, com integração total de 58 endpoints da API.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Uso](#uso)
- [Documentação](#documentação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)

---

## 🎯 Sobre o Projeto

Sistema web completo para gestão de clubes de Desbravadores, incluindo:

- **Gestão de Membros** - Cadastro, histórico e informações completas
- **Unidades** - Organização por Lobinhos, Pioneiros, etc.
- **Eventos** - Criação e gestão de eventos com participantes
- **Presenças** - Registro individual e em massa
- **Progresso** - Classes e especialidades dos membros
- **Finanças** - Controle completo de receitas e despesas
- **Inventário** - Gestão de itens e empréstimos
- **Feed Social** - Comunicação e posts da comunidade

### ✨ Destaques

- ✅ **100% TypeScript** - Type-safe em todo o código
- ✅ **58 Endpoints** da API integrados
- ✅ **9 Páginas** completas e funcionais
- ✅ **Responsivo** - Mobile-first design
- ✅ **Autenticação JWT** - Segurança completa
- ✅ **Modais Reutilizáveis** - UX consistente
- ✅ **Real-time Updates** - Atualizações automáticas

---

## 🚀 Funcionalidades

### 📱 Páginas Implementadas

| Página | Rota | Descrição |
|--------|------|-----------|
| 🏠 Dashboard | `/` | Visão geral com estatísticas |
| 👥 Membros | `/members` | CRUD completo de membros |
| 🏢 Unidades | `/units` | Gestão de unidades |
| 📅 Eventos | `/events` | Gestão de eventos + participantes |
| ✅ Presenças | `/attendance` | Registro de presença |
| 🏆 Progresso | `/progress` | Classes e especialidades |
| 💰 Finanças | `/finance` | Gestão financeira |
| 📦 Inventário | `/inventory` | Itens e empréstimos |
| 💬 Feed | `/feed` | Posts e interações |

### 🔥 Funcionalidades Avançadas

- **Gestão de Participantes** em eventos
- **Registro em Massa** de presenças
- **Sistema de Reações** no feed social
- **Devolução de Empréstimos** no inventário
- **Restaurar Membros** deletados
- **Dashboard Interativo** com gráficos
- **Busca em Tempo Real** em todas as páginas
- **Modais de Confirmação** para ações críticas

---

## 🛠️ Tecnologias

### Frontend
- ⚛️ **React 19** - Biblioteca UI
- 🔷 **TypeScript 5** - Tipagem estática
- ⚡ **Vite 7** - Build tool ultrarrápido
- 🎨 **Tailwind CSS 3** - Estilização utility-first
- 🧭 **React Router DOM** - Roteamento SPA
- 🎭 **Lucide React** - Ícones modernos

### Estado & Dados
- 🎣 **React Hooks** - useState, useEffect, useContext
- 🔄 **Custom Hooks** - 11 hooks especializados
- 🔐 **Context API** - Autenticação global
- 📡 **Fetch API** - Requisições HTTP

### Backend (API)
- 🌐 API REST completa
- 🔑 Autenticação JWT
- 📄 58 endpoints disponíveis
- 🔗 [Documentação da API](https://clube-black-api.onrender.com/docs)

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/pedroCapitango/Dbv-mananger-front.git
cd Dbv-mananger-front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente**

Crie um arquivo `.env`:
```env
VITE_API_BASE_URL=https://clube-black-api.onrender.com
```

4. **Execute o projeto**
```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 🎮 Uso

### Login (Modo Desenvolvimento)

Em desenvolvimento, qualquer credencial funciona:

```
Email: qualquer@email.com
Senha: qualquer-senha
```

### Navegação

Use o menu lateral para acessar:
- 🏠 Dashboard
- 👥 Membros
- 🏢 Unidades
- 📅 Eventos
- ✅ Presenças
- 🏆 Progresso
- 💰 Finanças
- 📦 Inventário
- 💬 Feed Social

### Exemplo: Criar Membro

1. Acesse `/members`
2. Clique em "Novo Membro"
3. Preencha o formulário
4. Clique em "Criar Membro"

---

## 📚 Documentação

### Documentação Completa

- 📖 [**PROJETO_COMPLETO.md**](./PROJETO_COMPLETO.md) - Visão geral completa do sistema
- 🚀 [**GUIA_RAPIDO.md**](./GUIA_RAPIDO.md) - Como começar e usar o sistema
- 📡 [**API_REFERENCE.md**](./API_REFERENCE.md) - Referência de todos os 58 endpoints

### Outros Documentos

- 📄 [INTEGRACAO-API.md](./INTEGRACAO-API.md) - Integração com a API
- 📝 [RESUMO-TECNICO.md](./RESUMO-TECNICO.md) - Resumo técnico
- 🎯 [FUNCIONALIDADES_DISPONIVEIS.md](./FUNCIONALIDADES_DISPONIVEIS.md) - Funcionalidades disponíveis

---

## 📂 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes UI (Table, Modal, Form, etc.)
│   ├── dashboard/      # Componentes do dashboard
│   └── layout/         # Layout (Sidebar, Header)
│
├── pages/              # Páginas da aplicação
│   ├── members/        # 👥 Gestão de membros
│   ├── units/          # 🏢 Gestão de unidades
│   ├── events/         # 📅 Gestão de eventos
│   ├── attendance/     # ✅ Registro de presença
│   ├── progress/       # 🏆 Progresso
│   ├── finance/        # 💰 Finanças
│   ├── inventory/      # 📦 Inventário
│   └── feed/           # 💬 Feed social
│
├── hooks/              # Custom hooks (11 hooks)
│   ├── useMembers.ts
│   ├── useEvents.ts
│   ├── useFinance.ts
│   ├── useInventory.ts
│   ├── useUnits.ts
│   ├── useAttendance.ts
│   ├── useProgress.ts
│   ├── useFeed.ts
│   ├── useUsers.ts
│   └── useDashboardData.ts
│
├── services/           # API service (58 endpoints)
│   └── api.ts
│
├── types/              # TypeScript types
│   └── index.ts
│
├── utils/              # Utilitários
│   ├── constants.ts
│   ├── formatters.ts
│   └── validators.ts
│
├── App.tsx             # Rotas principais
└── main.tsx            # Entry point
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm run preview      # Preview da build

# Qualidade de Código
npm run lint         # Executa ESLint
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

### Convenção de Commits

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Tarefas gerais

---

## 📊 Status do Projeto

✅ **Projeto 100% Concluído!**

- [x] 58 endpoints da API integrados
- [x] 9 páginas funcionais
- [x] 11 hooks personalizados
- [x] 15+ componentes UI
- [x] Documentação completa
- [x] TypeScript 100%
- [x] Responsivo
- [x] Autenticação JWT

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

Desenvolvido com ❤️ para a comunidade de Desbravadores

- **Desenvolvedor:** [Pedro Capitango](https://github.com/pedroCapitango)

---

## 📞 Suporte

Para dúvidas ou sugestões:

- 📧 Email: contato@clubedesbravadores.com
- 🐛 Issues: [GitHub Issues](https://github.com/pedroCapitango/Dbv-mananger-front/issues)
- 📚 Docs: [Documentação Completa](./PROJETO_COMPLETO.md)

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**

---

*Última atualização: Junho 2024*
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
