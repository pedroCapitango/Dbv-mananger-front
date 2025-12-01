import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useFinance } from '../../../hooks/useFinance';
import { apiService } from '../../../services/api';
import { ACCOUNT_TYPES } from '../../../utils/enums';
import { Plus, Wallet, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

interface AccountForm {
  name: string;
  type: string;
  description: string;
}

export const FinanceAccounts: React.FC = () => {
  const { accounts, isLoading, error, refetch } = useFinance();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<AccountForm>({
    name: '',
    type: ACCOUNT_TYPES.CASH,
    description: '',
  });

  const accountTypes = [
    { value: ACCOUNT_TYPES.CASH, label: 'Caixa (Dinheiro)', icon: Wallet },
    { value: ACCOUNT_TYPES.BANK, label: 'Conta Bancária', icon: DollarSign },
    { value: ACCOUNT_TYPES.CREDIT_CARD, label: 'Cartão de Crédito', icon: TrendingUp },
  ];

  const resetForm = () => {
    setForm({
      name: '',
      type: ACCOUNT_TYPES.CASH,
      description: '',
    });
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {      
      await apiService.createAccount({
        name: form.name,
        type: form.type,
        description: form.description || undefined,
      });
      setSuccessMessage('Conta criada com sucesso!');
      setShowCreateModal(false);
      resetForm();
      await refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao criar conta:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDefaultAccounts = async () => {
    setIsSubmitting(true);
    try {
      // Criar Caixa do Clube
      await apiService.createAccount({
        name: 'Caixa do Clube',
        type: ACCOUNT_TYPES.CASH,
        description: 'Caixa principal do clube de desbravadores',
      });


      // Criar conta Tesoureiro
      await apiService.createAccount({
        name: 'Tesoureiro da Igreja',
        type: ACCOUNT_TYPES.BANK,
        description: 'Conta bancária para transferências ao tesoureiro da igreja',
      });

      setSuccessMessage('Contas padrão criadas com sucesso!');
      await refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao criar contas padrão:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

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

      {/* Summary Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Saldo Total</h3>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalBalance)}</p>
          </div>
          <DollarSign size={48} className="text-blue-500 opacity-20" />
        </div>
        <p className="text-sm text-gray-600">
          {accounts.length} {accounts.length === 1 ? 'conta' : 'contas'} cadastradas
        </p>
      </Card>

      {/* Empty State */}
      {accounts.length === 0 && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="text-center py-8">
            <Wallet size={64} className="mx-auto text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Nenhuma conta cadastrada
            </h3>
            <p className="text-sm text-blue-800 mb-6">
              Crie contas para gerenciar as finanças do clube. Comece com as contas padrão:
              <br />
              <strong>Caixa do Clube</strong> e <strong>Tesoureiro da Igreja</strong>
            </p>
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleCreateDefaultAccounts}
                disabled={isSubmitting}
              >
                <Plus size={16} className="mr-2" />
                {isSubmitting ? 'Criando...' : 'Criar Contas Padrão'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={16} className="mr-2" />
                Criar Conta Personalizada
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Accounts List */}
      {accounts.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Contas Financeiras</h3>
            <Button onClick={() => setShowCreateModal(true)} size="small">
              <Plus size={16} className="mr-2" />
              Nova Conta
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => {
              const accountType = accountTypes.find((t) => t.value === account.type);
              const Icon = accountType?.icon || Wallet;
              const isPositive = account.balance >= 0;

              return (
                <Card
                  key={account.id}
                  className={`p-4 border-2 ${
                    isPositive ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Icon size={20} className={isPositive ? 'text-green-600' : 'text-red-600'} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{account.name}</h4>
                        <p className="text-xs text-gray-600">{accountType?.label || account.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Saldo</p>
                    <p
                      className={`text-2xl font-bold ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(account.balance)}
                    </p>
                  </div>

                  {account.description && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {account.description}
                    </p>
                  )}

                  {/* Actions disabled for now - can be implemented later */}
                  {/* <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={Edit2}>
                      Editar
                    </Button>
                  </div> */}
                </Card>
              );
            })}
          </div>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Nova Conta"
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <Input
            label="Nome da Conta *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Caixa do Clube"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Conta *
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              {accountTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Descrição opcional da conta..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Conta'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
