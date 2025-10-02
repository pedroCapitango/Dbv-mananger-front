import React, { useState } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { TransactionResponseDto, CreateTransactionDto } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';

const transactionFormFields: FormField[] = [
  { 
    name: 'type', 
    label: 'Tipo', 
    type: 'select', 
    required: true,
    options: [
      { value: 'income', label: 'Receita' },
      { value: 'expense', label: 'Despesa' }
    ]
  },
  { name: 'amount', label: 'Valor', type: 'number', required: true, placeholder: '1000' },
  { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descrição da transação...', rows: 3 },
  { name: 'categoryId', label: 'Categoria', type: 'text', required: true, placeholder: 'ID da categoria' },
  { name: 'accountId', label: 'Conta', type: 'text', required: true, placeholder: 'ID da conta' },
  { name: 'date', label: 'Data', type: 'date', required: true },
  { name: 'paymentMethod', label: 'Método de Pagamento', type: 'text', placeholder: 'Dinheiro, Cartão, etc.' },
  { name: 'reference', label: 'Referência', type: 'text', placeholder: 'Número do documento' },
];

export const FinancePage: React.FC = () => {
  const { transactions, dashboard, isLoading, error, createTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponseDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredTransactions = transactions.filter(t =>
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'date', 
      label: 'Data', 
      render: (t: TransactionResponseDto) => formatDate(t.date) 
    },
    { 
      key: 'description', 
      label: 'Descrição',
      render: (t: TransactionResponseDto) => (
        <div>
          <div className="font-medium text-gray-900">{t.description || 'Sem descrição'}</div>
        </div>
      )
    },
    { 
      key: 'type', 
      label: 'Tipo',
      render: (t: TransactionResponseDto) => {
        const bgClass = t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgClass}`}>
            {t.type === 'income' ? 'Receita' : 'Despesa'}
          </span>
        );
      }
    },
    { 
      key: 'amount', 
      label: 'Valor',
      render: (t: TransactionResponseDto) => (
        <span className={t.type === 'income' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
          {formatCurrency(t.amount)}
        </span>
      )
    },
  ];

  const handleCreate = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      await createTransaction(data as CreateTransactionDto);
      setActionSuccess('Transação criada com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleEdit = async (data: Record<string, any>) => {
    if (!selectedTransaction) return;
    try {
      setActionError(null);
      await updateTransaction(selectedTransaction.id, data as CreateTransactionDto);
      setActionSuccess('Transação atualizada com sucesso!');
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (transaction: TransactionResponseDto) => {
    if (!window.confirm('Deseja realmente deletar esta transação?')) return;
    
    try {
      setActionError(null);
      await deleteTransaction(transaction.id);
      setActionSuccess('Transação deletada com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const openEditModal = (transaction: TransactionResponseDto) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando finanças...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Finanças</h1>
        <p className="text-gray-600">Gerencie todas as transações financeiras do clube</p>
      </div>

      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboard.totalIncome || 0)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Despesa Total</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(dashboard.totalExpenses || 0)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${(dashboard.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dashboard.balance || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {actionSuccess && <Alert type="success">{actionSuccess}</Alert>}
      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Nova Transação
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          data={filteredTransactions}
          columns={columns}
          onEdit={openEditModal}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </Card>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nova Transação"
      >
        <Form
          fields={transactionFormFields}
          onSubmit={handleCreate}
          submitLabel="Criar Transação"
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
        }}
        title="Editar Transação"
      >
        {selectedTransaction && (
          <Form
            fields={transactionFormFields}
            onSubmit={handleEdit}
            submitLabel="Salvar Alterações"
            initialValues={selectedTransaction}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedTransaction(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
