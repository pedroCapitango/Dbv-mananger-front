import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useFinance } from '../../../hooks/useFinance';
import { apiService } from '../../../services/api';
import { Plus, ArrowUpCircle, ArrowDownCircle, Tag } from 'lucide-react';

export const FinanceCategories: React.FC = () => {
  const { categories, isLoading, error, refetch } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    description: '',
  });

  const resetForm = () => {
    setForm({
      name: '',
      type: 'INCOME',
      description: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiService.createCategory({
        name: form.name,
        type: form.type,
        description: form.description || undefined,
      });
      setSuccessMessage('Categoria criada com sucesso!');
      setShowModal(false);
      resetForm();
      await refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao criar categoria:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar categorias - backend pode retornar em maiúsculas ou minúsculas
  const incomeCategories = categories.filter(c => 
    c.type?.toLowerCase() === 'income'
  );
  const expenseCategories = categories.filter(c => 
    c.type?.toLowerCase() === 'expense'
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="large" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && <Alert type="success" message={successMessage} />}
      {error && <Alert type="error" message={error} />}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias de Receita</p>
              <p className="text-2xl font-bold text-green-600">{incomeCategories.length}</p>
            </div>
            <ArrowUpCircle className="text-green-500" size={32} />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias de Despesa</p>
              <p className="text-2xl font-bold text-red-600">{expenseCategories.length}</p>
            </div>
            <ArrowDownCircle className="text-red-500" size={32} />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Categorias</h3>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} className="mr-2" />
            Nova Categoria
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Receitas */}
          <div>
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <ArrowUpCircle size={20} />
              Receitas
            </h4>
            <div className="space-y-2">
              {incomeCategories.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma categoria de receita</p>
              ) : (
                incomeCategories.map((cat) => (
                  <Card key={cat.id} className="p-3 bg-green-50 border-green-200">
                    <div className="flex items-start gap-2">
                      <Tag size={16} className="text-green-600 mt-1" />
                      <div>
                        <p className="font-medium text-green-900">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-green-700 mt-1">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Despesas */}
          <div>
            <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
              <ArrowDownCircle size={20} />
              Despesas
            </h4>
            <div className="space-y-2">
              {expenseCategories.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma categoria de despesa</p>
              ) : (
                expenseCategories.map((cat) => (
                  <Card key={cat.id} className="p-3 bg-red-50 border-red-200">
                    <div className="flex items-start gap-2">
                      <Tag size={16} className="text-red-600 mt-1" />
                      <div>
                        <p className="font-medium text-red-900">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-red-700 mt-1">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title="Nova Categoria"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'INCOME' })}
                className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${
                  form.type === 'INCOME'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <ArrowUpCircle size={20} />
                Receita
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'EXPENSE' })}
                className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${
                  form.type === 'EXPENSE'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-red-300'
                }`}
              >
                <ArrowDownCircle size={20} />
                Despesa
              </button>
            </div>
          </div>

          <Input
            label="Nome *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Doações, Eventos, Aluguel"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Descrição opcional da categoria..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setShowModal(false); resetForm(); }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
