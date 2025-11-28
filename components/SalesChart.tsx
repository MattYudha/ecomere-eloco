'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
    <div
      className="w-full min-h-96 flex flex-col justify-center items-center gap-y-2
                    bg-white/70 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-gray-700 shadow-lg rounded-lg p-4 text-gray-900 dark:text-white mt-4"
    >
      <h4 className="text-xl font-bold mb-4">Daily Revenue</h4>
      {!loading && data && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
            />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '0.5rem',
              }}
            />
            <Legend wrapperStyle={{ color: legendColor }} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#DCCA87"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SalesChart;
