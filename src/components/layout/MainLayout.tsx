import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const getCurrentView = (): string => {
    const path = location.pathname.slice(1);
    return path || 'dashboard';
  };

  const getViewTitle = (): string => {
    if (title) return title;
    
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      members: 'Membros',
      events: 'Eventos',
      finance: 'Finanças',
      inventory: 'Inventário',
      progress: 'Progresso',
    };
    return titles[getCurrentView()] || 'Dashboard';
  };

  const handleNavigate = (view: string) => {
    const routes: Record<string, string> = {
      dashboard: '/',
      members: '/members',
      events: '/events',
      finance: '/finance',
      inventory: '/inventory',
      progress: '/progress',
    };
    
    navigate(routes[view] || '/');
    
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
        <Header 
          title={getViewTitle()} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showMenuButton={isMobile}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
