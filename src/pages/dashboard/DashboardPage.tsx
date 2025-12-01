import React, { useMemo } from 'react';
import { Users, Calendar, DollarSign, Package, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../../components/ui/Card';
import { MainLayout } from '../../components/layout/MainLayout';
import { useFinance } from '../../hooks/useFinance';
import { useMembers } from '../../hooks/useMembers';
import { useEvents } from '../../hooks/useEvents';
import { useInventory } from '../../hooks/useInventory';
import { useUnits } from '../../hooks/useUnits';
import { formatCurrency, formatDate } from '../../utils/formatters';

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
  const { transactions, isLoading: financeLoading } = useFinance();
  const { members, isLoading: membersLoading } = useMembers();
  const { events, isLoading: eventsLoading } = useEvents();
  const { items, isLoading: inventoryLoading } = useInventory();
  const { units, isLoading: unitsLoading } = useUnits();

  // Calculate statistics from real data
  const activeMembers = members.filter(m => m.status === 'active').length;
  const upcomingEvents = events.filter(e => e.status === 'SCHEDULED' || e.status === 'CONFIRMED').length;
  const totalInventory = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = items.filter(item => item.quantity < (item.minQuantity || 10)).length;

  // Calculate financial totals from transactions
  const totalIncome = transactions
    .filter(t => t.type?.toLowerCase() === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type?.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  // Financial chart data - últimos 6 meses com dados reais
  const monthlyFinancialData = useMemo(() => {
    const monthsMap = new Map<string, { month: string, receita: number, despesa: number }>();
    const now = new Date();
    
    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('pt-AO', { month: 'short', year: 'numeric' });
      monthsMap.set(monthKey, { month: monthKey, receita: 0, despesa: 0 });
    }

    // Agrupar transações por mês
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('pt-AO', { month: 'short', year: 'numeric' });
      const existing = monthsMap.get(monthKey);
      
      if (existing) {
        if (transaction.type?.toLowerCase() === 'income') {
          existing.receita += transaction.amount;
        } else if (transaction.type?.toLowerCase() === 'expense') {
          existing.despesa += transaction.amount;
        }
      }
    });

    return Array.from(monthsMap.values());
  }, [transactions]);

  // Events by status
  const eventsByStatus = [
    { name: 'Agendados', value: events.filter(e => e.status === 'SCHEDULED').length },
    { name: 'Confirmados', value: events.filter(e => e.status === 'CONFIRMED').length },
    { name: 'Concluídos', value: events.filter(e => e.status === 'COMPLETED').length },
    { name: 'Cancelados', value: events.filter(e => e.status === 'CANCELLED').length }
  ].filter(item => item.value > 0);

  // Members by unit - dados reais
  const membersByUnit = useMemo(() => {
    return units.map(unit => {
      const count = members.filter(m => m.unitId === unit.id && m.status === 'active').length;
      return { unit: unit.name, count };
    }).filter(item => item.count > 0);
  }, [members, units]);

  // Recent activities - dados reais
  const recentActivities = useMemo(() => {
    const activities: any[] = [];
    
    // Últimos membros (até 2)
    members
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2)
      .forEach(member => {
        activities.push({
          id: `member-${member.id}`,
          type: 'member',
          title: `Novo membro: ${member.firstName} ${member.lastName}`,
          time: formatDate(member.createdAt),
          color: 'bg-blue-500'
        });
      });
    
    // Últimos eventos (até 2)
    events
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2)
      .forEach(event => {
        activities.push({
          id: `event-${event.id}`,
          type: 'event',
          title: `Evento: ${event.title}`,
          time: formatDate(event.createdAt),
          color: 'bg-green-500'
        });
      });
    
    // Últimas transações (até 2)
    transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2)
      .forEach(transaction => {
        activities.push({
          id: `transaction-${transaction.id}`,
          type: 'finance',
          title: `Transação: ${transaction.description || formatCurrency(transaction.amount)}`,
          time: formatDate(transaction.date),
          color: 'bg-yellow-500'
        });
      });
    
    // Ordenar por data e pegar as 6 mais recentes
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6);
  }, [members, events, transactions]);

  const isLoading = financeLoading || membersLoading || eventsLoading || inventoryLoading || unitsLoading;

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
          color="bg-blue-500"
        />
        <StatCard
          icon={Calendar}
          label="Eventos Agendados"
          value={upcomingEvents}
          color="bg-green-500"
        />
        <StatCard
          icon={DollarSign}
          label="Saldo Atual"
          value={formatCurrency(balance)}
          color="bg-yellow-500"
        />
        <StatCard
          icon={Package}
          label="Itens em Estoque"
          value={totalInventory}
          change={lowStockItems > 0 ? `${lowStockItems} baixo estoque` : 'Estoque OK'}
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
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-sm opacity-75">{transactions.filter(t => t.type?.toLowerCase() === 'income').length} transações</p>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <h3 className="text-sm font-medium mb-2 opacity-90">Despesas Totais</h3>
          <p className="text-3xl font-bold mb-1">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-sm opacity-75">{transactions.filter(t => t.type?.toLowerCase() === 'expense').length} transações</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-sm font-medium mb-2 opacity-90">Saldo Atual</h3>
          <p className="text-3xl font-bold mb-1">
            {formatCurrency(balance)}
          </p>
          <p className="text-sm opacity-75">Balanço total</p>
        </Card>
      </div>
      </div>
    </MainLayout>
  );
};
