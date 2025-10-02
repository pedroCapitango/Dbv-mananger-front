import React from 'react';
import { Bell, UserCircle, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
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
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg relative transition"
            aria-label="Notificações"
          >
            <Bell size={20} className="text-gray-600" />
            <span 
              className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              aria-label="Você tem notificações não lidas"
            />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
            <UserCircle size={32} className="text-gray-600" />
            <div className="hidden md:block text-sm">
              <p className="font-medium text-gray-900">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-gray-500 capitalize">
                {user?.role || 'Administrador'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
