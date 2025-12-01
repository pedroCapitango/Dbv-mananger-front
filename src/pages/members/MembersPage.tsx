import React, { useState, useMemo } from 'react';
import { Plus, Search, User, Calendar, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';
import { useUnits } from '../../hooks/useUnits';
import { MainLayout } from '../../components/layout/MainLayout';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { MemberResponseDto, CreateMemberDto } from '../../types';
import { formatDate } from '../../utils/formatters';

export const MembersPage: React.FC = () => {
  const { members, isLoading, error, createMember, updateMember, deleteMember, restoreMember } = useMembers();
  const { units } = useUnits({ requireAuth: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberResponseDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Campos do formulário com validação correta
  const memberFormFields: FormField[] = useMemo(() => [
    { 
      name: 'firstName', 
      label: 'Nome', 
      type: 'text', 
      required: true, 
      placeholder: 'João' 
    },
    { 
      name: 'lastName', 
      label: 'Sobrenome', 
      type: 'text', 
      required: true, 
      placeholder: 'Silva' 
    },
    { 
      name: 'birthdate', 
      label: 'Data de Nascimento', 
      type: 'date', 
      required: true 
    },
    { 
      name: 'gender', 
      label: 'Gênero', 
      type: 'select', 
      required: true,
      options: [
        { value: 'MASCULINO', label: 'Masculino' },
        { value: 'FEMININO', label: 'Feminino' }
      ]
    },
    { 
      name: 'unitId', 
      label: 'Unidade', 
      type: 'select',
      options: units.map(u => ({ value: u.id, label: u.name }))
    },
    { 
      name: 'guardianName', 
      label: 'Nome do Responsável', 
      type: 'text', 
      placeholder: 'Maria Silva' 
    },
    { 
      name: 'guardianPhone', 
      label: 'Telefone do Responsável', 
      type: 'tel', 
      placeholder: '+244 923 000 000' 
    },
    { 
      name: 'contactEmail', 
      label: 'Email de Contato', 
      type: 'email', 
      placeholder: 'contato@email.com' 
    },
    { 
      name: 'enrollmentDate', 
      label: 'Data de Matrícula', 
      type: 'date'
    },
    { 
      name: 'notes', 
      label: 'Observações', 
      type: 'textarea', 
      placeholder: 'Informações adicionais...',
      rows: 3
    },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' }
      ]
    },
  ], [units]);

  const filteredMembers = members.filter((member) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.unit?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'name', 
      label: 'Membro', 
      render: (m: MemberResponseDto) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {m.firstName.charAt(0)}{m.lastName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{m.firstName} {m.lastName}</div>
            <div className="text-sm text-gray-500">{formatDate(m.birthdate)}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'gender', 
      label: 'Gênero', 
      render: (m: MemberResponseDto) => {
        const genderMap: Record<string, string> = {
          'MASCULINO': 'Masculino',
          'FEMININO': 'Feminino',
          'M': 'Masculino',
          'F': 'Feminino'
        };
        return genderMap[m.gender] || m.gender;
      }
    },
    { 
      key: 'unit', 
      label: 'Unidade', 
      render: (m: MemberResponseDto) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-sm font-medium">
          {m.unit?.name || 'Sem unidade'}
        </span>
      )
    },
    { 
      key: 'contact', 
      label: 'Contato', 
      render: (m: MemberResponseDto) => (
        <div className="text-sm">
          <div className="text-gray-900">{m.guardianName || '-'}</div>
          <div className="text-gray-500">{m.guardianPhone || 'Sem telefone'}</div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (m: MemberResponseDto) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {m.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
  ];

  const handleCreate = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      
      // Transformar dados para o formato correto da API
      const memberData: CreateMemberDto = {
        firstName: data.firstName,
        lastName: data.lastName,
        birthdate: data.birthdate,
        gender: data.gender,
        photoUrl: data.photoUrl || undefined,
        guardianName: data.guardianName || undefined,
        guardianPhone: data.guardianPhone || undefined,
        contactEmail: data.contactEmail || undefined,
        enrollmentDate: data.enrollmentDate || undefined,
        notes: data.notes || undefined,
        unitId: data.unitId || undefined,
        status: data.status || 'active',
      };
      
      await createMember(memberData);
      setActionSuccess('Membro criado com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleUpdate = async (data: Record<string, any>) => {
    if (!selectedMember) return;
    try {
      setActionError(null);
      
      console.log('📝 Dados recebidos do formulário:', data);
      console.log('👤 Membro selecionado:', selectedMember);
      
      // Transformar dados para o formato correto da API
      const memberData: CreateMemberDto = {
        firstName: data.firstName,
        lastName: data.lastName,
        birthdate: data.birthdate,
        gender: data.gender,
        photoUrl: data.photoUrl || undefined,
        guardianName: data.guardianName || undefined,
        guardianPhone: data.guardianPhone || undefined,
        contactEmail: data.contactEmail || undefined,
        enrollmentDate: data.enrollmentDate || undefined,
        notes: data.notes || undefined,
        unitId: data.unitId && data.unitId !== '' ? data.unitId : undefined,
        status: data.status || selectedMember.status,
      };
      
      console.log('🚀 Dados que serão enviados:', memberData);
      
      await updateMember(selectedMember.id, memberData);
      setIsEditModalOpen(false);
      setSelectedMember(null);
      setActionSuccess('Membro atualizado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      console.error('❌ Erro ao atualizar membro:', err);
      setActionError(err.message || 'Erro ao atualizar membro');
    }
  };

  const handleEdit = (member: MemberResponseDto) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleView = (member: MemberResponseDto) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (member: MemberResponseDto) => {
    try {
      await deleteMember(member.id);
      setActionSuccess('Membro deletado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError('Erro ao deletar membro');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleRestore = async (member: MemberResponseDto) => {
    try {
      await restoreMember(member.id);
      setActionSuccess('Membro restaurado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError('Erro ao restaurar membro');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const openEditModal = (member: MemberResponseDto) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  return (
    <MainLayout title="Membros">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Membros</h1>
            <p className="text-gray-600 mt-1">Gerencie os membros do clube</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Novo Membro
          </Button>
        </div>

      {actionSuccess && <Alert type="success">{actionSuccess}</Alert>}
      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar membros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <Table
          data={filteredMembers}
          columns={columns}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onView={handleView}
          isLoading={isLoading}
        />
      </Card>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Membro"
      >
        <Form
          fields={memberFormFields}
          onSubmit={handleCreate}
          submitLabel="Criar Membro"
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        title="Editar Membro"
      >
        {selectedMember && (
          <Form
            fields={memberFormFields}
            onSubmit={handleUpdate}
            submitLabel="Salvar Alterações"
            initialValues={{
              ...selectedMember,
              // Converter data ISO para formato YYYY-MM-DD para input type="date"
              birthdate: selectedMember.birthdate?.split('T')[0] || selectedMember.birthdate,
              // Garantir que unitId seja string ou undefined
              unitId: selectedMember.unitId || '',
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedMember(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedMember(null);
        }}
        title="Detalhes do Membro"
      >
        {selectedMember && (
          <div className="space-y-6">
            {/* Header com Avatar */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                {selectedMember.firstName.charAt(0)}{selectedMember.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedMember.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedMember.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                  {selectedMember.unit && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {selectedMember.unit.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações Pessoais */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={16} className="text-gray-600" />
                Informações Pessoais
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Data de Nascimento</p>
                  <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                    <Calendar size={14} className="text-gray-400" />
                    {formatDate(selectedMember.birthdate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Gênero</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedMember.gender === 'MASCULINO' || selectedMember.gender === 'M' ? 'Masculino' : 'Feminino'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Data de Cadastro</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedMember.enrollmentDate || selectedMember.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Responsável */}
            {(selectedMember.guardianName || selectedMember.guardianPhone || selectedMember.contactEmail) && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={16} className="text-gray-600" />
                  Responsável
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedMember.guardianName && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">Nome</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedMember.guardianName}</p>
                    </div>
                  )}
                  {selectedMember.guardianPhone && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">Telefone</p>
                      <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                        <Phone size={14} className="text-gray-400" />
                        {selectedMember.guardianPhone}
                      </p>
                    </div>
                  )}
                  {selectedMember.contactEmail && (
                    <div className="col-span-2">
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedMember.contactEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Observações */}
            {selectedMember.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-gray-600" />
                  Observações
                </h4>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMember.notes}</p>
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedMember);
                }}
              >
                Editar
              </Button>
              {selectedMember.status !== 'active' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleRestore(selectedMember);
                    setIsViewModalOpen(false);
                  }}
                >
                  Restaurar
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
      </div>
    </MainLayout>
  );
};
