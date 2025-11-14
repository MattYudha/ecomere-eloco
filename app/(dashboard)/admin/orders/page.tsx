'use client';
import { AdminOrders, DashboardSidebar } from '@/components';
import React from 'react';

const DashboardOrdersPage = () => {
  return (
    <div className="flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit relative z-10">
      <DashboardSidebar />
      <AdminOrders />
    </div>
  );
};

export default DashboardOrdersPage;
