import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useFinance } from '../../../hooks/useFinance';
import { useMembers } from '../../../hooks/useMembers';
import { Plus, ArrowUpCircle, ArrowDownCircle, Filter, Trash2, Edit2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import type { CreateTransactionDto } from '../../../types';

export const FinanceTransactions: React.FC = () => {
  const { transactions, categories, accounts, isLoading, error, createTransaction, updateTransaction, deleteTransaction, refetch } = useFinance();
  const { members } = useMembers();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<CreateTransactionDto>({
    type: 'income',
    amount: 0,
    description: '',
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    reference: '',
    memberId: '',
    eventId: '',
  });

  const resetForm = () => {
    setForm({
      type: 'income',
      amount: 0,
      description: '',
      categoryId: '',
      accountId: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      reference: '',
      memberId: '',
      eventId: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...form,
        date: new Date(form.date).toISOString(),
        memberId: form.memberId || undefined,
        eventId: form.eventId || undefined,
        paymentMethod: form.paymentMethod || undefined,
        reference: form.reference || undefined,
      };

      if (editingId) {
        await updateTransaction(editingId, data);
        setSuccessMessage('Transação atualizada com sucesso!');
      } else {
        await createTransaction(data);
        setSuccessMessage('Transação criada com sucesso!');
      }

      setShowModal(false);
      resetForm();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar transação:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (transaction: any) => {
    setForm({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description || '',
      categoryId: transaction.categoryId,
      accountId: transaction.accountId,
      date: new Date(transaction.date).toISOString().split('T')[0],
      paymentMethod: transaction.paymentMethod || '',
      reference: transaction.reference || '',
      memberId: transaction.memberId || '',
      eventId: transaction.eventId || '',
    });
    setEditingId(transaction.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;
    
    try {
      await deleteTransaction(id);
      setSuccessMessage('Transação excluída com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao excluir transação:', err);
    }
  };

  const filteredTransactions = filterType === 'ALL'
    ? transactions
    : transactions.filter(t => t.type === filterType);

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const availableCategories = form.type === 'income' ? incomeCategories : expenseCategories;

  const stats = {
    income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    expense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
  };

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.income)}</p>
            </div>
            <ArrowUpCircle className="text-green-500" size={32} />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.expense)}</p>
            </div>
            <ArrowDownCircle className="text-red-500" size={32} />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${stats.income - stats.expense >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(stats.income - stats.expense)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold">Transações</h3>
          
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={16} className="mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todas</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Nenhuma transação encontrada
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{formatDate(transaction.date)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{transaction.description}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{transaction.category?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{transaction.account?.name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'income' ? (
                          <><ArrowUpCircle size={14} /> Receita</>
                        ) : (
                          <><ArrowDownCircle size={14} /> Despesa</>
                        )}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingId ? 'Editar Transação' : 'Nova Transação'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'income', categoryId: '' })}
                className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${
                  form.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <ArrowUpCircle size={20} />
                Receita
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'expense', categoryId: '' })}
                className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${
                  form.type === 'expense'
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
            label="Valor *"
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
            required
          />

          <Input
            label="Descrição *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conta *
            </label>
            <select
              value={form.accountId}
              onChange={(e) => setForm({ ...form, accountId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione uma conta</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} - {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Data *"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          <Input
            label="Método de Pagamento"
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            placeholder="Ex: Dinheiro, Transferência, Pix"
          />

          <Input
            label="Referência"
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            placeholder="Ex: Número do recibo"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setShowModal(false); resetForm(); }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
