import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { validateEmail, validateRequired } from '../../utils/validators';
import type { RegisterDto } from '../../types';

export const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<RegisterDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: 'MALE',
    unitId: '',
    phone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    responsible: {
      name: '',
      relationship: 'MÃE',
      phone: '',
      email: '',
    },
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!validateRequired(formData.firstName)) {
      newErrors.firstName = 'Nome é obrigatório';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!validateRequired(formData.lastName)) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!validateRequired(formData.birthDate)) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!validateRequired(formData.address.street)) {
      newErrors['address.street'] = 'Rua é obrigatória';
    }

    if (!validateRequired(formData.address.number)) {
      newErrors['address.number'] = 'Número é obrigatório';
    }

    if (!validateRequired(formData.address.neighborhood)) {
      newErrors['address.neighborhood'] = 'Bairro é obrigatório';
    }

    if (!validateRequired(formData.address.city)) {
      newErrors['address.city'] = 'Cidade é obrigatória';
    }

    if (!validateRequired(formData.address.state)) {
      newErrors['address.state'] = 'Estado é obrigatório';
    }

    if (!validateRequired(formData.address.zipCode)) {
      newErrors['address.zipCode'] = 'CEP é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!validateRequired(formData.responsible.name)) {
      newErrors['responsible.name'] = 'Nome do responsável é obrigatório';
    }

    if (!validateRequired(formData.responsible.phone)) {
      newErrors['responsible.phone'] = 'Telefone do responsável é obrigatório';
    }

    if (!validateRequired(formData.responsible.email)) {
      newErrors['responsible.email'] = 'Email do responsável é obrigatório';
    } else if (!validateEmail(formData.responsible.email)) {
      newErrors['responsible.email'] = 'Email do responsável inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    const keys = field.split('.');
    
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...(prev as any)[keys[0]],
          [keys[1]]: value
        }
      }));
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNext = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep4()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      console.log('📤 Enviando dados de registro:', formData);
      
      // Register the user
      const response = await apiService.register(formData);
      console.log('✅ Registro bem-sucedido:', response);

      // Auto-login after successful registration
      await login(formData.email, formData.password);
      
      // Redirect will happen automatically via AuthContext
    } catch (err: any) {
      console.error('❌ Erro no registro:', err);
      setApiError(err.message || 'Erro ao criar conta. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const passwordStrength = (password: string): { level: number; text: string; color: string } => {
    if (!password) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: strength, text: 'Fraca', color: 'bg-red-500' };
    if (strength <= 3) return { level: strength, text: 'Média', color: 'bg-yellow-500' };
    return { level: strength, text: 'Forte', color: 'bg-green-500' };
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-fadeIn overflow-y-auto max-h-[90vh]">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Voltar ao login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Junte-se ao Sistema Desbravadores</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Etapa {currentStep} de {totalSteps}</span>
            <span className="text-sm text-gray-500">
              {currentStep === 1 && 'Dados de Acesso'}
              {currentStep === 2 && 'Dados Pessoais'}
              {currentStep === 3 && 'Endereço'}
              {currentStep === 4 && 'Responsável'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {apiError && (
          <Alert type="error" message={apiError} className="mb-6" />
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Step 1: Account Info */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Nome"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="João"
                  error={errors.firstName}
                  required
                  disabled={isSubmitting}
                />
                <Input
                  type="text"
                  label="Sobrenome"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Silva"
                  error={errors.lastName}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Input
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="seu@email.com"
                error={errors.email}
                required
                autoComplete="email"
                disabled={isSubmitting}
              />

              <div>
                <Input
                  type="password"
                  label="Senha"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  error={errors.password}
                  required
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Força da senha:</span>
                      <span className={`text-xs font-medium ${
                        strength.level <= 2 ? 'text-red-600' : 
                        strength.level <= 3 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {strength.text}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Input
                type="password"
                label="Confirmar Senha"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Step 2: Personal Info */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <Input
                type="date"
                label="Data de Nascimento"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                error={errors.birthDate}
                required
                disabled={isSubmitting}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('gender', 'MALE')}
                    className={`p-3 rounded-lg border-2 transition ${
                      formData.gender === 'MALE'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Masculino
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('gender', 'FEMALE')}
                    className={`p-3 rounded-lg border-2 transition ${
                      formData.gender === 'FEMALE'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Feminino
                  </button>
                </div>
              </div>

              <Input
                type="tel"
                label="Telefone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+244 123 456 789"
                error={errors.phone}
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    type="text"
                    label="Rua"
                    value={formData.address.street}
                    onChange={(e) => handleChange('address.street', e.target.value)}
                    placeholder="Rua das Flores"
                    error={errors['address.street']}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Input
                  type="text"
                  label="Número"
                  value={formData.address.number}
                  onChange={(e) => handleChange('address.number', e.target.value)}
                  placeholder="123"
                  error={errors['address.number']}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Input
                type="text"
                label="Complemento"
                value={formData.address.complement || ''}
                onChange={(e) => handleChange('address.complement', e.target.value)}
                placeholder="Apto 45 (opcional)"
                disabled={isSubmitting}
              />

              <Input
                type="text"
                label="Bairro"
                value={formData.address.neighborhood}
                onChange={(e) => handleChange('address.neighborhood', e.target.value)}
                placeholder="Centro"
                error={errors['address.neighborhood']}
                required
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Cidade"
                  value={formData.address.city}
                  onChange={(e) => handleChange('address.city', e.target.value)}
                  placeholder="Luanda"
                  error={errors['address.city']}
                  required
                  disabled={isSubmitting}
                />
                <Input
                  type="text"
                  label="Estado/Província"
                  value={formData.address.state}
                  onChange={(e) => handleChange('address.state', e.target.value)}
                  placeholder="Luanda"
                  error={errors['address.state']}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Input
                type="text"
                label="CEP/Código Postal"
                value={formData.address.zipCode}
                onChange={(e) => handleChange('address.zipCode', e.target.value)}
                placeholder="01234-567"
                error={errors['address.zipCode']}
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Step 4: Responsible */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <Input
                type="text"
                label="Nome do Responsável"
                value={formData.responsible.name}
                onChange={(e) => handleChange('responsible.name', e.target.value)}
                placeholder="Maria Silva"
                error={errors['responsible.name']}
                required
                disabled={isSubmitting}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relacionamento <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.responsible.relationship}
                  onChange={(e) => handleChange('responsible.relationship', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="MÃE">Mãe</option>
                  <option value="PAI">Pai</option>
                  <option value="AVÓ">Avó</option>
                  <option value="AVÔ">Avô</option>
                  <option value="TIO">Tio</option>
                  <option value="TIA">Tia</option>
                  <option value="TUTOR">Tutor Legal</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <Input
                type="tel"
                label="Telefone do Responsável"
                value={formData.responsible.phone}
                onChange={(e) => handleChange('responsible.phone', e.target.value)}
                placeholder="+244 123 456 789"
                error={errors['responsible.phone']}
                required
                disabled={isSubmitting}
              />

              <Input
                type="email"
                label="Email do Responsável"
                value={formData.responsible.email}
                onChange={(e) => handleChange('responsible.email', e.target.value)}
                placeholder="responsavel@email.com"
                error={errors['responsible.email']}
                required
                disabled={isSubmitting}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    Ao criar uma conta, você concorda com nossos{' '}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Termos de Serviço
                    </a>{' '}
                    e{' '}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Política de Privacidade
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                <ArrowLeft size={18} className="mr-2" />
                Voltar
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                className="ml-auto"
              >
                Próximo
                <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                fullWidth={currentStep === 1}
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
                className="ml-auto"
              >
                {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            )}
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem uma conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            disabled={isSubmitting}
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
};
