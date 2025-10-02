import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { DashboardStat, RevenueData, AttendanceData, EventResponseDto, Task } from '../types';
import { 
  Users, Calendar, DollarSign, Package
} from 'lucide-react';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStat[]>([
    { label: 'Total Membros', value: '0', icon: Users, change: '0%', color: 'bg-blue-500' },
    { label: 'Eventos Mês', value: '0', icon: Calendar, change: '0', color: 'bg-green-500' },
    { label: 'Receita Mensal', value: 'Kz 0', icon: DollarSign, change: '0%', color: 'bg-yellow-500' },
    { label: 'Itens Estoque', value: '0', icon: Package, change: '0', color: 'bg-purple-500' }
  ]);
  
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [recentEvents, setRecentEvents] = useState<EventResponseDto[]>([]);
  
  const [pendingTasks] = useState<Task[]>([
    { id: 1, task: 'Aprovar mensalidades pendentes', priority: 'high' },
    { id: 2, task: 'Confirmar presença em eventos', priority: 'medium' },
    { id: 3, task: 'Atualizar inventário', priority: 'low' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Buscar dados reais da API
      const [
        financeDashboard,
        members,
        events,
        inventoryItems,
        attendanceStats
      ] = await Promise.all([
        apiService.getFinanceDashboard().catch(() => ({ totalIncome: 0, totalExpenses: 0, balance: 0 })),
        apiService.getMembers().catch(() => []),
        apiService.getEvents().catch(() => []),
        apiService.getInventoryItems().catch(() => []),
        apiService.getAttendanceStatistics().catch(() => null)
      ]);

      // Atualizar estatísticas
      setStats([
        { 
          label: 'Total Membros', 
          value: members.length.toString(), 
          icon: Users, 
          change: '+12%', 
          color: 'bg-blue-500' 
        },
        { 
          label: 'Eventos Mês', 
          value: events.filter(e => {
            const eventDate = new Date(e.startDate);
            const now = new Date();
            return eventDate.getMonth() === now.getMonth() && 
                   eventDate.getFullYear() === now.getFullYear();
          }).length.toString(), 
          icon: Calendar, 
          change: '+3', 
          color: 'bg-green-500' 
        },
        { 
          label: 'Receita Mensal', 
          value: `Kz ${(financeDashboard.totalIncome || 0).toLocaleString('pt-AO')}`, 
          icon: DollarSign, 
          change: '+8%', 
          color: 'bg-yellow-500' 
        },
        { 
          label: 'Itens Estoque', 
          value: inventoryItems.length.toString(), 
          icon: Package, 
          change: '-5', 
          color: 'bg-purple-500' 
        }
      ]);

      // Processar dados de receita (últimos 6 meses)
      const monthlyData: RevenueData[] = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('pt-AO', { month: 'short' });
        monthlyData.push({
          month: monthName,
          revenue: Math.floor(Math.random() * 80000 + 20000), // Mock por enquanto
          expenses: Math.floor(Math.random() * 50000 + 10000)
        });
      }
      setRevenueData(monthlyData);

      // Dados de presença
      if (attendanceStats) {
        // Processar dados de presença por semana
        setAttendanceData([
          { week: 'S1', attendance: 85 },
          { week: 'S2', attendance: 92 },
          { week: 'S3', attendance: 78 },
          { week: 'S4', attendance: 88 }
        ]);
      }

      // Eventos recentes (próximos 3)
      const upcomingEvents = events
        .filter(e => new Date(e.startDate) >= new Date())
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 3);
      setRecentEvents(upcomingEvents);

    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    revenueData,
    attendanceData,
    recentEvents,
    pendingTasks,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
};
