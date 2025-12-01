import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useFinance } from '../../../hooks/useFinance';
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export const FinanceReports: React.FC = () => {
  const { transactions, categories, accounts, dashboard, isLoading, error, getMonthlyReport } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyReport, setMonthlyReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const report = await getMonthlyReport(selectedYear, selectedMonth);
      setMonthlyReport(report);
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
    } finally {
      setLoadingReport(false);
    }
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
  });

  const currentIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = currentIncome - currentExpense;

  // Transações por categoria
  const transactionsByCategory = categories.map(cat => {
    const catTransactions = transactions.filter(t => t.categoryId === cat.id);
    const total = catTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      category: cat.name,
      type: cat.type,
      total,
      count: catTransactions.length,
    };
  }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="large" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && <Alert type="error" message={error} />}

      {/* Current Month Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receitas do Mês</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(currentIncome)}</p>
              <p className="text-xs text-gray-500 mt-1">{currentMonthTransactions.filter(t => t.type === 'income').length} transações</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Despesas do Mês</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(currentExpense)}</p>
              <p className="text-xs text-gray-500 mt-1">{currentMonthTransactions.filter(t => t.type === 'expense').length} transações</p>
            </div>
            <TrendingDown className="text-red-500" size={32} />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo do Mês</p>
              <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(currentBalance)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentBalance >= 0 ? 'Superávit' : 'Déficit'}
              </p>
            </div>
            <DollarSign className={currentBalance >= 0 ? 'text-blue-500' : 'text-red-500'} size={32} />
          </div>
        </Card>
      </div>

      {/* Generate Report */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Gerar Relatório Mensal</h3>
        
        <div className="flex flex-wrap gap-4 items-end mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mês
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ano
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleGenerateReport} disabled={loadingReport}>
            <Calendar size={16} className="mr-2" />
            {loadingReport ? 'Gerando...' : 'Gerar Relatório'}
          </Button>
        </div>

        {monthlyReport && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Relatório de {months.find(m => m.value === selectedMonth)?.label} de {selectedYear} gerado com sucesso!
            </p>
          </div>
        )}
      </Card>

      {/* Transactions by Category */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Transações por Categoria</h3>
        </div>

        <div className="space-y-3">
          {transactionsByCategory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma transação registrada ainda
            </p>
          ) : (
            transactionsByCategory.map((item, index) => {
              const maxTotal = Math.max(...transactionsByCategory.map(i => i.total));
              const percentage = (item.total / maxTotal) * 100;
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {item.type === 'income' ? (
                        <TrendingUp size={16} className="text-green-500" />
                      ) : (
                        <TrendingDown size={16} className="text-red-500" />
                      )}
                      {item.category}
                    </span>
                    <span className={`text-sm font-medium ${
                      item.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.count} {item.count === 1 ? 'transação' : 'transações'}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{formatDate(transaction.date)}</td>
                  <td className="px-4 py-3 text-sm">{transaction.description}</td>
                  <td className="px-4 py-3 text-sm">{transaction.category?.name || 'N/A'}</td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
