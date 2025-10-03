import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { MemberProgressResponseDto, MemberSpecialtyResponseDto } from '../types';

export const useProgress = () => {
  const [progress, setProgress] = useState<MemberProgressResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getMemberProgress();
      setProgress(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar progresso');
      console.error('Erro ao buscar progresso:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProgress = async (data: any) => {
    try {
      const newProgress = await apiService.createMemberProgress(data);
      setProgress(prev => [...prev, newProgress]);
      return newProgress;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar progresso';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getMemberSpecialties = async (memberId: string) => {
    try {
      return await apiService.getMemberSpecialties(memberId);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar especialidades';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createSpecialty = async (data: any) => {
    try {
      const newSpecialty = await apiService.createMemberSpecialty(data);
      return newSpecialty;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar especialidade';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    progress,
    isLoading,
    error,
    refetch: fetchProgress,
    createProgress,
    getMemberSpecialties,
    createSpecialty,
  };
};
