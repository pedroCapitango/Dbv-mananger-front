import React, { useState } from 'react';
import { Plus, Award, TrendingUp, Eye } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { useMembers } from '../../hooks/useMembers';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import type { MemberProgressResponseDto } from '../../types';
import { formatDate } from '../../utils/formatters';

export const ProgressPage: React.FC = () => {
  const { progress, isLoading, error, createProgress, createMemberSpecialty } = useProgress();
  const { members } = useMembers();
  
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<MemberProgressResponseDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const progressFormFields: FormField[] = [
    {
      name: 'memberId',
      label: 'Membro',
      type: 'select',
      required: true,
      options: members.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` })),
    },
    {
      name: 'className',
      label: 'Classe',
      type: 'select',
      required: true,
      options: [
        { value: 'aspirante', label: 'Aspirante' },
        { value: 'primeira_classe', label: '1ª Classe' },
        { value: 'segunda_classe', label: '2ª Classe' },
        { value: 'terceira_classe', label: '3ª Classe' },
        { value: 'guia', label: 'Guia' },
        { value: 'lis', label: 'Lis' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'in_progress', label: 'Em Progresso' },
        { value: 'completed', label: 'Concluído' },
      ],
    },
    { name: 'startDate', label: 'Data de Início', type: 'date', required: true },
    { name: 'completionDate', label: 'Data de Conclusão', type: 'date' },
  ];

  const specialtyFormFields: FormField[] = [
    {
      name: 'memberId',
      label: 'Membro',
      type: 'select',
      required: true,
      options: members.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` })),
    },
    { name: 'specialtyName', label: 'Nome da Especialidade', type: 'text', required: true, placeholder: 'Ex: Primeiros Socorros' },
    {
      name: 'category',
      label: 'Categoria',
      type: 'select',
      required: true,
      options: [
        { value: 'ciencia_tecnologia', label: 'Ciência e Tecnologia' },
        { value: 'desportos', label: 'Desportos' },
        { value: 'cultura', label: 'Cultura' },
        { value: 'habilidades', label: 'Habilidades Escoteiras' },
        { value: 'servicos', label: 'Serviços' },
      ],
    },
    { name: 'startDate', label: 'Data de Início', type: 'date', required: true },
    { name: 'completionDate', label: 'Data de Conclusão', type: 'date' },
  ];

  const handleCreateProgress = async (formData: Record<string, any>) => {
    try {
      await createProgress(formData);
      setIsProgressModalOpen(false);
      setActionSuccess('Progresso registrado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao registrar progresso');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleCreateSpecialty = async (formData: Record<string, any>) => {
    try {
      await createMemberSpecialty(formData);
      setIsSpecialtyModalOpen(false);
      setActionSuccess('Especialidade registrada com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao registrar especialidade');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const openViewModal = (progressItem: MemberProgressResponseDto) => {
    setSelectedProgress(progressItem);
    setIsViewModalOpen(true);
  };

  const columns = [
    {
      key: 'member',
      label: 'Membro',
      render: (item: MemberProgressResponseDto) => {
        const member = members.find(m => m.id === item.memberId);
        return member ? `${member.firstName} ${member.lastName}` : item.memberId;
      },
      sortable: true,
    },
    {
      key: 'className',
      label: 'Classe',
      render: (item: MemberProgressResponseDto) => (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
          {item.className}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: MemberProgressResponseDto) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            item.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {item.status === 'completed' ? 'Concluído' : 'Em Progresso'}
        </span>
      ),
    },
    {
      key: 'startDate',
      label: 'Início',
      render: (item: MemberProgressResponseDto) => formatDate(item.startDate),
      sortable: true,
    },
    {
      key: 'completionDate',
      label: 'Conclusão',
      render: (item: MemberProgressResponseDto) =>
        item.completionDate ? formatDate(item.completionDate) : '-',
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (item: MemberProgressResponseDto) => (
        <Button
          variant="ghost"
          size="small"
          onClick={() => openViewModal(item)}
        >
          <Eye className="w-4 h-4" />
          Ver
        </Button>
      ),
    },
  ];

  const completedCount = progress.filter(p => p.status === 'completed').length;
  const inProgressCount = progress.filter(p => p.status === 'in_progress').length;

  if (error) {
    return (
      <div className="p-6">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progresso dos Membros</h1>
            <p className="text-sm text-gray-600">Acompanhe classes e especialidades</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsSpecialtyModalOpen(true)}
          >
            <Award className="w-5 h-5" />
            Nova Especialidade
          </Button>
          <Button
            onClick={() => setIsProgressModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Registrar Progresso
          </Button>
        </div>
      </div>

      {actionSuccess && <Alert type="success" message={actionSuccess} />}
      {actionError && <Alert type="error" message={actionError} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Registros</p>
              <p className="text-2xl font-bold text-primary-600">{progress.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Progresso</p>
              <p className="text-2xl font-bold text-yellow-600">{inProgressCount}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      <Table
        data={progress}
        columns={columns}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        title="Registrar Progresso"
      >
        <Form
          fields={progressFormFields}
          onSubmit={handleCreateProgress}
          submitLabel="Registrar"
        />
      </Modal>

      <Modal
        isOpen={isSpecialtyModalOpen}
        onClose={() => setIsSpecialtyModalOpen(false)}
        title="Nova Especialidade"
      >
        <Form
          fields={specialtyFormFields}
          onSubmit={handleCreateSpecialty}
          submitLabel="Registrar"
        />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProgress(null);
        }}
        title="Detalhes do Progresso"
      >
        {selectedProgress && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Membro</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {(() => {
                  const member = members.find(m => m.id === selectedProgress.memberId);
                  return member ? `${member.firstName} ${member.lastName}` : selectedProgress.memberId;
                })()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Classe</p>
              <p className="mt-1 text-gray-700">{selectedProgress.className}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProgress.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {selectedProgress.status === 'completed' ? 'Concluído' : 'Em Progresso'}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Início</p>
                <p className="mt-1 text-gray-700">{formatDate(selectedProgress.startDate)}</p>
              </div>

              {selectedProgress.completionDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Conclusão</p>
                  <p className="mt-1 text-gray-700">{formatDate(selectedProgress.completionDate)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
