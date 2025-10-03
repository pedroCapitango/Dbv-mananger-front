import React, { useState } from 'react';
import { Plus, Search, Package, AlertCircle } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { MainLayout } from '../../components/layout/MainLayout';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { InventoryItemResponseDto, CreateItemDto } from '../../types';

export const InventoryPage: React.FC = () => {
  const { items, categories, isLoading, error, createItem, updateItem, deleteItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItemResponseDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const itemFormFields: FormField[] = [
    { name: 'name', label: 'Nome do Item', type: 'text', required: true, placeholder: 'Barraca 4 pessoas' },
    { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descrição detalhada...', rows: 3 },
    { 
      name: 'categoryId', 
      label: 'Categoria', 
      type: 'select', 
      required: true,
      options: categories.map(c => ({ value: c.id, label: c.name }))
    },
    { name: 'quantity', label: 'Quantidade', type: 'number', required: true, placeholder: '10' },
    { name: 'minQuantity', label: 'Quantidade Mínima', type: 'number', placeholder: '2' },
    { name: 'unit', label: 'Unidade', type: 'text', placeholder: 'unidade, kg, m...' },
    { name: 'cost', label: 'Custo (Kz)', type: 'number', placeholder: '5000' },
    { name: 'location', label: 'Localização', type: 'text', placeholder: 'Armário A, Prateleira 2' },
    { name: 'barcode', label: 'Código de Barras', type: 'text', placeholder: '123456789' },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'available', label: 'Disponível' },
        { value: 'low_stock', label: 'Estoque Baixo' },
        { value: 'out_of_stock', label: 'Sem Estoque' },
        { value: 'discontinued', label: 'Descontinuado' }
      ]
    },
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'name', 
      label: 'Item', 
      render: (i: InventoryItemResponseDto) => (
        <div>
          <div className="font-medium text-gray-900">{i.name}</div>
          <div className="text-sm text-gray-500">{i.category?.name}</div>
        </div>
      )
    },
    { 
      key: 'quantity', 
      label: 'Quantidade', 
      render: (i: InventoryItemResponseDto) => (
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-400" />
          <span className={i.quantity < (i.minQuantity || 0) ? 'text-red-600 font-semibold' : ''}>
            {i.quantity} un
          </span>
          {i.quantity < (i.minQuantity || 0) && (
            <AlertCircle size={16} className="text-red-500" />
          )}
        </div>
      )
    },
    { key: 'location', label: 'Localização', render: (i: InventoryItemResponseDto) => i.location || '-' },
  ];

  const handleCreate = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      await createItem(data as CreateItemDto);
      setActionSuccess('Item criado com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleEdit = async (data: Record<string, any>) => {
    if (!selectedItem?.id) return;
    try {
      setActionError(null);
      await updateItem(selectedItem.id, data as CreateItemDto);
      setActionSuccess('Item atualizado com sucesso!');
      setIsEditModalOpen(false);
      setSelectedItem(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (item: InventoryItemResponseDto) => {
    if (!window.confirm(`Deseja realmente deletar "${item.name}"?`)) return;
    
    try {
      setActionError(null);
      await deleteItem(item.id);
      setActionSuccess('Item deletado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const openEditModal = (item: InventoryItemResponseDto) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleView = (item: InventoryItemResponseDto) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  return (
    <MainLayout title="Inventário">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventário</h1>
            <p className="text-gray-600 mt-1">Gerencie os itens do inventário</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Novo Item
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
              placeholder="Buscar itens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <Table
          data={filteredItems}
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
        title="Novo Item"
      >
        <Form
          fields={itemFormFields}
          onSubmit={handleCreate}
          submitLabel="Criar Item"
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        title="Editar Item"
      >
        {selectedItem && (
          <Form
            fields={itemFormFields}
            onSubmit={handleEdit}
            submitLabel="Salvar Alterações"
            initialValues={selectedItem}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedItem(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedItem(null);
        }}
        title="Detalhes do Item"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Nome do Item</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{selectedItem.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Categoria</p>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.category?.name || 'Sem categoria'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Quantidade</p>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <Package size={16} className="text-gray-400" />
                  {selectedItem.quantity} unidade(s)
                  {selectedItem.quantity < (selectedItem.minQuantity || 0) && (
                    <AlertCircle size={16} className="text-yellow-500" />
                  )}
                </p>
              </div>

              {selectedItem.minQuantity && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantidade Mínima</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedItem.minQuantity} unidade(s)
                  </p>
                </div>
              )}

              {selectedItem.location && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Localização</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.location}</p>
                </div>
              )}
            </div>

            {selectedItem.description && (
              <div>
                <p className="text-sm font-medium text-gray-500">Descrição</p>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.description}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedItem);
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDelete(selectedItem);
                }}
              >
                Deletar
              </Button>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </MainLayout>
  );
};
