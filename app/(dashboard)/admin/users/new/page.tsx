'use client';

import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function NewUserPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'user',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // --------------------------
    // HANDLE INPUT CHANGE
    // --------------------------
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // --------------------------
    // HANDLE SUBMIT
    // --------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            toast.error('Email and password are required');
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        setIsSubmitting(true);

        try {
            await apiClient.post('/api/users', formData);

            toast.success('User created successfully');

            // Redirect ke halaman list user
            router.push('/admin/users');
        } catch (error: any) {
            console.error('Error creating user:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to create user';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen">
            <DashboardSidebar />
            <div className="flex-1 p-10 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New User</h1>
                    <Link
                        href="/admin/users"
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                    >
                        Cancel
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* EMAIL */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#cb6112] focus:border-transparent transition-colors"
                                placeholder="email@example.com"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength={8}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#cb6112] focus:border-transparent transition-colors"
                                placeholder="Minimum 8 characters"
                            />
                        </div>

                        {/* ROLE */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#cb6112] focus:border-transparent transition-colors"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
