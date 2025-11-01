import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import type { UnitResponseDto, CreateUnitDto } from '../types';

interface UseUnitsOptions {
  requireAuth?: boolean; // Se true, só busca com token. Se false, busca mesmo sem token
}

export const useUnits = (options: UseUnitsOptions = { requireAuth: true }) => {
  const [units, setUnits] = useState<UnitResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didInit = useRef(false);

  const fetchUnits = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token && options.requireAuth) {
      console.log('⚠️ useUnits: Sem token, pulando fetch de unidades');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      // Se não requer autenticação, usa o endpoint público
      const data = options.requireAuth 
        ? await apiService.getUnits()
        : await apiService.getUnitsPublic();
      setUnits(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar unidades');
      console.error('Erro ao buscar unidades:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetchUnits();
  }, []);

  const createUnit = async (data: CreateUnitDto) => {
    try {
      setError(null);
      const newUnit = await apiService.createUnit(data);
      setUnits(prev => [...prev, newUnit]);
      return newUnit;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar unidade');
      throw err;
    }
  };

  const updateUnit = async (id: string, data: Partial<CreateUnitDto>) => {
    try {
      setError(null);
      const updatedUnit = await apiService.updateUnit(id, data);
      setUnits(prev => prev.map(u => u.id === id ? updatedUnit : u));
      return updatedUnit;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar unidade');
      throw err;
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteUnit(id);
      setUnits(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar unidade');
      throw err;
    }
  };

  const refreshUnits = () => {
    setIsLoading(true);
    fetchUnits();
  };

  return {
    units,
    isLoading,
    error,
    createUnit,
    updateUnit,
    deleteUnit,
    refreshUnits,
  };
};
