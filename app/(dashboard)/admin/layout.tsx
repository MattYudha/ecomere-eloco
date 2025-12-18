'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { data: session, status } = useAuth();
  const router = useRouter();
  const isLoading = status === 'loading';

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.push('/login');
      } else if (session.user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [session, isLoading, router]);

  if (isLoading || !session || session.user?.role !== 'admin') {
    return null; // Or a loader
  }

  const backgroundClass = theme === 'light' ? 'bg-dark-bg' : 'bg-transparent';

  return <div className={backgroundClass}>{children}</div>;
}
