import React, { useState } from 'react';
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
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={logout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {error && (
            <Alert type="error" message={error} className="mb-6" />
          )}

          {isLoading ? (
            <LoadingSpinner size="large" className="mt-20" />
          ) : (
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
          )}
        </main>
      </div>
    </div>
  );
};
