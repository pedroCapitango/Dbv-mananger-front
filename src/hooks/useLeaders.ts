import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import type { UserResponseDto } from '../types';

export const useLeaders = () => {
  const [leaders, setLeaders] = useState<UserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didInit = useRef(false);

  const fetchLeaders = async () => {
    const token = apiService.getToken();
    if (!token) {
      console.warn('⚠️ useLeaders: Sem token, aguardando autenticação');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📥 Buscando conselheiros...');
      const allUsers = await apiService.getUsers();
      
      // Filtrar apenas conselheiros, líderes, diretores e admins
      const filteredLeaders = allUsers.filter(user => 
        ['CONSELHEIRO', 'LEADER', 'DIRECTOR', 'ADMIN'].includes(user.role.toUpperCase())
      );
      
      console.log(`✅ ${filteredLeaders.length} líderes disponíveis`);
      setLeaders(filteredLeaders);
    } catch (err: any) {
      console.error('❌ Erro ao buscar líderes:', err);
      setError(err.message || 'Erro ao carregar líderes');
      setLeaders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      fetchLeaders();
    }
  }, []);

  const refreshLeaders = () => {
    fetchLeaders();
  };

  return {
    leaders,
    isLoading,
    error,
    refreshLeaders,
  };
};
