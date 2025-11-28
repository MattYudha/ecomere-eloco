import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

async function getDashboardStats() {
  // 1. Define date ranges
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  // 2. Define all data fetching promises
  const revenuePromise = prisma.customer_order.findMany({
    where: {
      updatedAt: { gte: twoDaysAgo },
      status: 'DELIVERED',
    },
    select: {
      updatedAt: true,
      total: true,
    },
  });

  const ordersPromise = prisma.customer_order.findMany({
    where: {
      dateTime: { gte: twoDaysAgo },
    },
    select: {
      dateTime: true,
    },
  });

  const customersPromise = prisma.user.findMany({
    where: {
      createdAt: { gte: twoDaysAgo },
    },
    select: {
      createdAt: true,
    },
  });

  const visitorsPromise = prisma.visitorLog.findMany({
    where: {
      createdAt: { gte: twoDaysAgo },
    },
    select: {
      ipHash: true,
      createdAt: true,
    },
  });

  const weeklyRevenuePromise = prisma.customer_order.findMany({
    where: {
      updatedAt: { gte: sevenDaysAgo },
      status: 'DELIVERED',
    },
    select: {
      updatedAt: true,
      total: true,
    },
  });

  // 3. Execute all promises in parallel
  const [
    revenueData,
    ordersData,
    customersData,
    visitorsData,
    weeklyOrders,
  ] = await Promise.all([
    revenuePromise,
    ordersPromise,
    customersPromise,
    visitorsPromise,
    weeklyRevenuePromise,
  ]);

  // 4. Process results in JS
  const todayRevenue = revenueData.filter(o => o.updatedAt >= today).reduce((sum, o) => sum + o.total, 0);
  const yesterdayRevenue = revenueData.filter(o => o.updatedAt >= yesterday && o.updatedAt < today).reduce((sum, o) => sum + o.total, 0);

  const todayOrders = ordersData.filter(o => o.dateTime! >= today).length;
  const yesterdayOrders = ordersData.filter(o => o.dateTime! >= yesterday && o.dateTime! < today).length;

  const todayCustomers = customersData.filter(u => u.createdAt >= today).length;
  const yesterdayCustomers = customersData.filter(u => u.createdAt >= yesterday && u.createdAt < today).length;

  const todayVisitors = new Set(visitorsData.filter(v => v.createdAt >= today).map(v => v.ipHash)).size;
  const yesterdayVisitors = new Set(visitorsData.filter(v => v.createdAt >= yesterday && v.createdAt < today).map(v => v.ipHash)).size;

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklySalesData = dayLabels.map((day) => ({ name: day, revenue: 0 }));

  weeklyOrders.forEach((order) => {
    const dayIndex = order.updatedAt.getDay();
    weeklySalesData[dayIndex].revenue += order.total;
  });

  // 5. Format the final stats object
  const stats = {
    revenue: {
      value: todayRevenue,
      change: calculatePercentageChange(todayRevenue, yesterdayRevenue),
    },
    orders: {
      value: todayOrders,
      change: calculatePercentageChange(todayOrders, yesterdayOrders),
    },
    customers: {
      value: todayCustomers,
      change: calculatePercentageChange(todayCustomers, yesterdayCustomers),
    },
    visitors: {
      value: todayVisitors,
      change: calculatePercentageChange(todayVisitors, yesterdayVisitors),
    },
    weeklySales: weeklySalesData,
  };

  return stats;
}

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[DASHBOARD_STATS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
