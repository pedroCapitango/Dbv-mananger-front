import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useFees } from '../../../hooks/useFees';
import { useMembers } from '../../../hooks/useMembers';
import { useFinance } from '../../../hooks/useFinance';
import { useUnits } from '../../../hooks/useUnits';
import { apiService } from '../../../services/api';
import { ACCOUNT_TYPES } from '../../../utils/enums';
import { Plus, DollarSign, CheckCircle, XCircle, Clock, Filter, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import type { 
  FeeResponseDto, 
  CreateFeeDto, 
  GenerateFeesDto,
  PayFeeDto 
} from '../../../types';

export const FinanceFees: React.FC = () => {
  const { fees, isLoading, error: feesError, createFee, generateFees, payFee, cancelFee } = useFees();
  const { members } = useMembers();
  const { accounts, refetch: refetchFinance } = useFinance();
  const { units } = useUnits();
  const [isCreatingAccounts, setIsCreatingAccounts] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeResponseDto | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateFeeDto>({
    memberId: '',
    amount: 50,
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    notes: '',
  });

  const [generateForm, setGenerateForm] = useState<GenerateFeesDto>({
    amount: 50,
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    unitId: '',
    notes: '',
  });

  const [payForm, setPayForm] = useState<PayFeeDto>({
    accountId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFee({
        ...createForm,
        dueDate: new Date(createForm.dueDate).toISOString(),
      });
      setSuccessMessage('Cota criada com sucesso!');
      setShowCreateModal(false);
      setCreateForm({
        memberId: '',
        amount: 50,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        notes: '',
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao criar cota:', err);
    }
  };

  const handleGenerateFees = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await generateFees({
        ...generateForm,
        dueDate: new Date(generateForm.dueDate).toISOString(),
        unitId: generateForm.unitId || undefined,
      });
      setSuccessMessage(`${result.created} cotas geradas com sucesso!`);
      setShowGenerateModal(false);
      setGenerateForm({
        amount: 50,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        unitId: '',
        notes: '',
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao gerar cotas:', err);
    }
  };

  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee || !payForm.paymentDate) return;

    try {
      await payFee(selectedFee.id, {
        ...payForm,
        paymentDate: new Date(payForm.paymentDate).toISOString(),
      });
      setSuccessMessage('Pagamento registrado com sucesso!');
      setShowPayModal(false);
      setSelectedFee(null);
      setPayForm({
        accountId: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao registrar pagamento:', err);
    }
  };

  const handleCancelFee = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta cota?')) return;
    
    try {
      await cancelFee(id);
      setSuccessMessage('Cota cancelada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao cancelar cota:', err);
    }
  };

  const createDefaultAccounts = async () => {
    setIsCreatingAccounts(true);
    try {
      // Criar conta Caixa do Clube
      await apiService.createAccount({
        name: 'Caixa do Clube',
        type: ACCOUNT_TYPES.CASH,
        description: 'Caixa principal do clube de desbravadores',
      });

      // Criar conta Tesoureiro da Igreja
      await apiService.createAccount({
        name: 'Tesoureiro da Igreja',
        type: ACCOUNT_TYPES.BANK,
        description: 'Conta bancária para transferências ao tesoureiro da igreja',
      });

      setSuccessMessage('Contas padrão criadas com sucesso!');
      await refetchFinance();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao criar contas padrão:', err);
      setError(err.message || 'Erro ao criar contas padrão');
    } finally {
      setIsCreatingAccounts(false);
    }
  };

  const openPayModal = (fee: FeeResponseDto) => {
    setSelectedFee(fee);
    setPayForm({
      accountId: accounts[0]?.id || '',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowPayModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      PAID: { label: 'Pago', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      OVERDUE: { label: 'Atrasado', color: 'bg-red-100 text-red-800', icon: XCircle },
      CANCELLED: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: XCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.PENDING;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  const filteredFees = filterStatus === 'ALL' 
    ? fees 
    : fees.filter(fee => fee.status === filterStatus);

  const stats = {
    total: fees.length,
    pending: fees.filter(f => f.status === 'PENDING').length,
    paid: fees.filter(f => f.status === 'PAID').length,
    overdue: fees.filter(f => f.status === 'OVERDUE').length,
    totalAmount: fees.reduce((sum, f) => sum + f.amount, 0),
    paidAmount: fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0),
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
      {successMessage && (
        <Alert type="success" message={successMessage} />
      )}
      
      {(error || feesError) && (
        <Alert type="error" message={error || feesError || ''} />
      )}

      {/* Alert when no accounts */}
      {!isLoading && accounts.length === 0 && (
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Nenhuma conta financeira encontrada</h3>
              <p className="text-sm text-yellow-800 mb-4">
                Para registrar pagamentos de cotas, você precisa ter pelo menos uma conta cadastrada.
                Crie as contas padrão: "Caixa do Clube" e "Tesoureiro da Igreja".
              </p>
              <Button
                onClick={createDefaultAccounts}
                disabled={isCreatingAccounts}
                size="small"
              >
                {isCreatingAccounts ? 'Criando...' : 'Criar Contas Padrão'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <DollarSign className="text-blue-500" size={32} />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagos</p>
              <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Atrasados</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </Card>
      </div>

      {/* Revenue Stats */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Valor Total Gerado</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Valor Recebido</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
          </div>
        </div>
      </Card>

      {/* Actions and Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold">Cotas</h3>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowGenerateModal(true)}
            >
              <Users size={16} className="mr-2" />
              Gerar em Lote
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} className="mr-2" />
              Nova Cota
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Todos</option>
            <option value="PENDING">Pendentes</option>
            <option value="PAID">Pagos</option>
            <option value="OVERDUE">Atrasados</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membro</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pago em</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Nenhuma cota encontrada
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {fee.member ? `${fee.member.firstName} ${fee.member.lastName}` : 'N/A'}
                        </p>
                        {fee.member?.unit && (
                          <p className="text-xs text-gray-500">{fee.member.unit.name}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(fee.amount)}</td>
                    <td className="px-4 py-3">{formatDate(fee.dueDate)}</td>
                    <td className="px-4 py-3">{getStatusBadge(fee.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {fee.paidDate ? formatDate(fee.paidDate) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {fee.status === 'PENDING' && (
                          <>
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={() => openPayModal(fee)}
                              disabled={accounts.length === 0}
                              title={accounts.length === 0 ? 'Crie contas primeiro' : ''}
                            >
                              Pagar
                            </Button>
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={() => handleCancelFee(fee.id)}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nova Cota"
      >
        <form onSubmit={handleCreateFee} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Membro *
            </label>
            <select
              value={createForm.memberId}
              onChange={(e) => setCreateForm({ ...createForm, memberId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um membro</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} {member.unit ? `- ${member.unit.name}` : ''}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Valor *"
            type="number"
            step="0.01"
            min="0"
            value={createForm.amount}
            onChange={(e) => setCreateForm({ ...createForm, amount: parseFloat(e.target.value) })}
            required
          />

          <Input
            label="Data de Vencimento *"
            type="date"
            value={createForm.dueDate}
            onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={createForm.notes}
              onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Criar Cota
            </Button>
          </div>
        </form>
      </Modal>

      {/* Generate Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Gerar Cotas em Lote"
      >
        <form onSubmit={handleGenerateFees} className="space-y-4">
          <Alert 
            type="info" 
            message="Isso irá gerar cotas para todos os membros ativos (ou da unidade selecionada)."
          />

          <Input
            label="Valor *"
            type="number"
            step="0.01"
            min="0"
            value={generateForm.amount}
            onChange={(e) => setGenerateForm({ ...generateForm, amount: parseFloat(e.target.value) })}
            required
          />

          <Input
            label="Data de Vencimento *"
            type="date"
            value={generateForm.dueDate}
            onChange={(e) => setGenerateForm({ ...generateForm, dueDate: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidade (Opcional)
            </label>
            <select
              value={generateForm.unitId}
              onChange={(e) => setGenerateForm({ ...generateForm, unitId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as unidades</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={generateForm.notes}
              onChange={(e) => setGenerateForm({ ...generateForm, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowGenerateModal(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Gerar Cotas
            </Button>
          </div>
        </form>
      </Modal>

      {/* Pay Modal */}
      <Modal
        isOpen={showPayModal}
        onClose={() => {
          setShowPayModal(false);
          setSelectedFee(null);
        }}
        title="Registrar Pagamento"
      >
        {selectedFee && (
          <form onSubmit={handlePayFee} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Membro</p>
              <p className="font-medium">
                {selectedFee.member ? `${selectedFee.member.firstName} ${selectedFee.member.lastName}` : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mt-2">Valor</p>
              <p className="font-medium text-lg">{formatCurrency(selectedFee.amount)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conta de Destino *
              </label>
              <select
                value={payForm.accountId}
                onChange={(e) => setPayForm({ ...payForm, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione uma conta</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Data do Pagamento *"
              type="date"
              value={payForm.paymentDate}
              onChange={(e) => setPayForm({ ...payForm, paymentDate: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={payForm.notes}
                onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Ex: Pago em dinheiro, Pix, etc."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowPayModal(false);
                  setSelectedFee(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Confirmar Pagamento
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
