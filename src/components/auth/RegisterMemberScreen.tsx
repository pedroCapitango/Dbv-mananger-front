import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowLeft, Loader } from 'lucide-react';
import { apiService } from '../../services/api';
import { useUnits } from '../../hooks/useUnits';
import type { RegisterMemberDto } from '../../types';

export const RegisterMemberScreen: React.FC = () => {
  const navigate = useNavigate();
  // Buscar unidades sem exigir autenticação (endpoint público)
  const { units, isLoading: unitsLoading } = useUnits({ requireAuth: false });
  
  const [formData, setFormData] = useState<RegisterMemberDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: 'MASCULINO',
    unitId: '',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Limpar erro ao digitar
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('Primeiro nome é obrigatório');
      return false;
    }

    if (!formData.lastName.trim()) {
      setError('Sobrenome é obrigatório');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    if (!formData.birthDate) {
      setError('Data de nascimento é obrigatória');
      return false;
    }

    // Validar idade (mínimo 6 anos, máximo 18 anos)
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;

    if (finalAge < 6 || finalAge > 18) {
      setError('Idade deve estar entre 6 e 18 anos');
      return false;
    }

    if (!formData.unitId) {
      setError('Selecione uma unidade');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Telefone é obrigatório');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Senha deve ter no mínimo 8 caracteres');
      return false;
    }

    // Validar força da senha
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSpecial = /[@$!%*?&]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      setError('Senha deve conter maiúscula, minúscula, número e caractere especial (@$!%*?&)');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    if (!formData.guardianName.trim()) {
      setError('Nome do responsável é obrigatório');
      return false;
    }

    if (!formData.guardianPhone.trim()) {
      setError('Telefone do responsável é obrigatório');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 Enviando registro de membro:', formData);
      const response = await apiService.registerMember(formData);
      console.log('✅ Registro de membro bem-sucedido:', response);

      // Auto-login após registro bem-sucedido
      if (response.user) {
        // O token já foi salvo pelo apiService.registerMember
        console.log('🔄 Redirecionando para dashboard...');
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error('❌ Erro no registro de membro:', err);
      setError(err.message || 'Erro ao registrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-blue-600 text-white p-8 text-center relative">
          <Link
            to="/register"
            className="absolute left-4 top-4 p-2 hover:bg-blue-700 rounded-lg transition"
            title="Voltar"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold">Registro de Membro</h1>
          <p className="text-blue-100 mt-2">
            Criar conta com perfil completo de desbravador
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Primeiro Nome *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="João"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Silva"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    required
                  >
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="joao.silva@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="+244 923 456 789"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Unidade */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Unidade
              </h2>
              <div>
                <label htmlFor="unitId" className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione a Unidade *
                </label>
                {unitsLoading ? (
                  <div className="flex items-center gap-2 text-gray-600 py-3">
                    <Loader size={20} className="animate-spin" />
                    Carregando unidades...
                  </div>
                ) : units.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                    Nenhuma unidade disponível. Entre em contato com o administrador.
                  </div>
                ) : (
                  <select
                    id="unitId"
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    required
                  >
                    <option value="">Selecione...</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                        {unit.minAge && unit.maxAge && ` (${unit.minAge}-${unit.maxAge} anos)`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Responsável */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Dados do Responsável
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Responsável *
                  </label>
                  <input
                    type="text"
                    id="guardianName"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Maria Silva"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="guardianPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone do Responsável *
                  </label>
                  <input
                    type="tel"
                    id="guardianPhone"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="+244 923 111 222"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="guardianEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email do Responsável (opcional)
                  </label>
                  <input
                    type="email"
                    id="guardianEmail"
                    name="guardianEmail"
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="maria.silva@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Segurança
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Maiúscula, minúscula, número e especial
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Digite a senha novamente"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || unitsLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Criar Conta de Membro
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
