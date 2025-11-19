"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
  data?: { name: string; revenue: number }[];
  loading: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col justify-center items-center gap-y-2
                      bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-4 text-white
                      dark:bg-black/20 dark:border-gray-700 mt-4">
        <h4 className="text-xl text-white font-bold mb-4">Weekly Revenue</h4>
        <p>Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 flex flex-col justify-center items-center gap-y-2
                    bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-4 text-white
                    dark:bg-black/20 dark:border-gray-700 mt-4">
      <h4 className="text-xl text-white font-bold mb-4">Weekly Revenue</h4>
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
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
          <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
          <YAxis stroke="rgba(255, 255, 255, 0.7)" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem'
            }} 
          />
          <Legend wrapperStyle={{ color: 'white' }} />
          <Line type="monotone" dataKey="revenue" stroke="#DCCA87" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
