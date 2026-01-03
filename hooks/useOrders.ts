import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useOrders = () => {
    const { data } = useAuth();
    const user = data?.user;
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                // Fetch using the user ID endpoint (Corrected path: /api/orders not /api/customer-orders)
                const response = await fetch(`${baseUrl}/api/orders/user/${user.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setError('Gagal memuat riwayat pesanan');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    return { orders, isLoading, error };
};
