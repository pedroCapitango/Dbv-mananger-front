# 🚀 Funcionalidades Disponíveis na API - Ainda Não Implementadas

## 📊 Análise Completa da API

Total de **58 endpoints** disponíveis na API.  
**Implementados no Front:** ~24 endpoints (41%)  
**Disponíveis para implementar:** ~34 endpoints (59%)

---

## 🔥 Funcionalidades Prioritárias para Implementar

### 1. **GESTÃO DE USUÁRIOS** 👥
**Status:** ❌ Não implementado  
**Endpoints disponíveis:** 5

```typescript
// API já tem:
- GET /users - Listar todos usuários
- GET /users/:id - Ver detalhes do usuário
- POST /users - Criar novo usuário
- PUT /users/:id - Atualizar usuário
- DELETE /users/:id - Deletar usuário
```

**Criar página:** `src/pages/users/UsersPage.tsx`

**Funcionalidades:**
- ✅ Listagem de usuários com permissões
- ✅ CRUD completo de usuários
- ✅ Gestão de roles (admin, staff, member)
- ✅ Filtros por role e status
- ✅ Modal de visualização
- ✅ Controle de acesso baseado em permissões

**Complexidade:** 🟢 Baixa (similar a MembersPage)

---

### 2. **GESTÃO DE UNIDADES** 🏢
**Status:** ❌ Não implementado  
**Endpoints disponíveis:** 5

```typescript
// API já tem:
- GET /units - Listar unidades
- GET /units/:id - Ver detalhes da unidade
- POST /units - Criar unidade
- PUT /units/:id - Atualizar unidade
- DELETE /units/:id - Deletar unidade
```

**Criar página:** `src/pages/units/UnitsPage.tsx`

**Funcionalidades:**
- ✅ Listagem de unidades (Lobinhos, Pioneiros, etc.)
- ✅ CRUD completo
- ✅ Ver membros por unidade
- ✅ Estatísticas da unidade
- ✅ Líderes e organização

**Complexidade:** 🟢 Baixa

---

### 3. **PRESENÇA/ATTENDANCE** 📋
**Status:** ❌ Não implementado  
**Endpoints disponíveis:** 6

```typescript
// API já tem:
- GET /attendance - Listar presenças
- POST /attendance - Registrar presença
- POST /attendance/bulk - Registrar presença em massa
- GET /attendance/event/:eventId - Presenças de um evento
- GET /attendance/member/:memberId - Presenças de um membro
- GET /attendance/statistics/overall - Estatísticas gerais
```

**Criar página:** `src/pages/attendance/AttendancePage.tsx`

**Funcionalidades:**
- ✅ Registro de presença em eventos
- ✅ Registro em massa (marcar todos presentes)
- ✅ Visualização de presenças por evento
- ✅ Histórico de presença por membro
- ✅ Dashboard de estatísticas
- ✅ Relatórios de frequência
- ✅ Status: Presente, Ausente, Atrasado, Justificado

**Complexidade:** 🟡 Média

---

### 4. **FEED/POSTS SOCIAL** 📱
**Status:** ❌ Não implementado  
**Endpoints disponíveis:** 9

```typescript
// API já tem:
- GET /feed - Listar posts
- GET /feed/public - Posts públicos
- GET /feed/:id - Ver post
- POST /feed - Criar post
- PUT /feed/:id - Atualizar post
- DELETE /feed/:id - Deletar post
- GET /feed/event/:eventId/posts - Posts de um evento
- POST /feed/:postId/comments - Adicionar comentário
- POST /feed/:postId/reactions - Adicionar reação
```

**Criar página:** `src/pages/feed/FeedPage.tsx`

**Funcionalidades:**
- ✅ Feed social estilo Facebook
- ✅ Criar posts com texto/imagens
- ✅ Comentários em posts
- ✅ Reações (like, love, etc.)
- ✅ Posts vinculados a eventos
- ✅ Feed público vs privado
- ✅ Timeline de atividades

**Complexidade:** 🔴 Alta

---

### 5. **PROGRESSO DE MEMBROS** 📈
**Status:** ❌ Não implementado  
**Endpoints disponíveis:** 4

```typescript
// API já tem:
- GET /member-progress - Listar progressos
- POST /member-progress - Criar progresso
- GET /member-specialties/member/:memberId - Especialidades do membro
- POST /member-specialties - Criar especialidade
```

**Criar página:** `src/pages/progress/MemberProgressPage.tsx`

**Funcionalidades:**
- ✅ Rastreamento de classes/especialidades
- ✅ Progresso em especialidades
- ✅ Badges e conquistas
- ✅ Histórico de progressão
- ✅ Dashboard de evolução
- ✅ Classes: Amigo, Companheiro, Pesquisador, etc.

**Complexidade:** 🟡 Média

---

