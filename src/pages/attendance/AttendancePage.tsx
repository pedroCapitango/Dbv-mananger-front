import React, { useState } from 'react';
import { Plus, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { useAttendance } from '../../hooks/useAttendance';
import { useMembers } from '../../hooks/useMembers';
import { useEvents } from '../../hooks/useEvents';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { RecordAttendanceDto } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AttendancePage: React.FC = () => {
  const { attendances, statistics, isLoading, error, recordAttendance, bulkRecordAttendance, getEventAttendance } = useAttendance();
  const { members } = useMembers();
  const { events } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventAttendances, setEventAttendances] = useState<any[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const attendanceFormFields: FormField[] = [
    { 
      name: 'memberId', 
      label: 'Membro', 
      type: 'select', 
      required: true,
      options: members.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` }))
    },
    { 
      name: 'eventId', 
      label: 'Evento', 
      type: 'select', 
      required: true,
      options: events.map(e => ({ value: e.id, label: e.name }))
    },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select', 
      required: true,
      options: [
        { value: 'present', label: 'Presente' },
        { value: 'absent', label: 'Ausente' },
        { value: 'late', label: 'Atrasado' },
        { value: 'excused', label: 'Justificado' }
      ]
    },
    { name: 'notes', label: 'Observações', type: 'textarea', placeholder: 'Observações sobre a presença...' },
  ];

  const handleLoadEventAttendance = async () => {
    if (!selectedEventId) return;
    
    try {
      const data = await getEventAttendance(selectedEventId);
      setEventAttendances(data);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleRecordAttendance = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      await recordAttendance(data as RecordAttendanceDto);
      setActionSuccess('Presença registrada com sucesso!');
      setIsModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleBulkAttendance = async (data: Record<string, any>) => {
    if (!data.eventId || !data.status) {
      setActionError('Evento e status são obrigatórios');
      return;
    }

    try {
      setActionError(null);
      const bulkData = {
        eventId: data.eventId,
        memberIds: members.map(m => m.id),
        status: data.status,
      };
      
      await bulkRecordAttendance(bulkData);
      setActionSuccess('Presenças registradas em massa com sucesso!');
      setIsBulkModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'absent':
        return <XCircle className="text-red-500" size={20} />;
      case 'late':
        return <Clock className="text-yellow-500" size={20} />;
      case 'excused':
        return <CheckCircle className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      present: 'Presente',
      absent: 'Ausente',
      late: 'Atrasado',
      excused: 'Justificado'
    };
    return labels[status] || status;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Presenças</h1>
          <p className="text-gray-600 mt-1">Gerencie o registro de presenças em eventos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsBulkModalOpen(true)} icon={Users} variant="secondary">
            Registro em Massa
          </Button>
          <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
            Registrar Presença
          </Button>
        </div>
      </div>

      {actionSuccess && <Alert variant="success">{actionSuccess}</Alert>}
      {actionError && <Alert variant="error">{actionError}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statistics && (
          <>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Registros</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {statistics.totalRecords || attendances.length}
                  </p>
                </div>
                <Users className="text-blue-500" size={32} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Presentes</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {statistics.presentCount || attendances.filter(a => a.status === 'present').length}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ausentes</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {statistics.absentCount || attendances.filter(a => a.status === 'absent').length}
                  </p>
                </div>
                <XCircle className="text-red-500" size={32} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Presença</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {statistics.attendanceRate 
                      ? `${Math.round(statistics.attendanceRate)}%`
                      : attendances.length > 0 
                        ? `${Math.round((attendances.filter(a => a.status === 'present').length / attendances.length) * 100)}%`
                        : '0%'
                    }
                  </p>
                </div>
                <Clock className="text-blue-500" size={32} />
              </div>
            </Card>
          </>
        )}
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Presenças por Evento</h2>
        <div className="mb-4 flex gap-2">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um evento</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
          <Button onClick={handleLoadEventAttendance} disabled={!selectedEventId}>
            Carregar
          </Button>
        </div>

        {eventAttendances.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eventAttendances.map((attendance) => (
                  <tr key={attendance.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendance.member?.firstName} {attendance.member?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(attendance.status)}
                        <span className="text-sm">{getStatusLabel(attendance.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(attendance.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {attendance.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Presença"
      >
        <Form
          fields={attendanceFormFields}
          onSubmit={handleRecordAttendance}
          submitLabel="Registrar"
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Registro em Massa"
      >
        <Form
          fields={[
            { 
              name: 'eventId', 
              label: 'Evento', 
              type: 'select', 
              required: true,
              options: events.map(e => ({ value: e.id, label: e.name }))
            },
            { 
              name: 'status', 
              label: 'Status (para todos)', 
              type: 'select', 
              required: true,
              options: [
                { value: 'present', label: 'Presente' },
                { value: 'absent', label: 'Ausente' },
              ]
            },
          ]}
          onSubmit={handleBulkAttendance}
          submitLabel="Registrar Todos"
          onCancel={() => setIsBulkModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
