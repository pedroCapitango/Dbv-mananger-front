import React, { useState, useRef, useEffect } from 'react';
import { Bell, UserCircle, Search, Menu, X, Calendar, DollarSign, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../hooks/useEvents';
import { useFees } from '../../hooks/useFees';
import { useInventory } from '../../hooks/useInventory';
import { normalizeRole } from '../../utils/roles';
import { formatDate } from '../../utils/formatters';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick, showMenuButton }) => {
  const { user } = useAuth();
  const { events } = useEvents();
  const { fees } = useFees();
  const { items } = useInventory();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Generate notifications from real data
  const notifications = [];

  // Upcoming events (next 7 days)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7 && (event.status === 'SCHEDULED' || event.status === 'CONFIRMED');
  });

  upcomingEvents.forEach(event => {
    notifications.push({
      id: `event-${event.id}`,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50',
      title: event.title,
      message: `Evento em ${formatDate(event.startDate)}`,
      time: formatDate(event.createdAt),
    });
  });

  // Overdue fees
  const overdueFees = fees.filter(fee => 
    fee.status === 'OVERDUE' || 
    (fee.status === 'PENDING' && new Date(fee.dueDate) < new Date())
  );

  if (overdueFees.length > 0) {
    notifications.push({
      id: 'overdue-fees',
      icon: DollarSign,
      color: 'text-red-600 bg-red-50',
      title: 'Cotas em atraso',
      message: `${overdueFees.length} cotas pendentes`,
      time: 'Agora',
    });
  }

  // Low stock items
  const lowStock = items.filter(item => item.quantity < (item.minQuantity || 10));
  
  if (lowStock.length > 0) {
    notifications.push({
      id: 'low-stock',
      icon: Package,
      color: 'text-yellow-600 bg-yellow-50',
      title: 'Estoque baixo',
      message: `${lowStock.length} itens com estoque baixo`,
      time: 'Hoje',
    });
  }

  const notificationCount = notifications.length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {showMenuButton && onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Abrir menu"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search - pode ser implementado futuramente */}
          <button 
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            aria-label="Pesquisar"
          >
            <Search size={18} className="text-gray-600" />
            <span className="text-sm text-gray-600">Pesquisar...</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg relative transition"
              aria-label="Notificações"
            >
              <Bell size={20} className="text-gray-600" />
              {notificationCount > 0 && (
                <span 
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  aria-label={`${notificationCount} notificações não lidas`}
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nenhuma notificação</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <div 
                          key={notification.id} 
                          className="p-4 hover:bg-gray-50 transition cursor-pointer"
                        >
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-lg ${notification.color} flex-shrink-0`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
            <UserCircle size={32} className="text-gray-600" />
            <div className="hidden md:block text-sm">
              <p className="font-medium text-gray-900">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-gray-500 capitalize">
                {normalizeRole(user?.role) || 'Sem função'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