### 6. **TAXAS DE ASSOCIAÇÃO** 💰
**Status:** ❌ Não implementado  
**Endpoints disponíveis:** 3

```typescript
// API já tem:
- GET /finance/membership-fees - Listar taxas
- POST /finance/membership-fees/generate - Gerar taxas
- POST /finance/membership-fees/:id/pay - Pagar taxa
```

**Criar seção em:** `src/pages/finance/FinancePage.tsx` ou criar nova página

**Funcionalidades:**
- ✅ Gerar taxas mensais automaticamente
- ✅ Rastrear pagamentos de membros
- ✅ Status: Pago, Pendente, Atrasado
- ✅ Relatórios de inadimplência
- ✅ Histórico de pagamentos
- ✅ Notificações de vencimento

**Complexidade:** 🟡 Média

---

### 7. **GESTÃO DE EMPRÉSTIMOS** 📦
**Status:** ⚠️ Parcialmente implementado  
**Endpoints disponíveis:** 3

```typescript
// API já tem:
- GET /inventory/loans - Listar empréstimos ✅
- POST /inventory/loans - Criar empréstimo ✅
- POST /inventory/loans/:id/return - Devolver item ❌
```

**Melhorar:** `src/pages/inventory/InventoryPage.tsx`

**Funcionalidades faltando:**
- ❌ Interface de devolução de itens
- ❌ Alertas de atraso
- ❌ Histórico de empréstimos por membro
- ❌ Histórico de empréstimos por item
- ❌ Dashboard de empréstimos ativos/atrasados

**Complexidade:** 🟢 Baixa

---

### 8. **MOVIMENTAÇÕES DE INVENTÁRIO** 📊
**Status:** ❌ Não implementado  
**Endpoints disponíveis:** 1

```typescript
// API já tem:
- GET /inventory/movements - Listar movimentações
```

**Criar página:** `src/pages/inventory/MovementsPage.tsx`

**Funcionalidades:**
- ✅ Histórico de entrada/saída de itens
- ✅ Rastreamento de movimentações
- ✅ Auditoria de estoque
- ✅ Filtros por período/item
- ✅ Relatórios de movimentação

**Complexidade:** 🟢 Baixa

---

### 9. **RELATÓRIOS FINANCEIROS** 📈
**Status:** ❌ Não implementado  
**Endpoints disponíveis:** 1

```typescript
// API já tem:
- GET /finance/reports/monthly/:year/:month - Relatório mensal
```

**Criar página:** `src/pages/finance/ReportsPage.tsx`

**Funcionalidades:**
- ✅ Relatório mensal detalhado
- ✅ Gráficos de receita/despesa
- ✅ Comparação entre meses
- ✅ Exportação em PDF/Excel
- ✅ Análise de categorias
- ✅ Projeções financeiras

**Complexidade:** 🟡 Média

---

### 10. **DASHBOARDS** 📊
**Status:** ⚠️ Parcialmente implementado  
**Endpoints disponíveis:** 3

```typescript
// API já tem:
- GET /finance/dashboard - Dashboard financeiro ✅
- GET /inventory/dashboard - Dashboard de inventário ❌
- GET /attendance/statistics/overall - Estatísticas de presença ❌
```

**Melhorias necessárias:**
- ❌ Dashboard de inventário
- ❌ Dashboard de presença
- ❌ Dashboard geral do sistema
- ❌ Widgets personalizáveis

**Complexidade:** 🟡 Média

---

### 11. **GESTÃO DE PARTICIPANTES DE EVENTOS** 👥
**Status:** ⚠️ Preparado mas não implementado  
**Endpoints disponíveis:** 5

```typescript
// API já tem:
- GET /events/:eventId/participants - Listar participantes ✅ (preparado)
- POST /events/:eventId/participants/:memberId - Adicionar ❌
- DELETE /events/:eventId/participants/:memberId - Remover ❌
- GET /events/:eventId/statistics - Estatísticas ❌
- GET /events/member/:memberId - Eventos do membro ❌
```

**Completar em:** `src/pages/events/EventsPage.tsx`

**Funcionalidades faltando:**
- ❌ Adicionar participantes ao evento
- ❌ Remover participantes
- ❌ Ver estatísticas do evento
- ❌ Ver eventos de um membro específico
- ❌ Lista completa de participantes com ações

**Complexidade:** 🟢 Baixa

---

### 12. **CATEGORIAS FINANCEIRAS E CONTAS** 💳
**Status:** ⚠️ Parcialmente implementado  
**Endpoints disponíveis:** 2

```typescript
// API já tem:
- GET /finance/categories - Listar categorias ✅
- GET /finance/accounts - Listar contas ✅
```

**Criar página:** `src/pages/finance/CategoriesPage.tsx`

**Funcionalidades faltando:**
- ❌ CRUD de categorias
- ❌ CRUD de contas bancárias
- ❌ Tipos de categoria (receita/despesa)
- ❌ Orçamentos por categoria
- ❌ Metas financeiras

