'use client';
import { DashboardSidebar, StatsElement, SalesChart } from '@/components';
import apiClient from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import {
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaChartBar,
} from 'react-icons/fa';

// Define types for our stats data
interface StatData {
  value: number;
  change: number;
}

interface DashboardStats {
  revenue: StatData;
  orders: StatData;
  customers: StatData;
  visitors: StatData;
  weeklySales: { name: string; revenue: number }[];
  dailySales: { name: string; revenue: number }[]; // Added dailySales
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Use apiClient to hit Express backend (localhost:3001) where dashboard-stats is mounted
        const response = await apiClient.get('/api/dashboard-stats');
        // apiClient returns response.data directly logic dependent, usually it returns axios-like response or just data
        // Let's check api.ts. usually it returns parsed JSON if using fetch wrapper, or we need to await .json() if it allows
        // Checking lib/api.ts (Step 712 view). It uses fetch wrapper.
        // It returns the response object? 
        // Wait, typical apiClient implementation returns data directly OR response. 
        // Let's assume standard fetch for now but CORRECT URL.
        // Actually apiClient in this project (Step 712) returns `response` from `fetch`.

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data: DashboardStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return formatPrice(value);
  };

  // Helper to format percentage
  const formatChange = (change: number) => {
    if (change === null || change === undefined) return '';
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="flex justify-start max-xl:flex-col min-h-screen w-full relative z-10">
      <DashboardSidebar />
      <div
        className="flex flex-col items-center ml-5 gap-y-4 w-full h-full max-xl:ml-0 max-xl:px-2 max-xl:mt-5
                  p-4 rounded-lg bg-white/70 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-gray-700 shadow-lg text-gray-900 dark:text-white"
      >
        {/* Grid untuk Kartu Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatsElement
            title="Today's Revenue"
            value={
              loading || !stats ? '...' : formatCurrency(stats.revenue.value)
            }
            change={loading || !stats ? '' : formatChange(stats.revenue.change)}
            isPositive={stats ? stats.revenue.change >= 0 : true}
            icon={<FaDollarSign />}
            loading={loading}
            period="vs Yesterday"
          />
          <StatsElement
            title="New Orders"
            value={loading || !stats ? '...' : stats.orders.value.toString()}
            change={loading || !stats ? '' : formatChange(stats.orders.change)}
            isPositive={stats ? stats.orders.change >= 0 : true}
            icon={<FaShoppingCart />}
            loading={loading}
            period="vs Yesterday"
          />
          <StatsElement
            title="New Customers"
            value={loading || !stats ? '...' : stats.customers.value.toString()}
            change={
              loading || !stats ? '' : formatChange(stats.customers.change)
            }
            isPositive={stats ? stats.customers.change >= 0 : true}
            icon={<FaUsers />}
            loading={loading}
            period="vs Yesterday"
          />
          <StatsElement
            title="Today's Visitors"
            value={loading || !stats ? '...' : stats.visitors.value.toString()}
            change={
              loading || !stats ? '' : formatChange(stats.visitors.change)
            }
            isPositive={stats ? stats.visitors.change >= 0 : true}
            icon={<FaChartBar />}
            loading={loading}
            period="vs Yesterday"
          />
        </div>

        {/* Grafik Penjualan Mingguan */}
        <SalesChart data={stats?.dailySales} loading={loading} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
