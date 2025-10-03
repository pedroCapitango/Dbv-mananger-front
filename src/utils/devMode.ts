// ⚠️ ARQUIVO TEMPORÁRIO PARA DESENVOLVIMENTO
// Este arquivo permite testar o sistema sem backend conectado
// REMOVER EM PRODUÇÃO!

import { apiService } from '../services/api';

const DEV_MODE = true; // Mude para false em produção

// Simular login automático
export const enableDevMode = () => {
  if (!DEV_MODE) return;

  // Sobrescrever método de login
  apiService.login = async (email: string, password: string) => {
    console.log('🔧 DEV MODE: Login simulado', { email, password });
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retornar dados mockados no formato correto da API
    return {
      access_token: 'dev-token-123456',
      token_type: 'Bearer',
      expires_in: 604800,
      user: {
        id: 1,
        name: email.includes('diretor') ? 'Diretor Teste' : 'Admin Desenvolvedor',
        fullName: email.includes('diretor') ? 'Diretor Teste' : 'Admin Desenvolvedor',
        email: email,
        role: email.includes('diretor') ? 'Diretor' : 'admin',
      }
    };
  };

  // Sobrescrever logout
  apiService.logout = async () => {
    console.log('🔧 DEV MODE: Logout simulado');
  };

  console.log('✅ DEV MODE ATIVADO - Login funcionará sem backend');
  console.log('📧 Use qualquer email e senha para testar');
};

// Auto-ativar em desenvolvimento
if (import.meta.env.DEV) {
  enableDevMode();
}
