import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { validateEmail, validateRequired } from '../../utils/validators';

export const LoginScreen: React.FC = () => {
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!validateRequired(email)) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validateRequired(password)) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔵 LoginScreen: Formulário submetido');
    console.log('📧 Dados do formulário:', { email, password });
    
    if (!validateForm()) {
      console.log('❌ LoginScreen: Validação falhou');
      return;
    }

    console.log('✅ LoginScreen: Validação OK, chamando login...');
    try {
      await login(email, password);
      console.log('🎉 LoginScreen: Login completado com sucesso!');
    } catch (err) {
      console.error('💥 LoginScreen: Erro capturado:', err);
      // Error handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema Desbravadores</h1>
          <p className="text-gray-600">Gestão completa do clube</p>
        </div>

        {authError && (
          <Alert 
            type="error" 
            message={authError} 
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Esqueceu a senha?{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Recuperar
          </a>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
