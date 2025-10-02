import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { MemberResponseDto, CreateMemberDto, UpdateMemberDto } from '../types';

export const useMembers = () => {
  const [members, setMembers] = useState<MemberResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getMembers();
      setMembers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar membros');
      console.error('Erro ao buscar membros:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createMember = async (data: CreateMemberDto) => {
    try {
      const newMember = await apiService.createMember(data);
      setMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar membro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateMember = async (id: string, data: UpdateMemberDto) => {
    try {
      const updatedMember = await apiService.updateMember(id, data);
      setMembers(prev =>
        prev.map(member => (member.id === id ? updatedMember : member))
      );
      return updatedMember;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar membro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await apiService.deleteMember(id);
      setMembers(prev => prev.filter(member => member.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar membro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const restoreMember = async (id: string) => {
    try {
      const restoredMember = await apiService.restoreMember(id);
      setMembers(prev => [...prev, restoredMember]);
      return restoredMember;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao restaurar membro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    isLoading,
    error,
    refetch: fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    restoreMember,
  };
};
