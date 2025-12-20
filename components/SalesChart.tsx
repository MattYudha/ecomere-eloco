'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from 'next-themes';

interface SalesChartProps {
  data?: { name: string; revenue: number }[];
  loading: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, loading }) => {
  const { theme } = useTheme();

  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const axisColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
  const legendColor = theme === 'dark' ? 'white' : 'black';
  const tooltipBg = theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const tooltipBorder = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';

  if (loading) {
    return (
      <div
        className="w-full min-h-96 flex flex-col justify-center items-center gap-y-2
                      bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-4 text-gray-900 dark:text-white
                      dark:bg-black/20 dark:border-gray-700 mt-4"
      >
        <h4 className="text-xl font-bold mb-4">Daily Revenue</h4>
        <p>Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96">
      {!loading && data && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dcca87" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#dcca87" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="name"
              stroke={axisColor}
              tick={{ fill: axisColor }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fill: axisColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#dcca87"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SalesChart;
