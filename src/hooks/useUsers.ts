import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import type { UserResponseDto, RegisterSimpleDto } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = apiService.getToken();
      if (!token) {
        setError('Usuário não autenticado. Por favor faça login.');
        return;
      }
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar usuários');
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (data: RegisterSimpleDto) => {
    try {
      const newUser = await apiService.registerSimple(data);
      await fetchUsers(); // Recarregar lista
      return newUser;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    deleteUser,
  };
};
