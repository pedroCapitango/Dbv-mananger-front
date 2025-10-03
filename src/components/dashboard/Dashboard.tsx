import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { AttendanceChart } from './AttendanceChart';
import { EventList } from './EventList';
import { TaskList } from './TaskList';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Alert } from '../ui/Alert';

export const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const {
    stats,
    revenueData,
    attendanceData,
    recentEvents,
    pendingTasks,
    isLoading,
    error,
  } = useDashboardData();

  const getCurrentView = () => {
    const path = location.pathname.slice(1);
    return path || 'dashboard';
  };

  const getViewTitle = (view: string): string => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      members: 'Membros',
      units: 'Unidades',
      events: 'Eventos',
      attendance: 'Presenças',
      progress: 'Progresso',
      finance: 'Finanças',
      inventory: 'Inventário',
      feed: 'Feed Social',
    };
    return titles[view] || 'Dashboard';
  };

  const handleNavigate = (view: string) => {
    if (view === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${view}`);
    }
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-20 transform ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-300`
            : ''
        }`}
      >
        <Sidebar
          isOpen={sidebarOpen}
          currentView={getCurrentView()}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={handleNavigate}
          onLogout={logout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getViewTitle(getCurrentView())} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {error && (
            <Alert type="error" message={error} className="mb-6" />
          )}

          {isLoading ? (
            <LoadingSpinner size="large" className="mt-20" />
          ) : currentView === 'dashboard' ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                {stats.map((stat, idx) => (
                  <StatCard key={idx} stat={stat} />
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                <RevenueChart data={revenueData} />
                <AttendanceChart data={attendanceData} />
              </div>

              {/* Events and Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <EventList events={recentEvents} />
                <TaskList tasks={pendingTasks} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {getViewTitle(currentView)}
                </h2>
                <p className="text-gray-600">
                  Esta seção está em desenvolvimento
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
