'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ClientLayoutWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  useEffect(() => {
    const isAdminPage = pathname.startsWith('/admin');
    if (isAdminPage && theme === 'light') {
      document.body.classList.add('admin-light-mode');
    } else {
      document.body.classList.remove('admin-light-mode');
    }

    // Cleanup function to remove the class when the component unmounts or dependencies change
    return () => {
      document.body.classList.remove('admin-light-mode');
    };
  }, [pathname, theme]);

  return (
    <AnimatePresence>
      <motion.div
        key={pathname}
        className={
          theme === 'dark'
            ? 'background-gradient-dark'
            : 'background-gradient-light'
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ClientLayoutWrapper;
