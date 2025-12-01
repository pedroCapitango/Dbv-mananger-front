import React, { useState } from 'react';
import { Plus, Search, Package, AlertCircle, Tag, Trash2, Edit } from 'lucide-react';
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
  const { 
    items, 
    categories, 
    isLoading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem,
    createCategory,
    updateCategory,
    deleteCategory 
  } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItemResponseDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  const itemFormFields: FormField[] = [
    { name: 'name', label: 'Nome do Item', type: 'text', required: true, placeholder: 'Barraca 4 pessoas' },
    { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descrição detalhada...', rows: 3 },
    { 
      name: 'categoryId', 
      label: 'Categoria', 
      type: 'select', 
      required: true,
      options: categories.length > 0 
        ? categories.map(c => ({ value: c.id, label: c.name }))
        : [{ value: '', label: 'Nenhuma categoria disponível - Crie uma primeiro' }]
    },
    { name: 'unitOfMeasure', label: 'Unidade de Medida', type: 'text', required: true, placeholder: 'unidade, kg, m, caixa...' },
    { name: 'quantityInStock', label: 'Quantidade em Estoque', type: 'number', placeholder: '10', min: 0 },
    { name: 'minimumStock', label: 'Estoque Mínimo', type: 'number', placeholder: '2', min: 0 },
    { 
      name: 'condition', 
      label: 'Condição', 
      type: 'select',
      options: [
        { value: 'NEW', label: 'Novo' },
        { value: 'GOOD', label: 'Bom' },
        { value: 'WORN', label: 'Usado' },
        { value: 'DAMAGED', label: 'Danificado' }
      ]
    },
    { name: 'location', label: 'Localização', type: 'text', placeholder: 'Armário A, Prateleira 2' },
    { name: 'purchasePrice', label: 'Preço de Compra (Kz)', type: 'number', placeholder: '5000', min: 0 },
    { name: 'purchaseDate', label: 'Data de Compra', type: 'date' },
    { name: 'supplier', label: 'Fornecedor', type: 'text', placeholder: 'Nome do fornecedor' },
    { name: 'code', label: 'Código/Barras', type: 'text', placeholder: '123456789' },
    { name: 'observations', label: 'Observações', type: 'textarea', placeholder: 'Observações adicionais...', rows: 2 },
  ];

  const categoryFormFields: FormField[] = [
    { name: 'name', label: 'Nome da Categoria', type: 'text', required: true, placeholder: 'Camping' },
    { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descrição da categoria...', rows: 3 },
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
      key: 'quantityInStock', 
      label: 'Quantidade', 
      render: (i: InventoryItemResponseDto) => (
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-400" />
          <span className={i.quantityInStock < i.minimumStock ? 'text-red-600 font-semibold' : ''}>
            {i.quantityInStock} {i.unitOfMeasure}
          </span>
          {i.quantityInStock < i.minimumStock && (
            <AlertCircle size={16} className="text-red-500" />
          )}
        </div>
      )
    },
    { 
      key: 'condition', 
      label: 'Condição',
      render: (i: InventoryItemResponseDto) => {
        const conditionLabels = {
          NEW: 'Novo',
          GOOD: 'Bom',
          WORN: 'Usado',
          DAMAGED: 'Danificado'
        };
        return conditionLabels[i.condition] || i.condition;
      }
    },
    { key: 'location', label: 'Localização', render: (i: InventoryItemResponseDto) => i.location || '-' },
  ];

  const handleCreate = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      console.log('📦 Criando item do inventário:', data);
      await createItem(data as CreateItemDto);
      setActionSuccess('Item criado com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      console.error('❌ Erro ao criar item:', err);
      console.error('❌ Mensagem do erro:', err.message);
      console.error('❌ Stack:', err.stack);
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

  const handleCreateCategory = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      await createCategory(data as { name: string; description?: string });
      setActionSuccess('Categoria criada com sucesso!');
      setIsCategoryModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!window.confirm(`Deseja realmente deletar a categoria "${categoryName}"?`)) return;
    
    try {
      setActionError(null);
      await deleteCategory(categoryId);
      setActionSuccess('Categoria deletada com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  return (
    <MainLayout title="Inventário">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventário</h1>
            <p className="text-gray-600 mt-1">Gerencie os itens do inventário</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={() => setShowCategories(!showCategories)}
            >
              <Tag size={20} className="mr-2" />
              {showCategories ? 'Ver Itens' : 'Categorias'}
            </Button>
            <Button onClick={() => showCategories ? setIsCategoryModalOpen(true) : setIsCreateModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              {showCategories ? 'Nova Categoria' : 'Novo Item'}
            </Button>
          </div>
        </div>

      {actionSuccess && <Alert type="success">{actionSuccess}</Alert>}
      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {!showCategories ? (
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

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria cadastrada</h3>
              <p className="text-gray-600 mb-4">Você precisa criar categorias antes de adicionar itens</p>
              <Button onClick={() => { setShowCategories(true); setIsCategoryModalOpen(true); }}>
                <Plus size={20} className="mr-2" />
                Criar Primeira Categoria
              </Button>
            </div>
          ) : (
            <Table
              data={filteredItems}
              columns={columns}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onView={handleView}
              isLoading={isLoading}
            />
          )}
        </Card>
      ) : (
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Categorias de Inventário</h2>
            <p className="text-sm text-gray-600">Gerencie as categorias dos itens</p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria cadastrada</h3>
              <p className="text-gray-600 mb-4">Crie sua primeira categoria para começar</p>
              <Button onClick={() => setIsCategoryModalOpen(true)}>
                <Plus size={20} className="mr-2" />
                Criar Primeira Categoria
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category: any) => (
                <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Tag size={20} className="text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    {items.filter(item => item.category?.id === category.id).length} itens
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

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
                <p className="text-sm font-medium text-gray-500">Quantidade em Estoque</p>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <Package size={16} className="text-gray-400" />
                  {selectedItem.quantityInStock} {selectedItem.unitOfMeasure}
                  {selectedItem.quantityInStock < selectedItem.minimumStock && (
                    <AlertCircle size={16} className="text-yellow-500" />
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Estoque Mínimo</p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedItem.minimumStock} {selectedItem.unitOfMeasure}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Condição</p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedItem.condition === 'NEW' ? 'Novo' : 
                   selectedItem.condition === 'GOOD' ? 'Bom' : 
                   selectedItem.condition === 'WORN' ? 'Usado' : 'Danificado'}
                </p>
              </div>

              {selectedItem.location && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Localização</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.location}</p>
                </div>
              )}

              {selectedItem.supplier && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Fornecedor</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.supplier}</p>
                </div>
              )}

              {selectedItem.purchasePrice && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Preço de Compra</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.purchasePrice.toLocaleString()} Kz</p>
                </div>
              )}
            </div>

            {selectedItem.description && (
              <div>
                <p className="text-sm font-medium text-gray-500">Descrição</p>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.description}</p>
              </div>
            )}

            {selectedItem.observations && (
              <div>
                <p className="text-sm font-medium text-gray-500">Observações</p>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.observations}</p>
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

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Nova Categoria"
      >
        <Form
          fields={categoryFormFields}
          onSubmit={handleCreateCategory}
          submitLabel="Criar Categoria"
          onCancel={() => setIsCategoryModalOpen(false)}
        />
      </Modal>
      </div>
    </MainLayout>
  );
};
