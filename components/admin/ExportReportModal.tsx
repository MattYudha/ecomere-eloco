'use client';
import React, { useState } from 'react';
import { FaFileCsv, FaFilePdf, FaDownload, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import apiClient from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/toast-config';

interface ExportReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleExport = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            showErrorToast('Please select both start and end dates');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            showErrorToast('Start date cannot be after end date');
            return;
        }

        setLoading(true);

        try {
            // We use standard fetch here to handle blob/download
            // apiClient might parse JSON automatically, so we skip it for file download or use raw fetch
            // But let's try to construct the URL manually to open in new tab or trigger download
            // Actually, for authenticated file download, it's better to fetch blob and create object URL

            const token = localStorage.getItem('auth_token') || ''; // Corrected key from 'token' to 'auth_token'
            // Note: If using cookies/NextAuth, fetch will automatically check cookies if same-origin.

            const query = new URLSearchParams({
                from: startDate,
                to: endDate,
                format: format,
                status: 'delivered,shipped' // Default status, maybe add selector later
            });

            // Using window.open is easiest for download if auth is via cookies
            // window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/reports/sales/export?${query.toString()}`, '_blank');

            // However, to catch errors better, let's use fetch blob
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/reports/sales/export?${query.toString()}`, {
                method: 'GET',
                credentials: 'include', // Important for cookies
                headers: {
                    'Authorization': `Bearer ${token}`, // If using bearer
                    // 'Cookie': ... browser handles this
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Export failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sales_report_${startDate}_to_${endDate}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showSuccessToast('Report downloaded successfully');
            onClose();

        } catch (error: any) {
            console.error('Export error:', error);
            showErrorToast(error.message || 'Failed to download report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaDownload className="text-[#cb6112]" />
                        Export Sales Report
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleExport} className="p-6 space-y-6">
                    {/* Quick Date Presets */}
                    <div className="flex gap-2 justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                const now = new Date();
                                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                setStartDate(firstDay.toISOString().split('T')[0]);
                                setEndDate(lastDay.toISOString().split('T')[0]);
                            }}
                            className="flex-1 py-1.5 px-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-400"
                        >
                            Bulan Ini
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const now = new Date();
                                const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                                const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
                                setStartDate(firstDay.toISOString().split('T')[0]);
                                setEndDate(lastDay.toISOString().split('T')[0]);
                            }}
                            className="flex-1 py-1.5 px-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-400"
                        >
                            Bulan Lalu
                        </button>
                    </div>

                    {/* Date Range Selection */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#cb6112] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Date
                            </label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#cb6112] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Export Format
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormat('csv')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${format === 'csv'
                                    ? 'border-[#cb6112] bg-orange-50 dark:bg-orange-900/20 text-[#cb6112]'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <FaFileCsv size={24} className="mb-2" />
                                <span className="font-medium text-sm">CSV</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormat('pdf')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${format === 'pdf'
                                    ? 'border-[#cb6112] bg-orange-50 dark:bg-orange-900/20 text-[#cb6112]'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <FaFilePdf size={24} className="mb-2" />
                                <span className="font-medium text-sm">PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 rounded-lg bg-[#cb6112] text-white font-medium hover:bg-[#b0520e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <FaDownload />
                                    Download Report
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExportReportModal;
