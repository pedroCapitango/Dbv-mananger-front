import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueData } from '../../types';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

interface RevenueChartProps {
  data: RevenueData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 mb-2">{payload[0]?.payload.month}</p>
      <p className="text-sm text-blue-600">
        Receitas: {formatCurrency(payload[0]?.value || 0)}
      </p>
      <p className="text-sm text-red-600">
        Despesas: {formatCurrency(payload[1]?.value || 0)}
      </p>
    </div>
  );
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Receitas vs Despesas</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#888" 
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#888" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Receitas"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Despesas"
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
