import React, { useState } from 'react';
import { Plus, Award, Star } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { useMembers } from '../../hooks/useMembers';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import { formatDate } from '../../utils/formatters';

export const ProgressPage: React.FC = () => {
  const { progress, isLoading, error, createProgress, getMemberSpecialties, createSpecialty } = useProgress();
  const { members } = useMembers();
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [memberSpecialties, setMemberSpecialties] = useState<any[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const progressFormFields: FormField[] = [
    { 
      name: 'memberId', 
      label: 'Membro', 
      type: 'select', 
      required: true,
      options: members.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` }))
    },
    { 
      name: 'classLevel', 
      label: 'Classe', 
      type: 'select', 
      required: true,
      options: [
        { value: 'pata_tenra', label: 'Pata Tenra' },
        { value: 'saltador', label: 'Saltador' },
        { value: 'rastreador', label: 'Rastreador' },
        { value: 'cacador', label: 'Caçador' },
        { value: 'cruzeiro_do_sul', label: 'Cruzeiro do Sul' },
      ]
    },
    { name: 'achievedAt', label: 'Data de Conquista', type: 'date', required: true },
    { name: 'notes', label: 'Observações', type: 'textarea', placeholder: 'Observações sobre o progresso...' },
  ];

  const specialtyFormFields: FormField[] = [
    { 
      name: 'memberId', 
      label: 'Membro', 
      type: 'select', 
      required: true,
      options: members.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` }))
    },
    { name: 'name', label: 'Nome da Especialidade', type: 'text', required: true, placeholder: 'Ex: Primeiros Socorros' },
    { 
      name: 'level', 
      label: 'Nível', 
      type: 'select', 
      required: true,
      options: [
        { value: '1', label: 'Nível 1' },
        { value: '2', label: 'Nível 2' },
        { value: '3', label: 'Nível 3' },
      ]
    },
    { name: 'achievedAt', label: 'Data de Conquista', type: 'date', required: true },
  ];

  const handleCreateProgress = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      await createProgress(data);
      setActionSuccess('Progresso registrado com sucesso!');
      setIsProgressModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleCreateSpecialty = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      await createSpecialty(data);
      setActionSuccess('Especialidade registrada com sucesso!');
      setIsSpecialtyModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleLoadMemberSpecialties = async () => {
    if (!selectedMemberId) return;
    
    try {
      const data = await getMemberSpecialties(selectedMemberId);
      setMemberSpecialties(data);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const getClassLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      pata_tenra: 'Pata Tenra',
      saltador: 'Saltador',
      rastreador: 'Rastreador',
      cacador: 'Caçador',
      cruzeiro_do_sul: 'Cruzeiro do Sul',
    };
    return labels[level] || level;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progresso de Membros</h1>
          <p className="text-gray-600 mt-1">Gerencie classes e especialidades</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsSpecialtyModalOpen(true)} icon={Star} variant="secondary">
            Nova Especialidade
          </Button>
          <Button onClick={() => setIsProgressModalOpen(true)} icon={Plus}>
            Registrar Progresso
          </Button>
        </div>
      </div>

      {actionSuccess && <Alert variant="success">{actionSuccess}</Alert>}
      {actionError && <Alert variant="error">{actionError}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="text-blue-500" />
            Progresso de Classes
          </h2>
          
          {isLoading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : progress.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Nenhum progresso registrado</p>
          ) : (
            <div className="space-y-3">
              {progress.map((p) => (
                <div key={p.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {p.member?.firstName} {p.member?.lastName}
                      </p>
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        {getClassLevelLabel(p.classLevel)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(p.achievedAt)}
                      </p>
                    </div>
                    <Award className="text-blue-500" size={24} />
                  </div>
                  {p.notes && (
                    <p className="text-sm text-gray-600 mt-2">{p.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="text-yellow-500" />
            Especialidades
          </h2>

          <div className="mb-4 flex gap-2">
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um membro</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                </option>
              ))}
            </select>
            <Button onClick={handleLoadMemberSpecialties} disabled={!selectedMemberId}>
              Carregar
            </Button>
          </div>

          {memberSpecialties.length > 0 && (
            <div className="space-y-3">
              {memberSpecialties.map((specialty) => (
                <div key={specialty.id} className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{specialty.name}</p>
                      <p className="text-sm text-yellow-600 font-medium mt-1">
                        Nível {specialty.level}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(specialty.achievedAt)}
                      </p>
                    </div>
                    <Star className="text-yellow-500" size={24} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        title="Registrar Progresso de Classe"
      >
        <Form
          fields={progressFormFields}
          onSubmit={handleCreateProgress}
          submitLabel="Registrar"
          onCancel={() => setIsProgressModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isSpecialtyModalOpen}
        onClose={() => setIsSpecialtyModalOpen(false)}
        title="Registrar Especialidade"
      >
        <Form
          fields={specialtyFormFields}
          onSubmit={handleCreateSpecialty}
          submitLabel="Registrar"
          onCancel={() => setIsSpecialtyModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
