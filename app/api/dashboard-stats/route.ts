import { NextResponse } from 'next/server';
import prisma from '@/utils/db';
import { unstable_cache as cache } from 'next/cache';

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

// This function contains the core logic and is cached.
const getDashboardStats = cache(
  async () => {
    // 1. Define date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    // 2. Define all data fetching promises
    const todayRevenuePromise = prisma.customer_order.aggregate({
      _sum: { total: true },
      where: { updatedAt: { gte: today }, status: 'DELIVERED' },
    });

    const yesterdayRevenuePromise = prisma.customer_order.aggregate({
      _sum: { total: true },
      where: { updatedAt: { gte: yesterday, lt: today }, status: 'DELIVERED' },
    });

    const todayOrdersPromise = prisma.customer_order.count({
      where: { dateTime: { gte: today } },
    });

    const yesterdayOrdersPromise = prisma.customer_order.count({
      where: { dateTime: { gte: yesterday, lt: today } },
    });

    const todayCustomersPromise = prisma.user.count({
      where: { createdAt: { gte: today } },
    });

    const yesterdayCustomersPromise = prisma.user.count({
      where: { createdAt: { gte: yesterday, lt: today } },
    });

    const todayVisitorsPromise = prisma.visitorLog.groupBy({
      by: ['ipHash'],
      where: { createdAt: { gte: today } },
    });

    const yesterdayVisitorsPromise = prisma.visitorLog.groupBy({
      by: ['ipHash'],
      where: { createdAt: { gte: yesterday, lt: today } },
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
      todayRevenueResult,
      yesterdayRevenueResult,
      todayOrders,
      yesterdayOrders,
      todayCustomers,
      yesterdayCustomers,
      todayVisitorsGroups,
      yesterdayVisitorsGroups,
      weeklyOrders,
    ] = await Promise.all([
      todayRevenuePromise,
      yesterdayRevenuePromise,
      todayOrdersPromise,
      yesterdayOrdersPromise,
      todayCustomersPromise,
      yesterdayCustomersPromise,
      todayVisitorsPromise,
      yesterdayVisitorsPromise,
      weeklyRevenuePromise,
    ]);

    // 4. Process weekly revenue data in JS
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklySalesData = dayLabels.map((day) => ({ name: day, revenue: 0 }));

    weeklyOrders.forEach((order) => {
      const dayIndex = order.updatedAt.getDay();
      weeklySalesData[dayIndex].revenue += order.total;
    });

    // 5. Format the final stats object
    const todayRevenue = todayRevenueResult._sum.total || 0;
    const yesterdayRevenue = yesterdayRevenueResult._sum.total || 0;

    const todayVisitors = todayVisitorsGroups.length;
    const yesterdayVisitors = yesterdayVisitorsGroups.length;

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
  },
  ['dashboard-stats'], // Cache key
  { revalidate: 60 }, // Cache for 60 seconds
);

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[DASHBOARD_STATS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
