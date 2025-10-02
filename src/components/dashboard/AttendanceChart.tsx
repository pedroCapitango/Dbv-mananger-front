import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AttendanceData } from '../../types';
import { Card } from '../ui/Card';

interface AttendanceChartProps {
  data: AttendanceData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 mb-1">{payload[0]?.payload.week}</p>
      <p className="text-sm text-green-600">
        Frequência: {payload[0]?.value}%
      </p>
    </div>
  );
};

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequência Semanal (%)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="week" 
            stroke="#888"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#888"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="attendance" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
