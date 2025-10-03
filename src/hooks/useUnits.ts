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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar unidades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const createUnit = async (data: CreateUnitDto) => {
    try {
      const newUnit = await apiService.createUnit(data);
      setUnits([...units, newUnit]);
      return newUnit;
    } catch (err) {
      throw err;
    }
  };

  const updateUnit = async (id: string, data: Partial<CreateUnitDto>) => {
    try {
      const updatedUnit = await apiService.updateUnit(id, data);
      setUnits(units.map(u => u.id === id ? updatedUnit : u));
      return updatedUnit;
    } catch (err) {
      throw err;
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      await apiService.deleteUnit(id);
      setUnits(units.filter(u => u.id !== id));
    } catch (err) {
      throw err;
    }
  };

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
