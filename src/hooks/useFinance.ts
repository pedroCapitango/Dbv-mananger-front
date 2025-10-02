import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type {
  TransactionResponseDto,
  CreateTransactionDto,
  CategoryResponseDto,
  AccountResponseDto,
  FinanceDashboardDto,
} from '../types';

export const useFinance = () => {
  const [transactions, setTransactions] = useState<TransactionResponseDto[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [accounts, setAccounts] = useState<AccountResponseDto[]>([]);
  const [dashboard, setDashboard] = useState<FinanceDashboardDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [transactionsData, categoriesData, accountsData, dashboardData] =
        await Promise.all([
          apiService.getTransactions(),
          apiService.getCategories(),
          apiService.getAccounts(),
          apiService.getFinanceDashboard(),
        ]);

      setTransactions(transactionsData);
      setCategories(categoriesData);
      setAccounts(accountsData);
      setDashboard(dashboardData);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados financeiros');
      console.error('Erro ao buscar dados financeiros:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (data: CreateTransactionDto) => {
    try {
      const newTransaction = await apiService.createTransaction(data);
      setTransactions(prev => [newTransaction, ...prev]);
      await fetchFinanceData(); // Atualiza dashboard
      return newTransaction;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar transação';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTransaction = async (
    id: string,
    data: Partial<CreateTransactionDto>
  ) => {
    try {
      const updatedTransaction = await apiService.updateTransaction(id, data);
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      await fetchFinanceData(); // Atualiza dashboard
      return updatedTransaction;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar transação';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await apiService.deleteTransaction(id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      await fetchFinanceData(); // Atualiza dashboard
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar transação';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getMonthlyReport = async (year: number, month: number) => {
    try {
      const report = await apiService.getMonthlyReport(year, month);
      return report;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar relatório mensal';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  return {
    transactions,
    categories,
    accounts,
    dashboard,
    isLoading,
    error,
    refetch: fetchFinanceData,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyReport,
  };
};
