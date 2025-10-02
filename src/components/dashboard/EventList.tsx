import React from 'react';
import type { EventResponseDto } from '../../types';
import { Card } from '../ui/Card';
import { STATUS_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

interface EventListProps {
  events: EventResponseDto[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: 'Agendado',
      ongoing: 'Em andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition">
          Ver todos
        </button>
      </div>
      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Nenhum evento próximo</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(event.startDate)} · {event._count?.participants || 0} participantes
                </p>
                {event.location && (
                  <p className="text-xs text-gray-500 mt-1">📍 {event.location}</p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {getStatusLabel(event.status)}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
