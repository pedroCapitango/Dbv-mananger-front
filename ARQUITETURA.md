# 🏗️ Arquitetura do Sistema

## Visão Geral

O Sistema de Gestão de Desbravadores foi desenvolvido seguindo as melhores práticas de desenvolvimento frontend moderno, com foco em:

- **Componentização**: Componentes reutilizáveis e isolados
- **Tipagem forte**: TypeScript para segurança e documentação
- **Separação de responsabilidades**: Camadas bem definidas
- **Escalabilidade**: Estrutura preparada para crescimento
- **Acessibilidade**: Suporte a leitores de tela e navegação por teclado
- **Responsividade**: Adaptação para todos os tamanhos de tela

## 📂 Estrutura de Diretórios

### `/src/components`

Contém todos os componentes React organizados por funcionalidade:

#### `/components/auth`
- `LoginScreen.tsx` - Tela de login com validação

#### `/components/dashboard`
- `Dashboard.tsx` - Container principal do dashboard
- `StatCard.tsx` - Cards de estatísticas
- `RevenueChart.tsx` - Gráfico de receitas vs despesas
- `AttendanceChart.tsx` - Gráfico de frequência
- `EventList.tsx` - Lista de eventos próximos
- `TaskList.tsx` - Lista de tarefas pendentes

#### `/components/layout`
- `Sidebar.tsx` - Menu lateral navegável
- `Header.tsx` - Cabeçalho com busca e notificações

#### `/components/ui`
Componentes reutilizáveis:
- `Button.tsx` - Botões com múltiplas variantes
- `Input.tsx` - Input com validação e feedback
- `Card.tsx` - Container de conteúdo
- `Modal.tsx` - Diálogos modais
- `Alert.tsx` - Alertas e notificações
- `LoadingSpinner.tsx` - Indicadores de loading

### `/src/contexts`

Contextos React para gerenciamento de estado global:

- `AuthContext.tsx` - Gerencia autenticação e usuário logado

### `/src/hooks`

Custom hooks para lógica reutilizável:

- `useDashboardData.ts` - Busca e gerencia dados do dashboard
- `useMediaQuery.ts` - Detecta breakpoints responsivos

### `/src/services`

Camada de serviços para comunicação com API:

- `api.ts` - Cliente HTTP centralizado com todas as rotas

### `/src/types`

Definições TypeScript:

- `index.ts` - Tipos e interfaces do sistema

### `/src/utils`

Funções utilitárias:

- `constants.ts` - Constantes e configurações
- `formatters.ts` - Formatação de datas, moedas, etc
- `validators.ts` - Validações de formulários

## 🔄 Fluxo de Dados

```
Componente
    ↓
Custom Hook (opcional)
    ↓
Context (estado global)
    ↓
Service (API)
    ↓
Backend API
```

## 🎯 Padrões de Desenvolvimento

### Componentes

```typescript
// Sempre use React.FC para componentes funcionais
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return <div>{title}</div>;
};
```

### Hooks Customizados

```typescript
// Prefixo "use" para hooks customizados
export const useMyHook = () => {
  const [data, setData] = useState();
  // lógica
  return { data, isLoading, error };
};
```

### Serviços

```typescript
// Métodos assíncronos retornando ApiResponse
async getItems(): Promise<ApiResponse<Item[]>> {
  return this.request('/items');
}
```

## 🔐 Autenticação

### Fluxo de Login

1. Usuário preenche credenciais
2. `LoginScreen` valida campos localmente
3. `AuthContext.login()` é chamado
4. Token JWT é recebido e armazenado
5. `ApiService` usa token em requisições futuras
6. Usuário é redirecionado para dashboard

### Proteção de Rotas

O componente `AppContent` verifica `isAuthenticated` antes de renderizar:

```typescript
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <LoginScreen />;
};
```

## 📊 Visualização de Dados

### Gráficos com Recharts

Usamos Recharts para visualizações:

- **LineChart**: Receitas vs Despesas ao longo do tempo
- **BarChart**: Frequência semanal de participação

Tooltips customizados para melhor UX.

## 🎨 Estilização

### Tailwind CSS

Classes utilitárias para estilização rápida:

```tsx
<div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
```

### Responsividade

Breakpoints Tailwind:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

## ♿ Acessibilidade

### Atributos ARIA

```tsx
<button aria-label="Fechar modal" aria-describedby="modal-desc">
  <X />
</button>
```

### Navegação por Teclado

- Todos os elementos interativos são focáveis
- Outline visível em `:focus-visible`
- Suporte a `Tab`, `Enter`, `Escape`

### Leitores de Tela

- Textos alternativos em imagens
- Labels em inputs
- Roles apropriados (dialog, alert, navigation)

## 🚀 Performance

### Code Splitting

Vite automaticamente divide o código em chunks otimizados.

### Lazy Loading

Componentes pesados podem ser carregados sob demanda:

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Memoization

Use `React.memo()` para componentes que não precisam re-renderizar:

```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  // render
});
```

## 🧪 Testes (Futuro)

### Estrutura de Testes

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── Button.stories.tsx
```

### Tipos de Testes

- **Unit**: Funções utilitárias e hooks
- **Integration**: Componentes com contextos
- **E2E**: Fluxos completos (Cypress/Playwright)

## 📦 Build e Deploy

### Build de Produção

```bash
pnpm build
```

Gera bundle otimizado em `/dist`:
- Minificação
- Tree shaking
- Asset optimization

### Deploy

Compatível com:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Docker

## 🔧 Manutenção

### Adicionando um Novo Módulo

1. Criar componentes em `/components/[modulo]/`
2. Adicionar tipos em `/types/`
3. Criar hooks se necessário em `/hooks/`
4. Adicionar endpoints em `/services/api.ts`
5. Integrar no `Dashboard.tsx`

### Convenções de Nomenclatura

- **Componentes**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useMyHook.ts`)
- **Utilitários**: camelCase (`formatDate.ts`)
- **Tipos**: PascalCase (`MyType.ts`)
- **Constantes**: UPPER_SNAKE_CASE ou camelCase

## 📚 Recursos Adicionais

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org)
- [Vite Docs](https://vitejs.dev)
