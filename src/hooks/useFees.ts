import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import type {
  FeeResponseDto,
  CreateFeeDto,
  GenerateFeesDto,
  PayFeeDto,
} from '../types';

interface UseFeesOptions {
  memberId?: string;
  status?: string;
}

export const useFees = (options?: UseFeesOptions) => {
  const [fees, setFees] = useState<FeeResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = apiService.getToken();
      if (!token) {
        setError('Usuário não autenticado. Por favor faça login.');
        return;
      }

      const data = await apiService.getMembershipFees(options);
      setFees(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar cotas');
      console.error('Erro ao buscar cotas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createFee = async (data: CreateFeeDto) => {
    try {
      const newFee = await apiService.createMembershipFee(data);
      setFees(prev => [newFee, ...prev]);
      return newFee;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar cota';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const generateFees = async (data: GenerateFeesDto) => {
    try {
      const result = await apiService.generateMembershipFees(data);
      await fetchFees(); // Recarrega a lista
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao gerar cotas';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const payFee = async (id: string, data: PayFeeDto) => {
    try {
      const updatedFee = await apiService.payMembershipFee(id, data);
      setFees(prev =>
        prev.map(fee => (fee.id === id ? updatedFee : fee))
      );
      return updatedFee;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao registrar pagamento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const cancelFee = async (id: string) => {
    try {
      const updatedFee = await apiService.cancelMembershipFee(id);
      setFees(prev =>
        prev.map(fee => (fee.id === id ? updatedFee : fee))
      );
      return updatedFee;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao cancelar cota';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetchFees();
  }, [options?.memberId, options?.status]);

  return {
    fees,
    isLoading,
    error,
    refetch: fetchFees,
    createFee,
    generateFees,
    payFee,
    cancelFee,
  };
};