**Complexidade:** 🟢 Baixa

---

### 13. **CATEGORIAS DE INVENTÁRIO** 📦
**Status:** ⚠️ Parcialmente implementado  
**Endpoints disponíveis:** 1

```typescript
// API já tem:
- GET /inventory/categories - Listar categorias ✅
```

**Criar página:** `src/pages/inventory/CategoriesPage.tsx`

**Funcionalidades faltando:**
- ❌ CRUD de categorias de inventário
- ❌ Organização hierárquica
- ❌ Ícones/cores por categoria
- ❌ Total de itens por categoria

**Complexidade:** 🟢 Baixa

---

## 📋 Resumo de Prioridades

### 🔥 Prioridade ALTA (Implementar primeiro)
1. **Gestão de Presença (Attendance)** - Funcionalidade core do escotismo
2. **Gestão de Unidades** - Organização fundamental
3. **Gestão de Participantes de Eventos** - Completar funcionalidade já iniciada
4. **Taxas de Associação** - Controle financeiro importante

### 🟡 Prioridade MÉDIA (Implementar depois)
5. **Progresso de Membros** - Rastreamento de desenvolvimento
6. **Relatórios Financeiros** - Análise e tomada de decisão
7. **Gestão de Empréstimos** - Completar funcionalidade
8. **Dashboards Adicionais** - Métricas e KPIs

### 🟢 Prioridade BAIXA (Pode esperar)
9. **Feed Social** - Engajamento da comunidade
10. **Gestão de Usuários** - Admin/configuração
11. **Categorias (Finance/Inventory)** - Configuração
12. **Movimentações de Inventário** - Auditoria

---

## 🎯 Roadmap Sugerido

### Sprint 1 (1-2 semanas)
- [ ] Gestão de Unidades (UnitsPage)
- [ ] Completar Gestão de Participantes de Eventos
- [ ] Melhorar Gestão de Empréstimos (devolução)

### Sprint 2 (2-3 semanas)
- [ ] Sistema de Presença (AttendancePage)
- [ ] Dashboard de Presença
- [ ] Relatórios de Frequência

### Sprint 3 (2-3 semanas)
- [ ] Taxas de Associação
- [ ] Relatórios Financeiros
- [ ] Dashboard Financeiro Completo

### Sprint 4 (3-4 semanas)
- [ ] Progresso de Membros (Classes/Especialidades)
- [ ] Dashboard de Progresso
- [ ] Badges e Conquistas

### Sprint 5 (2-3 semanas)
- [ ] Feed Social
- [ ] Posts e Comentários
- [ ] Sistema de Reações

### Sprint 6 (1-2 semanas)
- [ ] Gestão de Usuários
- [ ] Categorias (Finance/Inventory CRUD)
- [ ] Movimentações de Inventário

---

## 💡 Funcionalidades Inovadoras Possíveis

### Análise de Dados
- 📊 Dashboard executivo com métricas chave
- 📈 Gráficos de tendências e projeções
- 🎯 Metas e objetivos por unidade
- 📉 Análise de churn (evasão de membros)

### Automação
- 🤖 Geração automática de taxas mensais
- 📧 Notificações de vencimento
- ⚠️ Alertas de estoque baixo
- 📅 Lembretes de eventos

### Gamificação
- 🏆 Sistema de conquistas
- 🎖️ Badges e medalhas
- 📊 Ranking de participação
- 🌟 Pontuação por atividade

### Mobile-First
- 📱 Check-in por QR Code
- 🔔 Notificações push
- 📷 Upload de fotos de eventos
- 💬 Chat em tempo real

---

## 🛠️ Ferramentas e Bibliotecas Sugeridas

### Para Relatórios
- **react-to-pdf** - Exportação PDF
- **xlsx** - Exportação Excel
- **recharts** - Gráficos avançados

### Para Feed Social
- **react-mentions** - Menções a usuários
- **emoji-picker-react** - Seletor de emojis
- **react-image-crop** - Crop de imagens

### Para Presença
- **react-qr-code** - QR codes
- **html5-qrcode** - Scanner QR
- **date-fns** - Manipulação de datas

### Para Dashboard
- **react-grid-layout** - Widgets arrastavéis
- **recharts** - Gráficos interativos
- **react-countup** - Animação de números

---

## 📝 Conclusão

A API está **muito completa** e oferece **34 endpoints** ainda não utilizados no frontend. Há um grande potencial para expandir o sistema com funcionalidades valiosas.

**Próximo passo recomendado:**  
Começar pela **Gestão de Unidades** e **Sistema de Presença**, que são funcionalidades core para um sistema de gestão escoteira.

---

**Última atualização:** 3 de Outubro de 2025  
**Endpoints totais:** 58  
**Endpoints implementados:** 24 (41%)  
**Endpoints disponíveis:** 34 (59%)
