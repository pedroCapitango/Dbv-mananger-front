import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { UserResponseDto } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar usuários');
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (data: any) => {
    try {
      const newUser = await apiService.createUser(data);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUser = async (id: number, data: any) => {
    try {
      const updatedUser = await apiService.updateUser(id, data);
      setUsers(prev =>
        prev.map(user => (user.id === id ? updatedUser : user))
      );
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await apiService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
