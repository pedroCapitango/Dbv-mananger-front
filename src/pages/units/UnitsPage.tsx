import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Layers, Plus, Search, Edit, Trash2, X, Eye, Users, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useUnits } from '../../hooks/useUnits';
import { useLeaders } from '../../hooks/useLeaders';
import type { UnitResponseDto, CreateUnitDto } from '../../types';

export const UnitsPage: React.FC = () => {
  const { units, isLoading, error, createUnit, updateUnit, deleteUnit, refreshUnits } = useUnits();
  const { leaders, isLoading: leadersLoading } = useLeaders();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitResponseDto | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<CreateUnitDto>({
    name: '',
    description: '',
    gender: 'MASCULINO',
    minCapacity: 8,
    maxCapacity: 10,
    leaderUserId: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      gender: 'MASCULINO',
      minCapacity: 8,
      maxCapacity: 10,
      leaderUserId: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEdit = (unit: UnitResponseDto) => {
    setSelectedUnit(unit);
    setFormData({
      name: unit.name,
      description: unit.description || '',
      gender: unit.gender,
      minCapacity: unit.minCapacity,
      maxCapacity: unit.maxCapacity,
      leaderUserId: unit.leaderUserId || '',
    });
    setShowEditModal(true);
  };

  const handleView = (unit: UnitResponseDto) => {
    setSelectedUnit(unit);
    setShowViewModal(true);
  };

  const handleDeleteClick = (unit: UnitResponseDto) => {
    setSelectedUnit(unit);
    setShowDeleteModal(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.name.length < 3) {
      setErrorMessage('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    if ((formData.minCapacity || 0) < 1) {
      setErrorMessage('Capacidade mínima deve ser no mínimo 1');
      return;
    }

    if ((formData.maxCapacity || 0) < (formData.minCapacity || 0)) {
      setErrorMessage('Capacidade máxima deve ser maior ou igual à mínima');
      return;
    }

    try {
      const dataToSend = { ...formData };
      if (!dataToSend.leaderUserId) {
        delete dataToSend.leaderUserId;
      }

      await createUnit(dataToSend);
      setSuccessMessage('Unidade criada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowCreateModal(false);
      resetForm();
      refreshUnits();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao criar unidade');
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;

    setErrorMessage('');

    if (formData.name.length < 3) {
      setErrorMessage('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    try {
      const dataToSend = { ...formData };
      if (!dataToSend.leaderUserId) {
        delete dataToSend.leaderUserId;
      }

      await updateUnit(selectedUnit.id, dataToSend);
      setSuccessMessage('Unidade atualizada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowEditModal(false);
      setSelectedUnit(null);
      resetForm();
      refreshUnits();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao atualizar unidade');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUnit) return;

    try {
      await deleteUnit(selectedUnit.id);
      setSuccessMessage('Unidade excluída com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setSelectedUnit(null);
      refreshUnits();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao excluir unidade');
      setShowDeleteModal(false);
    }
  };

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGenderLabel = (gender: string) => {
    const labels: Record<string, string> = {
      MASCULINO: 'Masculino',
      FEMININO: 'Feminino',
      MISTO: 'Misto',
    };
    return labels[gender] || gender;
  };

  const getGenderColor = (gender: string) => {
    const colors: Record<string, string> = {
      MASCULINO: 'bg-blue-100 text-blue-800',
      FEMININO: 'bg-pink-100 text-pink-800',
      MISTO: 'bg-purple-100 text-purple-800',
    };
    return colors[gender] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout title="Unidades">
      <div className="p-6">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <CheckCircle size={20} />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <XCircle size={20} />
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gerenciar Unidades</h1>
            <p className="text-gray-600 mt-1">
              Organize os desbravadores em unidades por gênero e capacidade
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Nova Unidade
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar unidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Carregando unidades...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Erro ao carregar unidades</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!isLoading && !error && filteredUnits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <div key={unit.id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Layers size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{unit.name}</h3>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${getGenderColor(unit.gender)}`}>
                          {getGenderLabel(unit.gender)}
                        </span>
                      </div>
                    </div>
                    <div>
                      {unit.isActive ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <XCircle size={20} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {unit.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {unit.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users size={16} />
                        Capacidade
                      </span>
                      <span className="font-medium text-gray-800">
                        {unit._count?.members || 0} / {unit.maxCapacity}
                        <span className="text-gray-500 ml-1">
                          (mín: {unit.minCapacity})
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Shield size={16} />
                        Líder
                      </span>
                      <span className="font-medium text-gray-800 truncate ml-2">
                        {unit.leader ? unit.leader.fullName : 'Sem líder'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleView(unit)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                    <button
                      onClick={() => handleEdit(unit)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(unit)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredUnits.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Layers size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {searchTerm ? 'Nenhuma unidade encontrada' : 'Nenhuma unidade cadastrada'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? 'Tente buscar com outros termos'
                : 'Comece criando sua primeira unidade'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Criar Primeira Unidade
              </button>
            )}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <ModalForm
            title="Criar Nova Unidade"
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmitCreate}
            onClose={() => {
              setShowCreateModal(false);
              resetForm();
              setErrorMessage('');
            }}
            errorMessage={errorMessage}
            leaders={leaders}
            leadersLoading={leadersLoading}
            submitLabel="Criar Unidade"
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedUnit && (
          <ModalForm
            title="Editar Unidade"
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmitEdit}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUnit(null);
              resetForm();
              setErrorMessage('');
            }}
            errorMessage={errorMessage}
            leaders={leaders}
            leadersLoading={leadersLoading}
            submitLabel="Salvar Alterações"
          />
        )}

        {/* View Modal */}
        {showViewModal && selectedUnit && (
          <ViewModal
            unit={selectedUnit}
            onClose={() => {
              setShowViewModal(false);
              setSelectedUnit(null);
            }}
            getGenderLabel={getGenderLabel}
            getGenderColor={getGenderColor}
          />
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedUnit && (
          <DeleteModal
            unit={selectedUnit}
            onConfirm={handleConfirmDelete}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedUnit(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

// Modal Components
interface ModalFormProps {
  title: string;
  formData: CreateUnitDto;
  setFormData: (data: CreateUnitDto) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  errorMessage: string;
  leaders: any[];
  leadersLoading: boolean;
  submitLabel: string;
}

const ModalForm: React.FC<ModalFormProps> = ({
  title,
  formData,
  setFormData,
  onSubmit,
  onClose,
  errorMessage,
  leaders,
  leadersLoading,
  submitLabel,
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Unidade *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Ex: Águias, Leões, Rosas..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição (opcional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            rows={3}
            placeholder="Descrição da unidade..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gênero *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            required
          >
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="MISTO">Misto</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidade Mínima *
            </label>
            <input
              type="number"
              value={formData.minCapacity}
              onChange={(e) => setFormData({ ...formData, minCapacity: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidade Máxima *
            </label>
            <input
              type="number"
              value={formData.maxCapacity}
              onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min="1"
              max="15"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Líder da Unidade (opcional)
          </label>
          {leadersLoading ? (
            <div className="text-sm text-gray-500">Carregando conselheiros...</div>
          ) : (
            <select
              value={formData.leaderUserId}
              onChange={(e) => setFormData({ ...formData, leaderUserId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Sem líder</option>
              {leaders.map((leader) => (
                <option key={leader.id} value={leader.id}>
                  {leader.name} ({leader.role})
                </option>
              ))}
            </select>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  </div>
);

interface ViewModalProps {
  unit: UnitResponseDto;
  onClose: () => void;
  getGenderLabel: (gender: string) => string;
  getGenderColor: (gender: string) => string;
}

const ViewModal: React.FC<ViewModalProps> = ({ unit, onClose, getGenderLabel, getGenderColor }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
        <h2 className="text-xl font-bold text-gray-800">Detalhes da Unidade</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Nome</h3>
          <p className="text-lg font-semibold text-gray-800">{unit.name}</p>
        </div>

        {unit.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
            <p className="text-gray-700">{unit.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Gênero</h3>
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${getGenderColor(unit.gender)}`}>
              {getGenderLabel(unit.gender)}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
            <div className="flex items-center gap-2">
              {unit.isActive ? (
                <>
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-green-700 font-medium">Ativa</span>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-gray-400" />
                  <span className="text-gray-500 font-medium">Inativa</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Capacidade Mínima</h3>
            <p className="text-lg font-semibold text-gray-800">{unit.minCapacity} membros</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Capacidade Máxima</h3>
            <p className="text-lg font-semibold text-gray-800">{unit.maxCapacity} membros</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Membros Atuais</h3>
          <p className="text-lg font-semibold text-gray-800">{unit._count?.members || 0} membros</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Líder</h3>
          {unit.leader ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield size={20} className="text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">{unit.leader.fullName}</p>
                <p className="text-sm text-gray-600">{unit.leader.email}</p>
                <p className="text-xs text-gray-500">{unit.leader.role}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Sem líder designado</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="text-gray-500 mb-1">Criada em</h3>
            <p className="text-gray-800">{new Date(unit.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>

          <div>
            <h3 className="text-gray-500 mb-1">Atualizada em</h3>
            <p className="text-gray-800">{new Date(unit.updatedAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
);

interface DeleteModalProps {
  unit: UnitResponseDto;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ unit, onConfirm, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Excluir Unidade</h2>
            <p className="text-gray-600 mt-1">Esta ação não pode ser desfeita</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          Tem certeza que deseja excluir a unidade{' '}
          <strong className="font-semibold">{unit.name}</strong>?
          {unit._count && unit._count.members > 0 && (
            <span className="block mt-2 text-red-600 font-medium">
              ⚠️ Esta unidade possui {unit._count.members} membro(s). 
              Remova os membros antes de excluir a unidade.
            </span>
          )}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={unit._count && unit._count.members > 0}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
);
