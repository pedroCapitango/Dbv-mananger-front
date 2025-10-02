import React from 'react';
import type { DashboardStat } from '../../types';
import { Card } from '../ui/Card';
import { getChangeColor } from '../../utils/formatters';

interface StatCardProps {
  stat: DashboardStat;
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <Card hover>
      <div className="flex items-center justify-between mb-4">
        <div className={`${stat.color} p-3 rounded-lg`}>
          <stat.icon size={24} className="text-white" aria-hidden="true" />
        </div>
        <span className={`text-sm font-medium ${getChangeColor(stat.change)}`}>
          {stat.change}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
    </Card>
  );
};
