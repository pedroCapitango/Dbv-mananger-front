import React from 'react';
import { Menu, X, LogOut, Home, Users, Calendar, DollarSign, Package, Award } from 'lucide-react';
import type { MenuItem } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onToggle: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'members', icon: Users, label: 'Membros' },
  { id: 'events', icon: Calendar, label: 'Eventos' },
  { id: 'finance', icon: DollarSign, label: 'Finanças' },
  { id: 'inventory', icon: Package, label: 'Inventário' },
  { id: 'progress', icon: Award, label: 'Progresso' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentView,
  onToggle,
  onNavigate,
  onLogout,
}) => {
  return (
    <aside 
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-blue-900 text-white transition-all duration-300 flex flex-col relative z-20`}
      aria-label="Menu lateral"
    >
      <div className="p-4 flex items-center justify-between border-b border-blue-800">
        {isOpen && (
          <h2 className="text-xl font-bold animate-fadeIn">Desbravadores</h2>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-blue-800 rounded-lg transition"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2" role="navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === item.id ? 'bg-blue-800' : 'hover:bg-blue-800/50'
            }`}
            aria-current={currentView === item.id ? 'page' : undefined}
            title={!isOpen ? item.label : undefined}
          >
            <item.icon size={20} aria-hidden="true" />
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition"
          title={!isOpen ? 'Sair' : undefined}
        >
          <LogOut size={20} aria-hidden="true" />
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};
