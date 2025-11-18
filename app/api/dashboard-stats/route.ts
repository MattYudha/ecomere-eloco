import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0; // If previous is 0, any increase is 100%
  }
  return ((current - previous) / previous) * 100;
};

export async function GET() {
  try {
    // 1. Define date ranges for today and yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 2. Fetch data for today
    const todayRevenuePromise = prisma.customer_order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        dateTime: {
          gte: today,
          lt: tomorrow,
        },
        status: "COMPLETED",
      },
    });

    const todayOrdersPromise = prisma.customer_order.count({
      where: {
        dateTime: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const todayCustomersPromise = prisma.user.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const todayVisitorsPromise = prisma.visitorLog.groupBy({
      by: ['ipHash'],
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // 3. Fetch data for yesterday for comparison
    const yesterdayRevenuePromise = prisma.customer_order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        dateTime: {
          gte: yesterday,
          lt: today,
        },
        status: "COMPLETED",
      },
    });

    const yesterdayOrdersPromise = prisma.customer_order.count({
      where: {
        dateTime: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    const yesterdayCustomersPromise = prisma.user.count({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    const yesterdayVisitorsPromise = prisma.visitorLog.groupBy({
      by: ['ipHash'],
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    // 4. Execute all promises in parallel
    const [
      todayRevenueResult,
      todayOrders,
      todayCustomers,
      todayVisitorsGroups,
      yesterdayRevenueResult,
      yesterdayOrders,
      yesterdayCustomers,
      yesterdayVisitorsGroups,
    ] = await Promise.all([
      todayRevenuePromise,
      todayOrdersPromise,
      todayCustomersPromise,
      todayVisitorsPromise,
      yesterdayRevenuePromise,
      yesterdayOrdersPromise,
      yesterdayCustomersPromise,
      yesterdayVisitorsPromise,
    ]);

    // 5. Process results and calculate percentages
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
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[DASHBOARD_STATS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}