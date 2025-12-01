import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';
import type { AuthContextType, UserResponseDto } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data');
    
    console.log('🔎 AuthContext.checkAuth: token encontrado?', !!token);
    
    if (token && userDataStr) {
      try {
        // Restaurar token e dados do usuário do localStorage
        apiService.setToken(token);
        const userData = JSON.parse(userDataStr);
        setUser(userData);
        console.log('✅ Sessão restaurada do localStorage:', userData);
      } catch (error) {
        console.error('❌ Erro ao restaurar sessão, limpando dados:', error);
        // Dados corrompidos: limpar localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        apiService.setToken(null);
        setUser(null);
      }
    } else {
      // Sem token ou dados: garantir que não há usuário na memória
      setUser(null);
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔐 AuthContext: Tentando login com:', { email, password });
      const response = await apiService.login(email, password);
      console.log('✅ AuthContext: Login bem-sucedido, resposta:', response);
      
      // Validar se a resposta tem access_token e user
      if (!response.access_token) {
        throw new Error('Token de acesso não recebido do servidor');
      }
      
      if (!response.user) {
        throw new Error('Dados do usuário não recebidos do servidor');
      }
      
      // A API retorna { access_token, token_type, expires_in, user }
      setUser(response.user);
      // Armazenar dados do usuário no localStorage para persistir sessão
      localStorage.setItem('user_data', JSON.stringify(response.user));
      console.log('👤 Usuário autenticado e salvo no localStorage:', response.user);
    } catch (err: any) {
      console.error('❌ AuthContext: Erro no login:', err);
      const errorMessage = err.message || 'Erro ao fazer login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        // Considera autenticado apenas se houver user e token válido armazenado
        isAuthenticated: !!user && !!localStorage.getItem('auth_token'),
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
