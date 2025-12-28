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
  Trash,
  Download,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

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
  const [exportModal, setExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

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
        console.error('Error fetching orders:', error);
        setOrders([]);
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

  const handleBulkDelete = async () => {
    if (selectedOrders.size === 0) return;
    if (!confirm('Are you sure you want to delete selected orders?')) return;

    try {
      const orderIds = Array.from(selectedOrders);
      const response = await apiClient.delete('/api/orders/bulk', {
        body: JSON.stringify({ orderIds }),
      });

      if (!response.ok) throw new Error('Failed to delete orders');

      toast.success(`Successfully deleted ${selectedOrders.size} orders`);
      setOrders(orders.filter((o) => !selectedOrders.has(o.id)));
      setSelectedOrders(new Set());
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast.error('Failed to delete selected orders');
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await apiClient.get(
        `/api/admin/reports/sales/export?from=${dateRange.from}&to=${dateRange.to}&format=csv`,
        { cache: 'no-store' }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales_report_${dateRange.from}_to_${dateRange.to}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Laporan berhasil didownload!');
      setExportModal(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal export laporan');
    } finally {
      setExportLoading(false);
    }
  };

  const setQuickDate = (type: 'thisMonth' | 'lastMonth') => {
    const now = new Date();
    if (type === 'thisMonth') {
      setDateRange({
        from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      });
    } else {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      setDateRange({
        from: lastMonth.toISOString().split('T')[0],
        to: new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
      });
    }
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
    <div className="w-full min-h-screen bg-gray-50 dark:bg-dark-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl border border-gray-200 dark:border-slate-700 p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-slate-800 to-purple-800 bg-clip-text text-transparent">
                  Order Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                  Track and manage all customer orders in real-time
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedOrders.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-900 font-semibold transition-all hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    <Trash className="w-4 h-4" />
                    Delete Selected ({selectedOrders.size})
                  </button>
                )}
                <button
                  onClick={() => setExportModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-2xl border border-green-200 dark:border-green-900 font-semibold transition-all hover:bg-green-200 dark:hover:bg-green-900/50"
                >
                  <Download className="w-4 h-4" />
                  Export Laporan
                </button>
                <div className="backdrop-blur-md bg-white/50 rounded-2xl px-6 py-3 border border-gray-200">
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {orders.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="mb-6">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order ID or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-10 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all appearance-none cursor-pointer min-w-[180px]"
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

        {/* Table Container */}
        <div className="relative">
          <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-5 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.size === orders.length && orders.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-5 h-5 rounded-lg border-2 border-gray-300 checked:bg-purple-600 cursor-pointer transition-all"
                      />
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200/50 hover:bg-gray-500/10 transition-all duration-200 group">
                        <td className="px-6 py-5">
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(order.id)}
                            onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                            className="w-5 h-5 rounded-lg border-2 border-gray-300 checked:bg-purple-600 cursor-pointer transition-all"
                          />
                        </td>
                        <td className="px-6 py-5 font-mono font-bold text-sm">#{order.id}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 text-sm">{order.name}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" /> {order.country}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-bold text-sm">{formatPrice(order.total)}</td>
                        <td className="px-6 py-5 text-sm">
                          {new Date(order.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-5">
                          <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm font-medium transition-all">
                            <Eye className="w-4 h-4" /> View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Package className="w-16 h-16 text-gray-300" />
                          <p className="text-gray-500 text-lg font-medium">No orders found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredOrders.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Showing <b>{filteredOrders.length}</b> of <b>{orders.length}</b> orders</span>
                  {selectedOrders.size > 0 && <span className="text-purple-600 font-medium">{selectedOrders.size} selected</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {exportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setExportModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <FileSpreadsheet className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold dark:text-white">Export Laporan</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Dari Tanggal</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Sampai Tanggal</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setQuickDate('thisMonth')} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">Bulan Ini</button>
                <button onClick={() => setQuickDate('lastMonth')} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">Bulan Lalu</button>
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={() => setExportModal(false)} className="flex-1 py-3 border rounded-xl dark:text-white">Batal</button>
                <button
                  onClick={handleExport}
                  disabled={exportLoading}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {exportLoading ? 'Downloading...' : <><Download className="w-4 h-4" /> Export CSV</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;