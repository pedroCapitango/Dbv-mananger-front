import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import type {
  InventoryItemResponseDto,
  CreateItemDto,
  UpdateItemDto,
  LoanResponseDto,
  CreateLoanDto,
} from '../types';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItemResponseDto[]>([]);
  const [loans, setLoans] = useState<LoanResponseDto[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = apiService.getToken();
      if (!token) {
        setError('Usuário não autenticado. Por favor faça login.');
        return;
      }
      const [itemsData, loansData, categoriesData, dashboardData] =
        await Promise.all([
          apiService.getInventoryItems(),
          apiService.getLoans(),
          apiService.getInventoryCategories(),
          apiService.getInventoryDashboard(),
        ]);

      setItems(itemsData);
      setLoans(loansData);
      setCategories(categoriesData);
      setDashboard(dashboardData);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados do inventário');
      console.error('Erro ao buscar inventário:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (data: CreateItemDto) => {
    try {
      const newItem = await apiService.createInventoryItem(data);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateItem = async (id: string, data: UpdateItemDto) => {
    try {
      const updatedItem = await apiService.updateInventoryItem(id, data);
      setItems(prev =>
        prev.map(item => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.deleteInventoryItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createLoan = async (data: CreateLoanDto) => {
    try {
      const newLoan = await apiService.createLoan(data);
      setLoans(prev => [...prev, newLoan]);
      await fetchInventoryData(); // Atualiza quantidades
      return newLoan;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar empréstimo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const returnLoan = async (id: string, returnData: any) => {
    try {
      const returnedLoan = await apiService.returnLoan(id, returnData);
      setLoans(prev =>
        prev.map(loan => (loan.id === id ? returnedLoan : loan))
      );
      await fetchInventoryData(); // Atualiza quantidades
      return returnedLoan;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao devolver item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetchInventoryData();
  }, []);

  return {
    items,
    loans,
    categories,
    dashboard,
    isLoading,
    error,
    refetch: fetchInventoryData,
    createItem,
    updateItem,
    deleteItem,
    createLoan,
    returnLoan,
  };
};
