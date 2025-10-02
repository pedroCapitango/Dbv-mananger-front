# 💼 Exemplos de Uso

Este arquivo contém exemplos práticos de como usar os componentes e funcionalidades do sistema.

## 📋 Índice

1. [Formulários](#formulários)
2. [Listagens](#listagens)
3. [Modais](#modais)
4. [Notificações](#notificações)
5. [Gráficos](#gráficos)
6. [API Calls](#api-calls)

---

## Formulários

### Formulário de Cadastro Completo

```typescript
import React, { useState } from 'react';
import { Input, Button, Alert } from '../components/ui';
import { validateEmail, validateRequired } from '../utils/validators';

export const MemberForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa o erro ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // await apiService.createMember(formData);
      setSuccessMessage('Membro cadastrado com sucesso!');
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      setErrors({ form: 'Erro ao cadastrar membro' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {successMessage && (
        <Alert type="success" message={successMessage} />
      )}
      
      {errors.form && (
        <Alert type="error" message={errors.form} />
      )}

      <Input
        label="Nome completo"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        required
      />

      <Input
        label="Telefone"
        type="tel"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
      >
        Cadastrar
      </Button>
    </form>
  );
};
```

---

## Listagens

### Lista com Paginação e Filtros

```typescript
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, LoadingSpinner } from '../components/ui';
import { Search } from 'lucide-react';

interface ListItem {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export const MemberList: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, items]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      // const response = await apiService.getMembers();
      // setItems(response.data);
      setItems([
        { id: '1', name: 'João Silva', email: 'joao@email.com', status: 'active' },
        { id: '2', name: 'Maria Santos', email: 'maria@email.com', status: 'active' },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="space-y-4">
      {/* Busca */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button variant="primary">
          Adicionar Novo
        </Button>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {paginatedItems.map((item) => (
          <Card key={item.id} hover className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {item.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
              <Button variant="ghost" size="small">
                Editar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="small"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Anterior
          </Button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="secondary"
            size="small"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
};
```

---

## Modais

### Modal de Confirmação

```typescript
import React, { useState } from 'react';
import { Modal, Button } from '../components/ui';
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // await apiService.deleteMember(id);
      setIsOpen(false);
      // mostrar notificação de sucesso
    } catch (error) {
      // mostrar erro
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Excluir
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="small">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirmar Exclusão
          </h3>
          <p className="text-gray-600 mb-6">
            Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Confirmar Exclusão
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
```

### Modal de Formulário

```typescript
import React, { useState } from 'react';
import { Modal, Button, Input } from '../components/ui';

export const EditModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSave = async () => {
    // salvar dados
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Editar</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Editar Informações"
        size="medium"
      >
        <div className="space-y-4">
          <Input
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
```

---

## Notificações

### Sistema de Notificações Toast

```typescript
import React, { useState } from 'react';
import { Alert } from '../components/ui';

export const ToastExample: React.FC = () => {
  const [toasts, setToasts] = useState<Array<{
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>>([]);

  const addToast = (type: any, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto remover após 5 segundos
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  return (
    <div>
      {/* Botões de teste */}
      <div className="flex gap-2 mb-4">
        <Button onClick={() => addToast('success', 'Operação realizada com sucesso!')}>
          Sucesso
        </Button>
        <Button onClick={() => addToast('error', 'Erro ao realizar operação')}>
          Erro
        </Button>
        <Button onClick={() => addToast('warning', 'Atenção: Verifique os dados')}>
          Aviso
        </Button>
        <Button onClick={() => addToast('info', 'Informação importante')}>
          Info
        </Button>
      </div>

      {/* Container de Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map(toast => (
          <Alert
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## Gráficos

### Gráfico Customizado

```typescript
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../components/ui';

const data = [
  { month: 'Jan', members: 230, events: 12 },
  { month: 'Fev', members: 245, events: 15 },
  { month: 'Mar', members: 248, events: 18 },
];

export const CustomChart: React.FC = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Crescimento Mensal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="members"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Membros"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="events"
            stroke="#10b981"
            strokeWidth={2}
            name="Eventos"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
```

---

## API Calls

### Hook Customizado para Fetch

```typescript
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useFetch = <T,>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const response = await apiService.request(endpoint);
      // setData(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [endpoint]);

  return { data, isLoading, error, refetch };
};

// Uso
const MyComponent = () => {
  const { data, isLoading, error, refetch } = useFetch<Member[]>('/members');
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  
  return <div>{/* usar data */}</div>;
};
```

---

Esses exemplos cobrem os casos de uso mais comuns. Adapte conforme necessário para seu projeto específico!
