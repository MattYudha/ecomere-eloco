'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ClientLayoutWrapper = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const { theme } = useTheme();

    useEffect(() => {
        const isAdminPage = pathname?.startsWith('/admin');
        if (isAdminPage && theme === 'light') {
            document.body.classList.add('admin-light-mode');
        } else {
            document.body.classList.remove('admin-light-mode');
        }

        return () => {
            document.body.classList.remove('admin-light-mode');
        };
    }, [pathname, theme]);

    return (
        <motion.div
            key={pathname}
            className={
                theme === 'dark'
                    ? 'background-gradient-dark'
                    : 'background-gradient-light'
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
};

export default ClientLayoutWrapper;
