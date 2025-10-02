# 💡 Dicas e Boas Práticas

## 🎯 Desenvolvimento Eficiente

### VS Code - Extensões Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-import",
    "eamodio.gitlens",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Atalhos Úteis

- `Ctrl + P` - Buscar arquivo
- `Ctrl + Shift + F` - Buscar no projeto
- `Ctrl + D` - Selecionar próxima ocorrência
- `Alt + Up/Down` - Mover linha
- `Ctrl + /` - Comentar linha
- `F2` - Renomear símbolo

## 🚀 Performance

### 1. Lazy Loading de Componentes

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 2. Memoização

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoizar componente
export const MyComponent = memo(({ data }) => {
  return <div>{data}</div>;
});

// Memoizar valor calculado
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// Memoizar função
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 3. Debounce em Busca

```typescript
import { useState, useEffect } from 'react';

export const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      // Fazer busca aqui
      console.log('Buscando:', debouncedTerm);
    }
  }, [debouncedTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar..."
    />
  );
};
```

## 🎨 Tailwind - Truques

### 1. Classes Condicionais

```typescript
const buttonClasses = `
  px-4 py-2 rounded-lg transition
  ${variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200'}
  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
`;
```

### 2. Biblioteca clsx

```bash
pnpm add clsx
```

```typescript
import clsx from 'clsx';

const classes = clsx({
  'bg-blue-600': variant === 'primary',
  'bg-red-600': variant === 'danger',
  'opacity-50': isDisabled,
  'hover:shadow-md': !isDisabled,
});
```

### 3. Componentes Condicionais

```typescript
<div className={`
  flex items-center gap-2
  ${isMobile ? 'flex-col' : 'flex-row'}
  ${isLoading && 'opacity-50 pointer-events-none'}
`}>
```

## 🔒 Segurança

### 1. XSS Protection

```typescript
// ❌ NUNCA faça isso
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Use sanitização
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

### 2. Token Storage

```typescript
// ✅ Bom para desenvolvimento
localStorage.setItem('token', token);

// ✅✅ Melhor para produção (httpOnly cookies)
// Configurar no backend para enviar cookies httpOnly
```

### 3. Validação de Inputs

```typescript
// Sempre valide no frontend E backend
const validateInput = (value: string) => {
  // Remove caracteres perigosos
  return value.replace(/[<>]/g, '');
};
```

## 📊 Estado Global

### Quando usar Context vs Props

**Use Props quando:**
- Apenas 2-3 níveis de componentes
- Dados específicos de um fluxo
- Props drilling não é excessivo

**Use Context quando:**
- Dados usados em muitos lugares
- Theme/Auth/User data
- Mais de 3 níveis de profundidade

### Exemplo de Context Otimizado

```typescript
// Separe contexts para evitar re-renders desnecessários
const UserContext = createContext();
const ThemeContext = createContext();

// Ao invés de um único:
const AppContext = createContext();
```

## 🧪 Debug

### 1. React DevTools

```typescript
// Adicione display name para facilitar debug
MyComponent.displayName = 'MyComponent';
```

### 2. Console.log estratégico

```typescript
// Use grupos
console.group('User Data');
console.log('Name:', user.name);
console.log('Email:', user.email);
console.groupEnd();

// Use tabelas
console.table(arrayOfObjects);

// Use cores
console.log('%c Sucesso!', 'color: green; font-weight: bold');
console.log('%c Erro!', 'color: red; font-weight: bold');
```

### 3. Error Boundary

```typescript
import React from 'react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado.</h1>;
    }

    return this.props.children;
  }
}

// Uso
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## 📱 Mobile First

### 1. Design Mobile First

```typescript
// ❌ Desktop primeiro
<div className="w-full md:w-1/2">

// ✅ Mobile primeiro
<div className="w-full md:w-1/2 lg:w-1/3">
```

### 2. Touch Targets

```typescript
// Mínimo 44x44px para touch
<button className="min-w-[44px] min-h-[44px]">
```

### 3. Gestos Mobile

```typescript
const [touchStart, setTouchStart] = useState(0);
const [touchEnd, setTouchEnd] = useState(0);

const handleTouchStart = (e) => {
  setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchEnd = (e) => {
  setTouchEnd(e.changedTouches[0].clientX);
  
  if (touchStart - touchEnd > 150) {
    // Swipe left
  }
  
  if (touchEnd - touchStart > 150) {
    // Swipe right
  }
};
```

## ♿ Acessibilidade

### 1. Checklist Básico

- [ ] Todas as imagens têm `alt`
- [ ] Botões têm `aria-label` quando necessário
- [ ] Formulários têm `label` associados
- [ ] Navegação por teclado funciona
- [ ] Contraste de cores adequado
- [ ] Focus visível em elementos

### 2. ARIA Labels

```typescript
<button aria-label="Fechar modal">
  <X />
</button>

<div role="alert" aria-live="polite">
  {errorMessage}
</div>

<nav aria-label="Menu principal">
  {/* itens do menu */}
</nav>
```

### 3. Keyboard Navigation

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
  
  if (e.key === 'Escape') {
    handleClose();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
```

## 🎨 CSS Tricks

### 1. Truncate Text

```typescript
<p className="truncate max-w-xs">
  Texto muito longo que será cortado...
</p>

// Múltiplas linhas
<p className="line-clamp-3">
  Texto que será limitado a 3 linhas...
</p>
```

### 2. Aspect Ratio

```typescript
<div className="aspect-video">
  {/* 16:9 */}
</div>

<div className="aspect-square">
  {/* 1:1 */}
</div>
```

### 3. Grid Auto-fit

```typescript
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  {/* Colunas se ajustam automaticamente */}
</div>
```

## 🔄 Formulários

### 1. React Hook Form (recomendado)

```bash
pnpm add react-hook-form
```

```typescript
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors } } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email', { required: true })} />
  {errors.email && <span>Campo obrigatório</span>}
</form>
```

### 2. Validação Assíncrona

```typescript
const validateEmail = async (email: string) => {
  const response = await fetch(`/api/check-email/${email}`);
  const exists = await response.json();
  return !exists || 'Email já cadastrado';
};
```

## 📦 Code Splitting

### 1. Por Rota

```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Members = lazy(() => import('./pages/Members'));
const Events = lazy(() => import('./pages/Events'));
```

### 2. Por Feature

```typescript
const HeavyChart = lazy(() => import('./components/HeavyChart'));

<Suspense fallback={<ChartSkeleton />}>
  {showChart && <HeavyChart data={data} />}
</Suspense>
```

## 🚦 Loading States

### 1. Skeleton Loading

```typescript
export const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);
```

### 2. Suspense Boundaries

```typescript
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/members" element={<Members />} />
  </Routes>
</Suspense>
```

## 💾 Cache e Persistência

### 1. LocalStorage Hook

```typescript
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
```

### 2. React Query (recomendado)

```bash
pnpm add @tanstack/react-query
```

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['members'],
  queryFn: () => apiService.getMembers(),
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

## 🎯 Conclusão

Estas dicas vão te ajudar a:
- Escrever código mais limpo
- Melhorar performance
- Aumentar acessibilidade
- Facilitar manutenção
- Evitar bugs comuns

**Pratique e evolua! 🚀**
