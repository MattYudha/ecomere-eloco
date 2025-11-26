'use client';

import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  const backgroundClass = theme === 'light' ? 'bg-dark-bg' : 'bg-transparent';

  return <div className={backgroundClass}>{children}</div>;
}
