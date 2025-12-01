import React from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useFinance } from '../../../hooks/useFinance';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export const FinanceOverview: React.FC = () => {
  const { transactions, accounts, categories } = useFinance();
  
  // Calcular totais a partir das transações reais
  const totalIncome = transactions
    .filter(t => t.type?.toLowerCase() === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type?.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
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
      
      {/* Resumo Financeiro Detalhado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wallet size={20} className="text-blue-600" />
              Contas
            </h3>
            <span className="text-sm text-gray-500">{accounts.length} contas</span>
          </div>
          <div className="space-y-3">
            {accounts.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma conta cadastrada</p>
            ) : (
              accounts.slice(0, 5).map((account) => (
                <div key={account.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.type}</p>
                  </div>
                  <p className="font-bold text-blue-600">{formatCurrency(account.balance)}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Transações Recentes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar size={20} className="text-purple-600" />
              Transações Recentes
            </h3>
            <span className="text-sm text-gray-500">{transactions.length} total</span>
          </div>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma transação registrada</p>
            ) : (
              transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{transaction.description || 'Sem descrição'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">{transaction.category?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${
                    transaction.type?.toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type?.toLowerCase() === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Categorias Principais */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Categorias Mais Usadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Receitas */}
          <div>
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <TrendingUp size={18} />
              Top Receitas
            </h4>
            <div className="space-y-2">
              {(() => {
                const incomeCategories = categories
                  .filter(c => c.type?.toLowerCase() === 'income')
                  .map(cat => {
                    const catTransactions = transactions.filter(t => 
                      (t.categoryId === cat.id || t.category?.name === cat.name) && 
                      t.type?.toLowerCase() === 'income'
                    );
                    const total = catTransactions.reduce((sum, t) => sum + t.amount, 0);
                    return { ...cat, total, count: catTransactions.length };
                  })
                  .filter(c => c.total > 0)
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 3);

                return incomeCategories.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma receita registrada</p>
                ) : (
                  incomeCategories.map((cat) => (
                    <div key={cat.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-green-900">{cat.name}</p>
                        <p className="text-xs text-green-700">{cat.count} transações</p>
                      </div>
                      <p className="text-sm font-bold text-green-600">{formatCurrency(cat.total)}</p>
                    </div>
                  ))
                );
              })()}
            </div>
          </div>

          {/* Despesas */}
          <div>
            <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
              <TrendingDown size={18} />
              Top Despesas
            </h4>
            <div className="space-y-2">
              {(() => {
                const expenseCategories = categories
                  .filter(c => c.type?.toLowerCase() === 'expense')
                  .map(cat => {
                    const catTransactions = transactions.filter(t => 
                      (t.categoryId === cat.id || t.category?.name === cat.name) && 
                      t.type?.toLowerCase() === 'expense'
                    );
                    const total = catTransactions.reduce((sum, t) => sum + t.amount, 0);
                    return { ...cat, total, count: catTransactions.length };
                  })
                  .filter(c => c.total > 0)
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 3);

                return expenseCategories.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma despesa registrada</p>
                ) : (
                  expenseCategories.map((cat) => (
                    <div key={cat.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-red-900">{cat.name}</p>
                        <p className="text-xs text-red-700">{cat.count} transações</p>
                      </div>
                      <p className="text-sm font-bold text-red-600">{formatCurrency(cat.total)}</p>
                    </div>
                  ))
                );
              })()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
