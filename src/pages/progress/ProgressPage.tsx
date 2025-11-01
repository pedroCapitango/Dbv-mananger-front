import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Award, TrendingUp, Target, Star } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  return (
    <MainLayout title="Progresso">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Acompanhamento de Progresso
          </h1>
          <p className="text-gray-600">
            Gerencie o progresso dos desbravadores nas classes e especialidades
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Classes Concluídas</h3>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Star className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Especialidades</h3>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">0%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Progresso Médio</h3>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="text-orange-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Requisitos Pendentes</h3>
          </div>
        </div>

        {/* Content Placeholder */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center py-12">
            <Award size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Módulo de Progresso em Desenvolvimento
            </h2>
            <p className="text-gray-500 mb-6">
              Em breve você poderá acompanhar o progresso dos desbravadores em:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Classes regulares e avançadas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Especialidades por categorias
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Requisitos individuais
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Relatórios de progresso
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Histórico de conquistas
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
