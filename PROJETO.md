# 🏕️ Sistema de Gestão de Desbravadores

Sistema completo de gestão para clubes de desbravadores, desenvolvido com React, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

- 🔐 **Autenticação**: Sistema de login seguro com validação
- 📊 **Dashboard**: Visualização de estatísticas, gráficos e métricas principais
- 👥 **Gestão de Membros**: Cadastro e controle de desbravadores
- 📅 **Eventos**: Planejamento e acompanhamento de eventos e acampamentos
- 💰 **Finanças**: Controle de receitas e despesas
- 📦 **Inventário**: Gestão de materiais e equipamentos
- 🏆 **Progresso**: Acompanhamento de especialidades e conquistas

## 🚀 Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Vite** - Build tool
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Componentes de autenticação
│   ├── dashboard/      # Componentes do dashboard
│   ├── layout/         # Layout (Sidebar, Header)
│   └── ui/             # Componentes UI reutilizáveis
├── contexts/           # Contextos React (Auth, etc)
├── hooks/              # Custom hooks
├── services/           # Serviços de API
├── types/              # Tipos TypeScript
└── utils/              # Funções utilitárias
```

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/pedroCapitango/Dbv-mananger-front.git

# Entre no diretório
cd Dbv-mananger-front

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
pnpm dev
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Sistema Desbravadores
VITE_APP_VERSION=1.0.0
```

## 📜 Scripts Disponíveis

```bash
pnpm dev      # Inicia o servidor de desenvolvimento
pnpm build    # Build de produção
pnpm preview  # Preview do build de produção
pnpm lint     # Executa o linter
```

## 🎨 Componentes UI

O projeto inclui componentes UI customizados e reutilizáveis:

- **Button** - Botões com variantes (primary, secondary, danger, ghost)
- **Input** - Input com validação e mensagens de erro
- **Card** - Container para conteúdo
- **Modal** - Diálogos modais
- **Alert** - Alertas e notificações
- **LoadingSpinner** - Indicadores de carregamento

## 🔒 Autenticação

O sistema utiliza JWT para autenticação. O token é armazenado no localStorage e enviado em todas as requisições através do header `Authorization`.

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🎯 Próximos Passos

- [ ] Implementar módulo de Membros
- [ ] Implementar módulo de Eventos
- [ ] Implementar módulo de Finanças
- [ ] Implementar módulo de Inventário
- [ ] Implementar módulo de Progresso
- [ ] Adicionar testes unitários
- [ ] Adicionar testes E2E
- [ ] Implementar PWA
- [ ] Adicionar suporte offline

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Pedro Capitango**
- GitHub: [@pedroCapitango](https://github.com/pedroCapitango)

---

⭐ Se este projeto foi útil, considere dar uma estrela!
