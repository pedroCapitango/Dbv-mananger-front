import React, { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { useUnits } from '../../hooks/useUnits';
import { useMembers } from '../../hooks/useMembers';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { UnitResponseDto, CreateUnitDto } from '../../types';

const unitFormFields: FormField[] = [
  { name: 'name', label: 'Nome da Unidade', type: 'text', required: true, placeholder: 'Ex: Lobinhos, Pioneiros...' },
  { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descrição da unidade...' },
];

export const UnitsPage: React.FC = () => {
  const { units, isLoading, error, createUnit, updateUnit, deleteUnit } = useUnits();
  const { members } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitResponseDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'name', label: 'Nome', render: (u: UnitResponseDto) => u.name },
    { key: 'description', label: 'Descrição', render: (u: UnitResponseDto) => u.description || '-' },
    { 
      key: 'memberCount', 
      label: 'Membros', 
      render: (u: UnitResponseDto) => {
        const count = members.filter(m => m.unitId === u.id).length;
        return (
          <span className="flex items-center gap-1">
            <Users size={16} />
            {count}
          </span>
        );
      }
    },
  ];

  const handleCreate = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      await createUnit(data as CreateUnitDto);
      setActionSuccess('Unidade criada com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleUpdate = async (data: Record<string, any>) => {
    if (!selectedUnit) return;
    try {
      setActionError(null);
      await updateUnit(selectedUnit.id, data);
      setIsEditModalOpen(false);
      setSelectedUnit(null);
      setActionSuccess('Unidade atualizada com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (unit: UnitResponseDto) => {
    if (!window.confirm(`Deseja realmente deletar a unidade "${unit.name}"?`)) return;
    
    try {
      setActionError(null);
      await deleteUnit(unit.id);
      setActionSuccess('Unidade deletada com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const openEditModal = (unit: UnitResponseDto) => {
    setSelectedUnit(unit);
    setIsEditModalOpen(true);
  };

  const handleView = (unit: UnitResponseDto) => {
    setSelectedUnit(unit);
    setIsViewModalOpen(true);
  };

  const unitMembers = selectedUnit 
    ? members.filter(m => m.unitId === selectedUnit.id)
    : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Unidades</h1>
          <p className="text-gray-600 mt-1">Gerencie as unidades do grupo escoteiro</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} icon={Plus}>
          Nova Unidade
        </Button>
      </div>

      {actionSuccess && <Alert variant="success">{actionSuccess}</Alert>}
      {actionError && <Alert variant="error">{actionError}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar unidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <Table
          data={filteredUnits}
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
        title="Nova Unidade"
      >
        <Form
          fields={unitFormFields}
          onSubmit={handleCreate}
          submitLabel="Criar Unidade"
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUnit(null);
        }}
        title="Editar Unidade"
      >
        {selectedUnit && (
          <Form
            fields={unitFormFields}
            initialValues={selectedUnit}
            onSubmit={handleUpdate}
            submitLabel="Salvar Alterações"
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedUnit(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUnit(null);
        }}
        title="Detalhes da Unidade"
      >
        {selectedUnit && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{selectedUnit.name}</p>
              </div>

              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Descrição</p>
                <p className="mt-1 text-gray-900">{selectedUnit.description || 'Sem descrição'}</p>
              </div>

              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Membros ({unitMembers.length})</p>
                <div className="mt-2 space-y-1">
                  {unitMembers.length > 0 ? (
                    unitMembers.map(member => (
                      <div key={member.id} className="text-sm text-gray-700">
                        • {member.firstName} {member.lastName}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum membro nesta unidade</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedUnit);
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDelete(selectedUnit);
                }}
              >
                Deletar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
