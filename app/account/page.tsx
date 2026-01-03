'use client';

import React from 'react';
import ProfileTab from '@/components/account/ProfileTab';
import { OrdersTab } from '@/components/account/OrdersTab';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, ShoppingBag, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AccountPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { logout } = useAuth();

    const activeTab = searchParams.get('tab') || 'profile';

    const tabs = [
        { id: 'profile', label: 'Profil Saya', icon: User, component: <ProfileTab /> },
        { id: 'orders', label: 'Pesanan Saya', icon: ShoppingBag, component: <OrdersTab /> },
        // Add Wishlist later if needed
    ];

    const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || <ProfileTab />;

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 font-forum">Akun Saya</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1 space-y-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => router.push(`/account?tab=${tab.id}`)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}

                            <div className="my-2 border-t border-gray-100" />

                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} />
                                Keluar
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3">
                        {ActiveComponent}
                    </div>
                </div>
            </div>
        </main>
    );
}
