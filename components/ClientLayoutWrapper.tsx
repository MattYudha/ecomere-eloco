'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { useTheme } from 'next-themes';

const ClientLayoutWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <AnimatePresence mode="wait">
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
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ClientLayoutWrapper;
