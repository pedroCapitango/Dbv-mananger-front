import React, { useState } from 'react';
import { Plus, Search, Calendar, MapPin, Users } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { EventResponseDto, CreateEventDto } from '../../types';
import { formatDate } from '../../utils/formatters';

const eventFormFields: FormField[] = [
  { name: 'title', label: 'Título do Evento', type: 'text', required: true, placeholder: 'Acampamento de Inverno' },
  { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descrição detalhada do evento...', rows: 4 },
  { 
    name: 'type', 
    label: 'Tipo de Evento', 
    type: 'select', 
    required: true,
    options: [
      { value: 'meeting', label: 'Reunião' },
      { value: 'campamento', label: 'Acampamento' },
      { value: 'training', label: 'Treinamento' },
      { value: 'social', label: 'Social' },
      { value: 'service', label: 'Serviço Comunitário' },
      { value: 'other', label: 'Outro' }
    ]
  },
  { name: 'startDate', label: 'Data de Início', type: 'datetime-local', required: true },
  { name: 'endDate', label: 'Data de Término', type: 'datetime-local' },
  { name: 'location', label: 'Local', type: 'text', placeholder: 'Serra da Leba, Huíla' },
  { name: 'maxParticipants', label: 'Máximo de Participantes', type: 'number', placeholder: '50' },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { value: 'scheduled', label: 'Agendado' },
      { value: 'ongoing', label: 'Em Andamento' },
      { value: 'completed', label: 'Concluído' },
      { value: 'cancelled', label: 'Cancelado' }
    ]
  },
];

export const EventsPage: React.FC = () => {
  const { events, isLoading, error, createEvent, updateEvent, deleteEvent } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResponseDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: 'Agendado',
      ongoing: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Evento', 
      render: (e: EventResponseDto) => (
        <div>
          <div className="font-medium text-gray-900">{e.title}</div>
          <div className="text-sm text-gray-500">{e.type}</div>
        </div>
      )
    },
    { 
      key: 'startDate', 
      label: 'Data', 
      render: (e: EventResponseDto) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span>{formatDate(e.startDate)}</span>
        </div>
      )
    },
    { 
      key: 'location', 
      label: 'Local', 
      render: (e: EventResponseDto) => e.location ? (
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{e.location}</span>
        </div>
      ) : '-'
    },
    { 
      key: 'participants', 
      label: 'Participantes', 
      render: (e: EventResponseDto) => (
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-400" />
          <span>{e._count?.participants || 0}</span>
          {e.maxParticipants && <span className="text-gray-400">/ {e.maxParticipants}</span>}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (e: EventResponseDto) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(e.status)}`}>
          {getStatusLabel(e.status)}
        </span>
      )
    },
  ];

  const handleCreate = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      await createEvent(data as CreateEventDto);
      setActionSuccess('Evento criado com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleEdit = async (data: Record<string, any>) => {
    if (!selectedEvent) return;
    try {
      setActionError(null);
      await updateEvent(selectedEvent.id, data as CreateEventDto);
      setActionSuccess('Evento atualizado com sucesso!');
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (event: EventResponseDto) => {
    if (!window.confirm(`Deseja realmente deletar o evento "${event.title}"?`)) return;
    
    try {
      setActionError(null);
      await deleteEvent(event.id);
      setActionSuccess('Evento deletado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const openEditModal = (event: EventResponseDto) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleView = (event: EventResponseDto) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleManageParticipants = (event: EventResponseDto) => {
    setSelectedEvent(event);
    setIsParticipantsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600 mt-1">Gerencie os eventos do clube</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Novo Evento
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
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <Table
          data={filteredEvents}
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
        title="Novo Evento"
      >
        <Form
          fields={eventFormFields}
          onSubmit={handleCreate}
          submitLabel="Criar Evento"
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Editar Evento"
      >
        {selectedEvent && (
          <Form
            fields={eventFormFields}
            onSubmit={handleEdit}
            submitLabel="Salvar Alterações"
            initialValues={{
              ...selectedEvent,
              startDate: selectedEvent.startDate.slice(0, 16),
              endDate: selectedEvent.endDate?.slice(0, 16),
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedEvent(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Detalhes do Evento"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Título</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{selectedEvent.title}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p className="mt-1 text-sm text-gray-900">{selectedEvent.type}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                    {getStatusLabel(selectedEvent.status)}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Data de Início</p>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  {formatDate(selectedEvent.startDate)}
                </p>
              </div>

              {selectedEvent.endDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Término</p>
                  <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    {formatDate(selectedEvent.endDate)}
                  </p>
                </div>
              )}

              {selectedEvent.location && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Local</p>
                  <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    {selectedEvent.location}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500">Participantes</p>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  {selectedEvent._count?.participants || 0}
                  {selectedEvent.maxParticipants && ` / ${selectedEvent.maxParticipants}`}
                </p>
              </div>
            </div>

            {selectedEvent.description && (
              <div>
                <p className="text-sm font-medium text-gray-500">Descrição</p>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedEvent.description}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedEvent);
                }}
              >
                Editar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleManageParticipants(selectedEvent);
                }}
              >
                Gerir Participantes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isParticipantsModalOpen}
        onClose={() => {
          setIsParticipantsModalOpen(false);
          setSelectedEvent(null);
        }}
        title={`Participantes - ${selectedEvent?.title || ''}`}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Total de Participantes</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedEvent._count?.participants || 0}
                    {selectedEvent.maxParticipants && (
                      <span className="text-lg text-gray-500"> / {selectedEvent.maxParticipants}</span>
                    )}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  // TODO: Implementar adição de participante
                  setActionSuccess('Funcionalidade em desenvolvimento');
                  setTimeout(() => setActionSuccess(null), 2000);
                }}
              >
                <Plus size={16} className="mr-1" />
                Adicionar
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500 text-center">
                Lista de participantes será exibida aqui
              </p>
              <p className="text-xs text-gray-400 text-center mt-2">
                Funcionalidade completa em desenvolvimento
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
