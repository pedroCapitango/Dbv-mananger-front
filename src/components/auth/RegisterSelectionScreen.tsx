import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Users, Shield, ArrowRight } from 'lucide-react';

export const RegisterSelectionScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <UserPlus size={40} />
          </div>
          <h1 className="text-3xl font-bold">Criar Nova Conta</h1>
          <p className="text-blue-100 mt-2">
            Escolha o tipo de conta que deseja criar
          </p>
        </div>

        {/* Options */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Opção 1: Registro de Membro */}
            <button
              onClick={() => navigate('/register/member')}
              className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute top-4 right-4 text-blue-400 group-hover:text-blue-600 transition">
                <ArrowRight size={24} />
              </div>

              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={32} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Sou Desbravador
              </h2>

              <p className="text-gray-600 mb-4">
                Crie sua conta de membro completa com perfil de desbravador
              </p>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                  <span>Perfil completo de membro</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                  <span>Associação a uma unidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                  <span>Dados do responsável</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                  <span>Acompanhamento de progresso</span>
                </li>
              </ul>

              <div className="mt-6 text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Criar conta de membro
                <ArrowRight size={18} />
              </div>
            </button>

            {/* Opção 2: Registro Simples (Staff) */}
            <button
              onClick={() => navigate('/register/simple')}
              className="group relative bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-400 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute top-4 right-4 text-purple-400 group-hover:text-purple-600 transition">
                <ArrowRight size={24} />
              </div>

              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={32} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Sou Conselheiro/Diretor
              </h2>

              <p className="text-gray-600 mb-4">
                Crie uma conta administrativa para staff e liderança
              </p>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5" />
                  <span>Registro rápido e simples</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5" />
                  <span>Para diretores e conselheiros</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5" />
                  <span>Acesso administrativo</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5" />
                  <span>Gestão do clube</span>
                </li>
              </ul>

              <div className="mt-6 text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Criar conta administrativa
                <ArrowRight size={18} />
              </div>
            </button>
          </div>

          {/* Informação Adicional */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">
              💡 Qual opção escolher?
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong className="text-gray-800">Conta de Membro:</strong> Para desbravadores que participam das atividades (6-18 anos)
              </p>
              <p>
                <strong className="text-gray-800">Conta Administrativa:</strong> Para líderes, conselheiros, diretores e equipe de gestão
              </p>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center text-gray-600">
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
