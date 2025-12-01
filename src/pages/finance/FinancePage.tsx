import React, { useState } from 'react';
import { Plus, DollarSign, CreditCard, PieChart as PieChartIcon, Calendar, Filter, Wallet } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import {
  FinanceOverview,
  FinanceTransactions,
  FinanceCategories,
  FinanceAccounts,
  FinanceFees,
  FinanceReports
} from './components';

type TabType = 'overview' | 'transactions' | 'categories' | 'accounts' | 'fees' | 'reports';

export const FinancePage: React.FC = () => {
  const { dashboard, isLoading, error } = useFinance();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados financeiros...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <Alert type="error">{error}</Alert>
        </div>
      </MainLayout>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Visão Geral', icon: PieChartIcon },
    { id: 'transactions' as TabType, label: 'Transações', icon: DollarSign },
    { id: 'categories' as TabType, label: 'Categorias', icon: Filter },
    { id: 'accounts' as TabType, label: 'Contas', icon: Wallet },
    { id: 'fees' as TabType, label: 'Cotas', icon: CreditCard },
    { id: 'reports' as TabType, label: 'Relatórios', icon: Calendar },
  ];

  return (
    <MainLayout title="Gestão Financeira">
      <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-600 mt-1">Controle completo das finanças do clube</p>
        </div>
        <Button variant="primary" onClick={() => setActiveTab('transactions')}>
          <Plus size={20} className="mr-2" />
          Nova Transação
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && <FinanceOverview />}
        {activeTab === 'transactions' && <FinanceTransactions />}
        {activeTab === 'categories' && <FinanceCategories />}
        {activeTab === 'accounts' && <FinanceAccounts />}
        {activeTab === 'fees' && <FinanceFees />}
        {activeTab === 'reports' && <FinanceReports />}
      </div>
      </div>
    </MainLayout>
  );
};
