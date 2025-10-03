import React, { useState } from 'react';
import { Plus, CheckCircle, XCircle, Clock, FileText, BarChart3 } from 'lucide-react';
import { useAttendance } from '../../hooks/useAttendance';
import { useEvents } from '../../hooks/useEvents';
import { useMembers } from '../../hooks/useMembers';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import type { AttendanceResponseDto, RecordAttendanceDto } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AttendancePage: React.FC = () => {
  const { attendances, statistics, isLoading, error, recordAttendance, recordBulkAttendance } = useAttendance();
  const { events } = useEvents();
  const { members } = useMembers();
  
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const attendanceFormFields: FormField[] = [
    {
      name: 'eventId',
      label: 'Evento',
      type: 'select',
      required: true,
      options: events.map(e => ({ value: e.id, label: e.title })),
    },
    {
      name: 'memberId',
      label: 'Membro',
      type: 'select',
      required: true,
      options: members.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` })),
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'present', label: '✓ Presente' },
        { value: 'absent', label: '✗ Ausente' },
        { value: 'late', label: '⏰ Atrasado' },
        { value: 'excused', label: '📝 Justificado' },
      ],
    },
    { name: 'notes', label: 'Observações', type: 'textarea', placeholder: 'Notas adicionais...', rows: 3 },
  ];

  const bulkFormFields: FormField[] = [
    {
      name: 'eventId',
      label: 'Evento',
      type: 'select',
      required: true,
      options: events.map(e => ({ value: e.id, label: e.title })),
    },
  ];

  const handleRecord = async (formData: Record<string, any>) => {
    try {
      await recordAttendance(formData as RecordAttendanceDto);
      setIsRecordModalOpen(false);
      setActionSuccess('Presença registrada com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao registrar presença');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleBulkRecord = async (formData: Record<string, any>) => {
    try {
      const eventId = formData.eventId;
      const attendanceData = members.map(member => ({
        eventId,
        memberId: member.id,
        status: 'present' as const,
      }));
      
      await recordBulkAttendance({ attendances: attendanceData });
      setIsBulkModalOpen(false);
      setActionSuccess('Presenças registradas em massa com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao registrar presenças');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'excused':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'absent':
        return 'Ausente';
      case 'late':
        return 'Atrasado';
      case 'excused':
        return 'Justificado';
      default:
        return status;
    }
  };

  const columns = [
    {
      key: 'event',
      label: 'Evento',
      render: (attendance: AttendanceResponseDto) => {
        const event = events.find(e => e.id === attendance.eventId);
        return event?.title || attendance.eventId;
      },
      sortable: true,
    },
    {
      key: 'member',
      label: 'Membro',
      render: (attendance: AttendanceResponseDto) => {
        const member = members.find(m => m.id === attendance.memberId);
        return member ? `${member.firstName} ${member.lastName}` : attendance.memberId;
      },
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (attendance: AttendanceResponseDto) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(attendance.status)}
          <span>{getStatusLabel(attendance.status)}</span>
        </div>
      ),
    },
    {
      key: 'notes',
      label: 'Observações',
      render: (attendance: AttendanceResponseDto) => attendance.notes || '-',
    },
    {
      key: 'date',
      label: 'Data',
      render: (attendance: AttendanceResponseDto) => formatDate(attendance.recordedAt),
      sortable: true,
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
          <CheckCircle className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Presenças</h1>
            <p className="text-sm text-gray-600">Gerencie a presença dos membros</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsBulkModalOpen(true)}
          >
            <BarChart3 className="w-5 h-5" />
            Registro em Massa
          </Button>
          <Button
            onClick={() => setIsRecordModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Registrar Presença
          </Button>
        </div>
      </div>

      {actionSuccess && <Alert type="success" message={actionSuccess} />}
      {actionError && <Alert type="error" message={actionError} />}

      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Presença</p>
                <p className="text-2xl font-bold text-green-600">
                  {statistics.attendanceRate ? `${statistics.attendanceRate}%` : 'N/A'}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Presenças</p>
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.totalPresent || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ausências</p>
                <p className="text-2xl font-bold text-red-600">
                  {statistics.totalAbsent || 0}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Justificados</p>
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.totalExcused || 0}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </div>
      )}

      <Table
        data={attendances}
        columns={columns}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Registrar Presença"
      >
        <Form
          fields={attendanceFormFields}
          onSubmit={handleRecord}
          submitLabel="Registrar"
        />
      </Modal>

      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Registro em Massa"
      >
        <div className="space-y-4">
          <Alert type="info" message="Todos os membros serão marcados como PRESENTES no evento selecionado." />
          <Form
            fields={bulkFormFields}
            onSubmit={handleBulkRecord}
            submitLabel="Registrar Todos"
          />
        </div>
      </Modal>
    </div>
  );
};
