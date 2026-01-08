'use client';

import React, { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const OrdersTab = () => {
    const { orders, isLoading, error } = useOrders();
    const [filter, setFilter] = useState('all');

    const statusMap: any = {
        'pending': { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        'processing': { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: Package },
        'shipped': { label: 'Dikirim', color: 'bg-indigo-100 text-indigo-700', icon: Truck },
        'delivered': { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
        'cancelled': { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: AlertCircle },
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter((order: any) => order.status === filter);

    if (isLoading) return <div className="text-center py-10">Memuat pesanan...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Gagal memuat pesanan</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Riwayat Pesanan</h2>

            {/* Status Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === status
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {status === 'all' ? 'Semua Pesanan' : statusMap[status]?.label || status}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-gray-900 font-medium">Belum ada pesanan</h3>
                        <p className="text-gray-500 text-sm">Pesanan Anda akan muncul di sini</p>
                    </div>
                ) : (
                    filteredOrders.map((order: any) => {
                        const StatusIcon = statusMap[order.status]?.icon || AlertCircle;
                        return (
                            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-orange-200 transition-colors">
                                <div className="p-4 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${statusMap[order.status]?.color?.split(' ')[0] || 'bg-gray-100'}`}>
                                            <StatusIcon size={16} className={statusMap[order.status]?.color?.split(' ')[1] || 'text-gray-600'} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">No. Pesanan</p>
                                            <p className="font-mono text-sm font-bold text-gray-900">#{order.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className={`${statusMap[order.status]?.color} border-0`}>
                                            {statusMap[order.status]?.label}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {order.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 py-2">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md relative overflow-hidden shrink-0">
                                                <Image src={item.product?.images?.[0] || '/placeholder.png'} alt={item.product?.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 line-clamp-1">{item.product?.name}</h4>
                                                <p className="text-sm text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                                    <div className="text-sm text-gray-500">
                                        Total Pembayaran: <span className="text-orange-600 font-bold text-lg ml-2">{formatPrice(order.total)}</span>
                                    </div>
                                    <Link href={`/account/orders/${order.id}`}>
                                        <Button size="sm" variant="outline">Lihat Detail</Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
