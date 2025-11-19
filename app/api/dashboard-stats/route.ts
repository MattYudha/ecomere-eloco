import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0; // If previous is 0, any increase is 100%
  }
  return ((current - previous) / previous) * 100;
};

// Interface for weekly sales data objects
interface WeeklySaleData {
  name: string;
  revenue?: number; // revenue is added later, so it's optional initially
}

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
        updatedAt: {
          gte: today,
          lt: tomorrow,
        },
        status: "DELIVERED",
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
        updatedAt: {
          gte: yesterday,
          lt: today,
        },
        status: "DELIVERED",
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

    // --- Weekly Revenue Calculation ---
    const weeklyRevenuePromises = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklySalesData: WeeklySaleData[] = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(today.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const promise = prisma.customer_order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          updatedAt: {
            gte: day,
            lt: nextDay,
          },
          status: "DELIVERED",
        },
      });
      weeklyRevenuePromises.push(promise);
      weeklySalesData.push({ name: dayLabels[day.getDay()] });
    }
    // --- End of Weekly Revenue Calculation ---

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
      ...weeklyRevenueResults
    ] = await Promise.all([
      todayRevenuePromise,
      todayOrdersPromise,
      todayCustomersPromise,
      todayVisitorsPromise,
      yesterdayRevenuePromise,
      yesterdayOrdersPromise,
      yesterdayCustomersPromise,
      yesterdayVisitorsPromise,
      ...weeklyRevenuePromises,
    ]);

    // 5. Process results and calculate percentages
    const todayRevenue = todayRevenueResult._sum.total || 0;
    const yesterdayRevenue = yesterdayRevenueResult._sum.total || 0;

    const todayVisitors = todayVisitorsGroups.length;
    const yesterdayVisitors = yesterdayVisitorsGroups.length;

    // Process weekly revenue
    weeklyRevenueResults.forEach((result, index) => {
      weeklySalesData[index].revenue = result._sum.total || 0;
    });

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

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[DASHBOARD_STATS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}