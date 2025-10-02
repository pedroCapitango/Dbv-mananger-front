# 📖 Guia de Uso Rápido

## 🚀 Início Rápido

### Primeiro uso

```bash
# Instale as dependências
pnpm install

# Configure o ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
pnpm dev
```

Acesse: http://localhost:5173

### Login de Teste

Como o backend ainda não está integrado, o sistema aceita qualquer email/senha no momento. Para simular um login real, você pode usar:

- **Email**: admin@desbravadores.com
- **Senha**: qualquer coisa

## 🧩 Componentes Principais

### 1. Autenticação

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Fazer login
  await login('email@example.com', 'senha');
  
  // Fazer logout
  logout();
  
  // Verificar se está autenticado
  if (isAuthenticated) {
    // usuário logado
  }
}
```

### 2. Componentes UI

```typescript
import { Button, Input, Card, Modal, Alert } from './components/ui';

// Botão
<Button variant="primary" onClick={handleClick}>
  Clique aqui
</Button>

// Input com validação
<Input
  label="Email"
  type="email"
  error={errors.email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Card
<Card hover>
  <h3>Conteúdo</h3>
</Card>

// Modal
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Título">
  Conteúdo do modal
</Modal>

// Alert
<Alert type="error" message="Erro ao salvar" />
```

### 3. Dashboard Data

```typescript
import { useDashboardData } from './hooks/useDashboardData';

function Dashboard() {
  const { stats, revenueData, isLoading, error } = useDashboardData();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  
  return <div>{/* usar dados */}</div>;
}
```

### 4. Responsividade

```typescript
import { useIsMobile, useIsTablet } from './hooks/useMediaQuery';

function MyComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  return (
    <div className={isMobile ? 'p-2' : 'p-6'}>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

## 🎨 Estilização com Tailwind

### Classes Comuns

```tsx
// Layout
<div className="flex flex-col gap-4">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Espaçamento
<div className="p-4 m-2">     // padding e margin
<div className="px-6 py-4">   // padding horizontal e vertical

// Cores
<div className="bg-blue-600 text-white">
<div className="bg-gray-50 text-gray-900">

// Bordas e sombras
<div className="rounded-lg shadow-sm">
<div className="border border-gray-200">

// Hover e transições
<div className="hover:bg-gray-100 transition">
<button className="hover:shadow-md transition duration-200">

// Responsividade
<div className="hidden md:block">        // esconde no mobile
<div className="text-sm md:text-base">  // texto responsivo
```

## 🔌 Integração com API

### Adicionar novo endpoint

1. Abra `/src/services/api.ts`
2. Adicione o método:

```typescript
async getMyData() {
  return this.request<MyType>('/my-endpoint');
}

async createMyData(data: MyType) {
  return this.request<MyType>('/my-endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

3. Use no componente:

```typescript
import { apiService } from './services/api';

const response = await apiService.getMyData();
```

## 📝 Criar Novo Módulo

### Exemplo: Módulo de "Relatórios"

1. **Criar tipo** em `/src/types/index.ts`:

```typescript
export interface Report {
  id: string;
  title: string;
  date: string;
  data: any;
}
```

2. **Criar componentes** em `/src/components/reports/`:

```typescript
// ReportList.tsx
export const ReportList: React.FC = () => {
  return <div>Lista de relatórios</div>;
};
```

3. **Adicionar ao menu** em `/src/components/layout/Sidebar.tsx`:

```typescript
import { FileText } from 'lucide-react';

const menuItems = [
  // ... itens existentes
  { id: 'reports', icon: FileText, label: 'Relatórios' },
];
```

4. **Adicionar rota** em `/src/components/dashboard/Dashboard.tsx`:

```typescript
import { ReportList } from '../reports/ReportList';

// No switch/if de views
if (currentView === 'reports') {
  return <ReportList />;
}
```

## 🐛 Debug

### Verificar estado da autenticação

```typescript
const { user, isAuthenticated, isLoading } = useAuth();
console.log({ user, isAuthenticated, isLoading });
```

### Verificar requisições API

Todas as requisições passam por `ApiService`. Adicione logs:

```typescript
// src/services/api.ts
console.log('Request:', endpoint, options);
console.log('Response:', data);
```

### DevTools

- **React DevTools**: Inspecione componentes e estado
- **Network Tab**: Veja requisições HTTP
- **Console**: Erros e warnings

## 📦 Builds

### Desenvolvimento

```bash
pnpm dev
```

### Produção

```bash
# Build
pnpm build

# Preview do build
pnpm preview
```

### Lint

```bash
pnpm lint
```

## 🎯 Próximos Passos Recomendados

1. **Integrar com Backend Real**
   - Atualizar `.env` com URL da API
   - Remover dados mockados dos hooks
   - Testar fluxo de autenticação real

2. **Implementar Módulos**
   - Membros (CRUD completo)
   - Eventos (criar, editar, excluir)
   - Finanças (transações)
   - Inventário (controle de estoque)

3. **Melhorias**
   - Adicionar testes
   - Implementar filtros e busca
   - Adicionar paginação
   - Melhorar feedback visual

4. **Deploy**
   - Configurar CI/CD
   - Deploy em Vercel/Netlify
   - Monitoramento de erros

## 💡 Dicas

- Use `Ctrl+P` para buscar arquivos rapidamente
- Use `Ctrl+Shift+F` para buscar no projeto inteiro
- Instale extensões recomendadas do VS Code:
  - ESLint
  - Tailwind CSS IntelliSense
  - Auto Import
  - GitLens

## 🆘 Problemas Comuns

### Erro: Module not found

```bash
# Reinstale as dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro de TypeScript

```bash
# Limpe o cache do TypeScript
rm -rf node_modules/.vite
pnpm dev
```

### Tailwind não funciona

Verifique se:
1. `tailwind.config.js` existe
2. `postcss.config.js` existe
3. `index.css` importa as diretivas do Tailwind
4. O arquivo é importado no `main.tsx`

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação em `ARQUITETURA.md`
2. Verifique os tipos em `src/types/index.ts`
3. Veja exemplos nos componentes existentes
4. Abra uma issue no GitHub

---

**Bom desenvolvimento! 🚀**
