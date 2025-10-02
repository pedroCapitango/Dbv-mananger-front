import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { MemberResponseDto, CreateMemberDto } from '../../types';
import { formatDate } from '../../utils/formatters';

const memberFormFields: FormField[] = [
  { name: 'firstName', label: 'Nome', type: 'text', required: true, placeholder: 'João' },
  { name: 'lastName', label: 'Sobrenome', type: 'text', required: true, placeholder: 'Silva' },
  { name: 'birthdate', label: 'Data de Nascimento', type: 'date', required: true },
  { 
    name: 'gender', 
    label: 'Gênero', 
    type: 'select', 
    required: true,
    options: [
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Feminino' }
    ]
  },
  { name: 'parentName', label: 'Nome do Responsável', type: 'text', placeholder: 'Maria Silva' },
  { name: 'parentPhone', label: 'Telefone do Responsável', type: 'tel', placeholder: '+244 923 000 000' },
  { name: 'parentEmail', label: 'Email do Responsável', type: 'email', placeholder: 'maria@email.com' },
  { name: 'address', label: 'Endereço', type: 'text', placeholder: 'Rua Principal, 123' },
  { name: 'city', label: 'Cidade', type: 'text', placeholder: 'Luanda' },
  { name: 'emergencyContact', label: 'Contato de Emergência', type: 'text', placeholder: 'José Silva' },
  { name: 'emergencyPhone', label: 'Telefone de Emergência', type: 'tel', placeholder: '+244 923 000 001' },
  { name: 'medicalInfo', label: 'Informações Médicas', type: 'textarea', placeholder: 'Alergias, condições médicas...' },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' }
    ]
  },
];

export const MembersPage: React.FC = () => {
  const { members, isLoading, error, createMember, updateMember, deleteMember } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberResponseDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredMembers = members.filter((member) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'firstName', label: 'Nome', render: (m: MemberResponseDto) => `${m.firstName} ${m.lastName}` },
    { key: 'birthdate', label: 'Data de Nascimento', render: (m: MemberResponseDto) => formatDate(m.birthdate) },
    { key: 'gender', label: 'Gênero', render: (m: MemberResponseDto) => m.gender === 'M' ? 'Masculino' : 'Feminino' },
    { key: 'parentName', label: 'Responsável', render: (m: MemberResponseDto) => m.parentName || '-' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (m: MemberResponseDto) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
      await createMember(data as CreateMemberDto);
      setActionSuccess('Membro criado com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleEdit = async (data: Record<string, any>) => {
    if (!selectedMember) return;
    try {
      setActionError(null);
      await updateMember(selectedMember.id, data as CreateMemberDto);
      setActionSuccess('Membro atualizado com sucesso!');
      setIsEditModalOpen(false);
      setSelectedMember(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (member: MemberResponseDto) => {
    if (!window.confirm(`Deseja realmente deletar ${member.firstName} ${member.lastName}?`)) return;
    
    try {
      setActionError(null);
      await deleteMember(member.id);
      setActionSuccess('Membro deletado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const openEditModal = (member: MemberResponseDto) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  return (
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
            onSubmit={handleEdit}
            submitLabel="Salvar Alterações"
            initialValues={selectedMember}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedMember(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
