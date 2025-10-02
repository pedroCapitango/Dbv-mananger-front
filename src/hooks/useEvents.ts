import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { EventResponseDto, CreateEventDto, UpdateEventDto } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<EventResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar eventos');
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (data: CreateEventDto) => {
    try {
      const newEvent = await apiService.createEvent(data);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateEvent = async (id: string, data: UpdateEventDto) => {
    try {
      const updatedEvent = await apiService.updateEvent(id, data);
      setEvents(prev =>
        prev.map(event => (event.id === id ? updatedEvent : event))
      );
      return updatedEvent;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await apiService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addParticipant = async (eventId: string, memberId: string) => {
    try {
      await apiService.addEventParticipant(eventId, memberId);
      await fetchEvents(); // Atualiza a lista
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao adicionar participante';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeParticipant = async (eventId: string, memberId: string) => {
    try {
      await apiService.removeEventParticipant(eventId, memberId);
      await fetchEvents(); // Atualiza a lista
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao remover participante';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    addParticipant,
    removeParticipant,
  };
};
