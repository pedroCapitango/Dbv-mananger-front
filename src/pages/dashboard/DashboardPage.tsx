import React from 'react';
import { Users, Calendar, DollarSign, Package, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../../components/ui/Card';
import { MainLayout } from '../../components/layout/MainLayout';
import { useFinance } from '../../hooks/useFinance';
import { useMembers } from '../../hooks/useMembers';
import { useEvents } from '../../hooks/useEvents';
import { useInventory } from '../../hooks/useInventory';
import { formatCurrency } from '../../utils/formatters';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, change, changeType, color }) => {
  const TrendIcon = changeType === 'increase' ? TrendingUp : TrendingDown;
  const trendColor = changeType === 'increase' ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 ${trendColor} text-sm font-medium`}>
            <TrendIcon size={16} />
            <span>{change}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{label}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </Card>
  );
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const DashboardPage: React.FC = () => {
  const { dashboard: financeDashboard, isLoading: financeLoading } = useFinance();
  const { members, isLoading: membersLoading } = useMembers();
  const { events, isLoading: eventsLoading } = useEvents();
  const { items, isLoading: inventoryLoading } = useInventory();

  // Calculate statistics
  const activeMembers = members.filter(m => m.status === 'active').length;
  const upcomingEvents = events.filter(e => e.status === 'scheduled').length;
  const totalInventory = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = items.filter(item => item.quantity < (item.minQuantity || 0)).length;

  // Financial chart data - últimos 6 meses
  const monthlyFinancialData = financeDashboard?.transactions
    ?.reduce((acc: any[], transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('pt-AO', { month: 'short' });
      const existing = acc.find(item => item.month === month);
      
      if (existing) {
        if (transaction.type === 'income') {
          existing.receita += transaction.amount;
        } else {
          existing.despesa += transaction.amount;
        }
      } else {
        acc.push({
          month,
          receita: transaction.type === 'income' ? transaction.amount : 0,
          despesa: transaction.type === 'expense' ? transaction.amount : 0
        });
      }
      return acc;
    }, [])
    ?.slice(-6) || [];

  // Events by status
  const eventsByStatus = [
    { name: 'Agendados', value: events.filter(e => e.status === 'scheduled').length },
    { name: 'Em Andamento', value: events.filter(e => e.status === 'ongoing').length },
    { name: 'Concluídos', value: events.filter(e => e.status === 'completed').length },
    { name: 'Cancelados', value: events.filter(e => e.status === 'cancelled').length }
  ].filter(item => item.value > 0);

  // Members by unit (mock data - implementar quando tiver units)
  const membersByUnit = [
    { unit: 'Lobinhos', count: Math.floor(activeMembers * 0.3) },
    { unit: 'Desbravadores', count: Math.floor(activeMembers * 0.4) },
    { unit: 'Pioneiros', count: Math.floor(activeMembers * 0.3) }
  ];

  // Recent activities (mock - implementar com dados reais)
  const recentActivities = [
    { id: 1, type: 'member', title: 'Novo membro registrado', time: '2 horas atrás', color: 'bg-blue-500' },
    { id: 2, type: 'event', title: 'Evento criado: Acampamento', time: '5 horas atrás', color: 'bg-green-500' },
    { id: 3, type: 'finance', title: 'Transação registrada', time: '1 dia atrás', color: 'bg-yellow-500' },
    { id: 4, type: 'inventory', title: 'Item adicionado ao estoque', time: '2 dias atrás', color: 'bg-purple-500' }
  ];

  const isLoading = financeLoading || membersLoading || eventsLoading || inventoryLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard">
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema de gestão</p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Membros Ativos"
          value={activeMembers}
          change="+12%"
          changeType="increase"
          color="bg-blue-500"
        />
        <StatCard
          icon={Calendar}
          label="Eventos Agendados"
          value={upcomingEvents}
          change="+3"
          changeType="increase"
          color="bg-green-500"
        />
        <StatCard
          icon={DollarSign}
          label="Saldo Mensal"
          value={formatCurrency((financeDashboard?.totalIncome || 0) - (financeDashboard?.totalExpenses || 0))}
          change="+8%"
          changeType="increase"
          color="bg-yellow-500"
        />
        <StatCard
          icon={Package}
          label="Itens em Estoque"
          value={totalInventory}
          change={lowStockItems > 0 ? `-${lowStockItems} baixo` : 'OK'}
          changeType={lowStockItems > 0 ? 'decrease' : 'increase'}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Chart */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-blue-600" />
            Receitas e Despesas (Últimos 6 meses)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyFinancialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" style={{ fontSize: '12px' }} />
              <YAxis stroke="#888" style={{ fontSize: '12px' }} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="receita" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Receita"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="despesa" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Despesa"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Members by Unit Chart */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users size={20} className="text-green-600" />
            Membros por Unidade
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={membersByUnit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="unit" stroke="#888" style={{ fontSize: '12px' }} />
              <YAxis stroke="#888" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Membros" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events Distribution */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-purple-600" />
            Distribuição de Eventos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {eventsByStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-orange-600" />
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                  {activity.id !== recentActivities.length && (
                    <div className="w-0.5 h-12 bg-gray-200"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-sm font-medium mb-2 opacity-90">Receita Total</h3>
          <p className="text-3xl font-bold mb-1">
            {formatCurrency(financeDashboard?.totalIncome || 0)}
          </p>
          <p className="text-sm opacity-75">Este mês</p>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <h3 className="text-sm font-medium mb-2 opacity-90">Despesas Totais</h3>
          <p className="text-3xl font-bold mb-1">
            {formatCurrency(financeDashboard?.totalExpenses || 0)}
          </p>
          <p className="text-sm opacity-75">Este mês</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-sm font-medium mb-2 opacity-90">Saldo Atual</h3>
          <p className="text-3xl font-bold mb-1">
            {formatCurrency((financeDashboard?.totalIncome || 0) - (financeDashboard?.totalExpenses || 0))}
          </p>
          <p className="text-sm opacity-75">Balanço mensal</p>
        </Card>
      </div>
      </div>
    </MainLayout>
  );
};
