import React from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { FinanceDashboardDto } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface FinanceOverviewProps {
  dashboard?: FinanceDashboardDto;
}

export const FinanceOverview: React.FC<FinanceOverviewProps> = ({ dashboard }) => {
  const totalIncome = dashboard?.totalIncome || 0;
  const totalExpenses = dashboard?.totalExpenses || 0;
  const balance = totalIncome - totalExpenses;

  const stats = [
    {
      label: 'Receitas',
      value: formatCurrency(totalIncome),
      icon: ArrowUpCircle,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Despesas',
      value: formatCurrency(totalExpenses),
      icon: ArrowDownCircle,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Saldo',
      value: formatCurrency(balance),
      icon: DollarSign,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="overflow-hidden">
              <div className={`${stat.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <Icon size={40} className="opacity-80" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Resumo Financeiro</h3>
        <p className="text-gray-600">
          Selecione uma das abas acima para gerenciar transações, categorias, contas, mensalidades ou visualizar relatórios detalhados.
        </p>
      </Card>
    </div>
  );
};
