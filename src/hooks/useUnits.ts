import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { UnitResponseDto, CreateUnitDto } from '../types';

export const useUnits = () => {
  const [units, setUnits] = useState<UnitResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getUnits();
      setUnits(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar unidades';
      setError(errorMessage);
      console.error('Erro ao buscar unidades:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createUnit = async (data: CreateUnitDto) => {
    try {
      const newUnit = await apiService.createUnit(data);
      setUnits(prev => [...prev, newUnit]);
      return newUnit;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar unidade';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUnit = async (id: string, data: Partial<CreateUnitDto>) => {
    try {
      const updatedUnit = await apiService.updateUnit(id, data);
      setUnits(prev =>
        prev.map(unit => (unit.id === id ? updatedUnit : unit))
      );
      return updatedUnit;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar unidade';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      await apiService.deleteUnit(id);
      setUnits(prev => prev.filter(unit => unit.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar unidade';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return {
    units,
    isLoading,
    error,
    refetch: fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
  };
};
