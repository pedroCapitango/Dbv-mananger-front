import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import type { EventResponseDto, CreateEventDto, UpdateEventDto } from '../types';

interface UseEventsOptions {
  eventType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  autoFetch?: boolean;
}

export const useEvents = (options: UseEventsOptions = { autoFetch: true }) => {
  const [events, setEvents] = useState<EventResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didInit = useRef(false);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filters = {
        eventType: options.eventType,
        status: options.status,
        startDate: options.startDate,
        endDate: options.endDate,
      };

      const data = await apiService.getEvents(filters);
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar eventos');
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!options.autoFetch) return;
    if (didInit.current) return;
    didInit.current = true;
    fetchEvents();
  }, [options.autoFetch]);

  const createEvent = async (data: CreateEventDto) => {
    try {
      setError(null);
      const newEvent = await apiService.createEvent(data);
      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar evento');
      throw err;
    }
  };

  const updateEvent = async (id: string, data: UpdateEventDto) => {
    try {
      setError(null);
      const updatedEvent = await apiService.updateEvent(id, data);
      setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
      return updatedEvent;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar evento');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar evento');
      throw err;
    }
  };

  const getEventById = async (id: string) => {
    try {
      setError(null);
      return await apiService.getEvent(id);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar evento');
      throw err;
    }
  };

  const getEventStatistics = async (eventId: string) => {
    try {
      setError(null);
      return await apiService.getEventStatistics(eventId);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar estatísticas');
      throw err;
    }
  };

  const refreshEvents = () => {
    fetchEvents();
  };

  return {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventStatistics,
    refreshEvents,
    fetchEvents,
    refetch: fetchEvents,
  };
};
