'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyOrdersRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.push('/account?tab=orders');
    }, [router]);

    return (
        <div className="flex h-[50vh] items-center justify-center">
            <p className="text-gray-500">Mengalihkan ke halaman akun...</p>
        </div>
    );
}