import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { EventParticipantDto, AddParticipantDto, UpdateParticipantStatusDto } from '../types';

export const useEventParticipants = (eventId: string | null) => {
  const [participants, setParticipants] = useState<EventParticipantDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = async () => {
    if (!eventId) {
      setParticipants([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getEventParticipants(eventId);
      setParticipants(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar participantes');
      console.error('Erro ao buscar participantes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchParticipants();
    }
  }, [eventId]);

  const addParticipant = async (data: AddParticipantDto) => {
    if (!eventId) throw new Error('Event ID não fornecido');

    try {
      setError(null);
      const newParticipant = await apiService.addEventParticipant(eventId, data);
      setParticipants(prev => [...prev, newParticipant]);
      return newParticipant;
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar participante');
      throw err;
    }
  };

  const updateParticipantStatus = async (memberId: string, data: UpdateParticipantStatusDto) => {
    if (!eventId) throw new Error('Event ID não fornecido');

    try {
      setError(null);
      const updatedParticipant = await apiService.updateParticipantStatus(eventId, memberId, data);
      setParticipants(prev =>
        prev.map(p => p.memberId === memberId ? updatedParticipant : p)
      );
      return updatedParticipant;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status do participante');
      throw err;
    }
  };

  const removeParticipant = async (memberId: string) => {
    if (!eventId) throw new Error('Event ID não fornecido');

    try {
      setError(null);
      await apiService.removeEventParticipant(eventId, memberId);
      setParticipants(prev => prev.filter(p => p.memberId !== memberId));
    } catch (err: any) {
      setError(err.message || 'Erro ao remover participante');
      throw err;
    }
  };

  const refreshParticipants = () => {
    fetchParticipants();
  };

  return {
    participants,
    isLoading,
    error,
    addParticipant,
    updateParticipantStatus,
    removeParticipant,
    refreshParticipants,
  };
};
