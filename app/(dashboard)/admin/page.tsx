"use client";
import { DashboardSidebar, StatsElement, SalesChart } from "@/components";
import React, { useState, useEffect } from "react";
import { FaDollarSign, FaShoppingCart, FaUsers, FaChartBar } from "react-icons/fa";

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
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data: DashboardStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Optionally, set some default/error state for stats
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Helper to format percentage
  const formatChange = (change: number) => {
    if (change === null || change === undefined) return "";
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="flex justify-start max-xl:flex-col min-h-screen w-full relative z-10">
      <DashboardSidebar />
      <div className="flex flex-col items-center ml-5 gap-y-4 w-full h-full max-xl:ml-0 max-xl:px-2 max-xl:mt-5
                  p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-lg dark:bg-black/20 dark:border-gray-700">
        
        {/* Grid untuk Kartu Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatsElement 
            title="Today's Revenue"
            value={loading || !stats ? "..." : formatCurrency(stats.revenue.value)}
            change={loading || !stats ? "" : formatChange(stats.revenue.change)}
            isPositive={stats ? stats.revenue.change >= 0 : true}
            icon={<FaDollarSign />}
            loading={loading}
          />
          <StatsElement 
            title="New Orders"
            value={loading || !stats ? "..." : stats.orders.value.toString()}
            change={loading || !stats ? "" : formatChange(stats.orders.change)}
            isPositive={stats ? stats.orders.change >= 0 : true}
            icon={<FaShoppingCart />}
            loading={loading}
          />
          <StatsElement 
            title="New Customers"
            value={loading || !stats ? "..." : stats.customers.value.toString()}
            change={loading || !stats ? "" : formatChange(stats.customers.change)}
            isPositive={stats ? stats.customers.change >= 0 : true}
            icon={<FaUsers />}
            loading={loading}
          />
          <StatsElement 
            title="Today's Visitors"
            value={loading || !stats ? "..." : stats.visitors.value.toString()}
            change={loading || !stats ? "" : formatChange(stats.visitors.change)}
            isPositive={stats ? stats.visitors.change >= 0 : true}
            icon={<FaChartBar />}
            loading={loading}
          />
        </div>

        {/* Grafik Penjualan Mingguan */}
        <SalesChart data={stats?.weeklySales} loading={loading} />

      </div>
    </div>
  );
};

export default AdminDashboardPage;
