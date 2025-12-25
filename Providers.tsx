'use client';
import { Toaster } from 'react-hot-toast';
import React from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 80,
        }}
        toastOptions={{
          // Default options
          duration: 3000,
          style: {
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            maxWidth: '500px',
          },
          // Success toast
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          // Error toast
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
          // Loading toast
          loading: {
            iconTheme: {
              primary: '#3B82F6',
              secondary: 'white',
            },
          },
        }}
      />
      {children}
    </>
  );
};

export default Providers;
