'use client';

// *********************
// Role of the component: Component that displays all orders on admin dashboard page
// Name of the component: AdminOrders.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.1 - Light Liquid Glass UI
// Component call: <AdminOrders />
// Input parameters: No input parameters
// Output: Modern table with light liquid glass effect and all orders
// *********************

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import {
  Search,
  Package,
  Calendar,
  DollarSign,
  MapPin,
  Eye,
  ChevronDown,
  Filter,
} from 'lucide-react';

interface Order {
  id: string;
  name: string;
  country: string;
  status: string;
  total: number;
  dateTime: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data?.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // Set to empty array on error
      }
    };
    fetchOrders();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(orders.map((o) => o.id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Processing: 'bg-amber-100 text-amber-800 border-amber-200',
      Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="relative backdrop-blur-xl bg-white/70 rounded-3xl border border-gray-200 p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-slate-800 to-purple-800 bg-clip-text text-transparent">
                  Order Management
                </h1>
                <p className="text-gray-500 text-sm md:text-base">
                  Track and manage all customer orders in real-time
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="backdrop-blur-md bg-white/50 rounded-2xl px-6 py-3 border border-gray-200">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {orders.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="mb-6">
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-gray-200 p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order ID or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-10 py-3 rounded-xl bg-white/50 border border-gray-200 text-gray-800 focus:outline-none focus:border-purple-400 focus:bg-white transition-all appearance-none cursor-pointer min-w-[180px]"
                >
                  <option value="all">All Status</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Container with Liquid Glass */}
        <div className="relative">
          <div className="relative backdrop-blur-xl bg-white/70 rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
            {/* Table Wrapper for Responsive Scroll */}
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Head */}
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-5 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedOrders.size === orders.length &&
                          orders.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-5 h-5 rounded-lg bg-gray-200/50 border-2 border-gray-300 checked:bg-purple-600 checked:border-purple-600 cursor-pointer transition-all"
                      />
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order ID
                      </div>
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Customer
                      </div>
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Amount
                      </div>
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr
                        key={order?.id}
                        className="border-b border-gray-200/50 hover:bg-gray-500/10 transition-all duration-200 group"
                      >
                        <td className="px-6 py-5">
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(order?.id)}
                            onChange={(e) =>
                              handleSelectOrder(order?.id, e.target.checked)
                            }
                            className="w-5 h-5 rounded-lg bg-gray-200/50 border-2 border-gray-300 checked:bg-purple-600 checked:border-purple-600 cursor-pointer transition-all"
                          />
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-mono font-bold text-gray-900 text-sm">
                            #{order?.id}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 text-sm">
                              {order?.name}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {order?.country}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(order?.status)}`}
                          >
                            {order?.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-bold text-gray-800 text-sm">
                            ${order?.total.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-gray-600 text-sm">
                            {new Date(
                              Date.parse(order?.dateTime),
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <Link
                            href={`/admin/orders/${order?.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium transition-all duration-200 group-hover:border-purple-400"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Package className="w-16 h-16 text-gray-300" />
                          <p className="text-gray-500 text-lg font-medium">
                            No orders found
                          </p>
                          <p className="text-gray-400 text-sm">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary */}
            {filteredOrders.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 backdrop-blur-sm bg-white/50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
                  <span>
                    Showing{' '}
                    <span className="text-gray-800 font-semibold">
                      {filteredOrders.length}
                    </span>{' '}
                    of{' '}
                    <span className="text-gray-800 font-semibold">
                      {orders.length}
                    </span>{' '}
                    orders
                  </span>
                  {selectedOrders.size > 0 && (
                    <span className="text-purple-600 font-medium">
                      {selectedOrders.size} order
                      {selectedOrders.size > 1 ? 's' : ''} selected
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
