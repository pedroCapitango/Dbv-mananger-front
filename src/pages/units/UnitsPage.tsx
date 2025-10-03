import React, { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { useUnits } from '../../hooks/useUnits';
import { Layout } from '../../components/layout/Layout';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { UnitResponseDto, CreateUnitDto } from '../../types';
import { formatDate } from '../../utils/formatters';

const unitFormFields: FormField[] = [
  { name: 'name', label: 'Nome da Unidade', type: 'text', required: true, placeholder: 'Ex: Lobinhos, Pioneiros' },
  { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva a unidade...', rows: 3 },
  { name: 'minAge', label: 'Idade Mínima', type: 'number', placeholder: '8' },
  { name: 'maxAge', label: 'Idade Máxima', type: 'number', placeholder: '11' },
];

export const UnitsPage: React.FC = () => {
  const { units, isLoading, error, createUnit, updateUnit, deleteUnit } = useUnits();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitResponseDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'name', label: 'Nome', render: (u: UnitResponseDto) => u.name },
    { 
      key: 'description', 
      label: 'Descrição',
      render: (u: UnitResponseDto) => u.description || 'Sem descrição'
    },
    { 
      key: 'createdAt', 
      label: 'Criado em', 
      render: (u: UnitResponseDto) => formatDate(u.createdAt) 
    },
  ];

  const handleCreate = async (data: Record<string, unknown>) => {
    try {
      setActionError(null);
      await createUnit(data as unknown as CreateUnitDto);
      setActionSuccess('Unidade criada com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setActionError(errorMessage);
    }
  };

  const handleEdit = async (data: Record<string, unknown>) => {
    if (!selectedUnit) return;
    try {
      setActionError(null);
      await updateUnit(selectedUnit.id, data as unknown as CreateUnitDto);
      setActionSuccess('Unidade atualizada com sucesso!');
      setIsEditModalOpen(false);
      setSelectedUnit(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setActionError(errorMessage);
    }
  };

  const handleDelete = async (unit: UnitResponseDto) => {
    if (!window.confirm(`Deseja realmente deletar a unidade "${unit.name}"?`)) return;
    
    try {
      setActionError(null);
      await deleteUnit(unit.id);
      setActionSuccess('Unidade deletada com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setActionError(errorMessage);
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

  if (isLoading) {
    return (
      <Layout title="Unidades">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando unidades...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Unidades">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Unidades</h1>
            <p className="text-gray-600 mt-1">Gerencie as unidades do clube (Lobinhos, Pioneiros, etc.)</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Nova Unidade
          </Button>
        </div>

      {actionSuccess && <Alert type="success">{actionSuccess}</Alert>}
      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar unidades..."
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
            onSubmit={handleEdit}
            submitLabel="Salvar Alterações"
            initialValues={selectedUnit}
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
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="mt-1 text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users size={20} className="text-blue-600" />
                  {selectedUnit.name}
                </p>
              </div>

              {selectedUnit.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Descrição</p>
                  <p className="mt-1 text-gray-900">{selectedUnit.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUnit.createdAt)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Última Atualização</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUnit.updatedAt)}</p>
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
    </Layout>
  );
};
