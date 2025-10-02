# 🏕️ Sistema de Gestão de Desbravadores

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Sistema completo de gestão para clubes de desbravadores**

[Demo](#) • [Documentação](./PROJETO.md) • [Guia Rápido](./GUIA-RAPIDO.md)

</div>

---

## 📋 Sobre o Projeto

Sistema moderno e profissional desenvolvido com React, TypeScript e Tailwind CSS para facilitar a gestão completa de clubes de desbravadores, incluindo membros, eventos, finanças e inventário.

## ✨ Funcionalidades

- 🔐 **Autenticação** - Sistema de login seguro
- 📊 **Dashboard** - Visão geral com estatísticas e gráficos
- 👥 **Membros** - Gestão completa de desbravadores
- 📅 **Eventos** - Planejamento e acompanhamento
- 💰 **Finanças** - Controle de receitas e despesas
- 📦 **Inventário** - Gestão de materiais
- 🏆 **Progresso** - Acompanhamento de especialidades

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/pedroCapitango/Dbv-mananger-front.git

# Entre no diretório
cd Dbv-mananger-front

# Instale as dependências
pnpm install

# Configure o ambiente
cp .env.example .env

# Inicie o servidor
pnpm dev
```

Acesse: **http://localhost:5173**

## 🛠️ Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Vite** - Build tool
- **Recharts** - Gráficos
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes React
│   ├── auth/        # Autenticação
│   ├── dashboard/   # Dashboard
│   ├── layout/      # Layout
│   └── ui/          # Componentes UI
├── contexts/        # Contextos React
├── hooks/           # Custom hooks
├── services/        # Serviços de API
├── types/           # Tipos TypeScript
└── utils/           # Utilitários
```

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [PROJETO.md](./PROJETO.md) | Visão geral completa |
| [ARQUITETURA.md](./ARQUITETURA.md) | Documentação técnica |
| [GUIA-RAPIDO.md](./GUIA-RAPIDO.md) | Getting started |
| [EXEMPLOS.md](./EXEMPLOS.md) | Exemplos de código |
| [DICAS.md](./DICAS.md) | Boas práticas |
| [RESUMO.md](./RESUMO.md) | Status do projeto |

## 📜 Scripts Disponíveis

```bash
pnpm dev      # Servidor de desenvolvimento
pnpm build    # Build de produção
pnpm preview  # Preview do build
pnpm lint     # Executar linter
```

## 🎨 Componentes UI

O projeto inclui componentes reutilizáveis:

- **Button** - 4 variantes (primary, secondary, danger, ghost)
- **Input** - Com validação e mensagens de erro
- **Card** - Container de conteúdo
- **Modal** - Diálogos customizáveis
- **Alert** - 4 tipos de alertas
- **LoadingSpinner** - Indicadores de loading

## 📱 Responsividade

Totalmente responsivo e otimizado para:
- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (> 1024px)

## ♿ Acessibilidade

- Navegação por teclado
- ARIA labels
- Contraste adequado
- Suporte a leitores de tela

## 🧪 Qualidade

- ✅ TypeScript strict mode
- ✅ ESLint configurado
- ✅ Código componentizado
- ✅ Separação de responsabilidades
- ✅ Documentação completa

## 🎯 Status do Projeto

- ✅ Sistema de autenticação
- ✅ Dashboard interativo
- ✅ Layout responsivo
- ✅ Componentes UI
- ✅ Documentação completa
- ⏳ Integração com backend
- ⏳ Módulo de membros
- ⏳ Módulo de eventos
- ⏳ Módulo de finanças

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Pedro Capitango**

- GitHub: [@pedroCapitango](https://github.com/pedroCapitango)
- Email: pedro@example.com

## 🙏 Agradecimentos

- Clube de Desbravadores
- Comunidade React
- Comunidade TypeScript

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

Feito com ❤️ por Pedro Capitango

</div>
