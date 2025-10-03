import React, { useState } from 'react';
import { Plus, Users, Edit, Trash2, Eye } from 'lucide-react';
import { useUnits } from '../../hooks/useUnits';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { UnitResponseDto, CreateUnitDto } from '../../types';

const unitFormFields: FormField[] = [
  { name: 'name', label: 'Nome da Unidade', type: 'text', required: true, placeholder: 'Ex: Lobinhos, Pioneiros' },
  { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descrição da unidade...', rows: 3 },
  { name: 'minAge', label: 'Idade Mínima', type: 'number', placeholder: '7' },
  { name: 'maxAge', label: 'Idade Máxima', type: 'number', placeholder: '10' },
];

export const UnitsPage: React.FC = () => {
  const { units, isLoading, error, createUnit, updateUnit, deleteUnit } = useUnits();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitResponseDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCreate = async (formData: Record<string, any>) => {
    try {
      await createUnit(formData as CreateUnitDto);
      setIsCreateModalOpen(false);
      setActionSuccess('Unidade criada com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao criar unidade');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleEdit = async (formData: Record<string, any>) => {
    if (!selectedUnit) return;
    try {
      await updateUnit(selectedUnit.id, formData as CreateUnitDto);
      setIsEditModalOpen(false);
      setSelectedUnit(null);
      setActionSuccess('Unidade atualizada com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar unidade');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleDelete = async (unit: UnitResponseDto) => {
    if (!confirm(`Tem certeza que deseja excluir a unidade "${unit.name}"?`)) return;
    try {
      await deleteUnit(unit.id);
      setActionSuccess('Unidade excluída com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao excluir unidade');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const openEditModal = (unit: UnitResponseDto) => {
    setSelectedUnit(unit);
    setIsEditModalOpen(true);
  };

  const openViewModal = (unit: UnitResponseDto) => {
    setSelectedUnit(unit);
    setIsViewModalOpen(true);
  };

  const columns = [
    { key: 'name', label: 'Nome', sortable: true },
    { 
      key: 'description', 
      label: 'Descrição',
      render: (unit: UnitResponseDto) => unit.description || '-'
    },
    {
      key: 'ageRange',
      label: 'Faixa Etária',
      render: (unit: UnitResponseDto) => {
        if (unit.minAge && unit.maxAge) {
          return `${unit.minAge} - ${unit.maxAge} anos`;
        }
        if (unit.minAge) return `${unit.minAge}+ anos`;
        if (unit.maxAge) return `Até ${unit.maxAge} anos`;
        return '-';
      }
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (unit: UnitResponseDto) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => openViewModal(unit)}
          >
            <Eye className="w-4 h-4" />
            Ver
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => openEditModal(unit)}
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleDelete(unit)}
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </Button>
        </div>
      ),
    },
  ];

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
          <Users className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Unidades</h1>
            <p className="text-sm text-gray-600">Gerencie as unidades escoteiras</p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Nova Unidade
        </Button>
      </div>

      {actionSuccess && <Alert type="success" message={actionSuccess} />}
      {actionError && <Alert type="error" message={actionError} />}

      <Table
        data={units}
        columns={columns}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nova Unidade"
      >
        <Form
          fields={unitFormFields}
          onSubmit={handleCreate}
          submitLabel="Criar Unidade"
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
            initialValues={{
              name: selectedUnit.name,
              description: selectedUnit.description || '',
              minAge: selectedUnit.minAge || '',
              maxAge: selectedUnit.maxAge || '',
            }}
            onSubmit={handleEdit}
            submitLabel="Salvar Alterações"
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
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{selectedUnit.name}</p>
            </div>

            {selectedUnit.description && (
              <div>
                <p className="text-sm font-medium text-gray-500">Descrição</p>
                <p className="mt-1 text-gray-700">{selectedUnit.description}</p>
              </div>
            )}

            {(selectedUnit.minAge || selectedUnit.maxAge) && (
              <div>
                <p className="text-sm font-medium text-gray-500">Faixa Etária</p>
                <p className="mt-1 text-gray-700">
                  {selectedUnit.minAge && selectedUnit.maxAge
                    ? `${selectedUnit.minAge} - ${selectedUnit.maxAge} anos`
                    : selectedUnit.minAge
                    ? `${selectedUnit.minAge}+ anos`
                    : `Até ${selectedUnit.maxAge} anos`}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="primary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedUnit);
                }}
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDelete(selectedUnit);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
