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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar progresso');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const createProgress = async (data: any) => {
    try {
      const newProgress = await apiService.createMemberProgress(data);
      setProgress([...progress, newProgress]);
      return newProgress;
    } catch (err) {
      throw err;
    }
  };

  const getMemberSpecialties = async (memberId: string): Promise<MemberSpecialtyResponseDto[]> => {
    try {
      return await apiService.getMemberSpecialties(memberId);
    } catch (err) {
      throw err;
    }
  };

  const createMemberSpecialty = async (data: any) => {
    try {
      const newSpecialty = await apiService.createMemberSpecialty(data);
      return newSpecialty;
    } catch (err) {
      throw err;
    }
  };

  return {
    progress,
    isLoading,
    error,
    refetch: fetchProgress,
    createProgress,
    getMemberSpecialties,
    createMemberSpecialty,
  };
};
