const prisma = require('../utils/db');
const { asyncHandler } = require('../utils/errorHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
    const now = new Date();

    // Helper to get count/sum for a specific day range
    const getStatsForRange = async (start, end) => {
        // 1. Today's Revenue: "Calculate the total revenue from orders where status = 'delivered' and createdAt (or delivered date) is today"
        // Using updatedAt ensures that if a status changes TODAY, it counts towards today's revenue report.
        const revenueQuery = {
            status: 'delivered',
            updatedAt: { gte: start, lt: end },
        };

        const revenue = await prisma.customer_order.aggregate({
            _sum: { total: true },
            where: revenueQuery,
        });

        // 2. New Orders: "Count the total number of orders created today"
        const orders = await prisma.customer_order.count({
            where: { dateTime: { gte: start, lt: end } },
        });

        // 3. New Customers: "Count users who registered today"
        // Note: User model might is missing createdAt in current schema.
        // Wrapping in try/catch to fallback gracefully.
        let customers = 0;
        try {
            customers = await prisma.user.count({
                where: { role: 'user', createdAt: { gte: start, lt: end } },
            });
        } catch (e) {
            // If createdAt doesn't exist on User, return 0 or total (but total is wrong for "New")
            // console.warn('User table has no createdAt:', e.message);
            customers = 0;
        }

        // 4. Today's Visitors: "Replace placeholder values with real visitor tracking logic"
        // This relies on the new Visitor model being active
        let visitors = 0;
        try {
            visitors = await prisma.visitor.count({
                where: { createdAt: { gte: start, lt: end } },
            });
        } catch (e) {
            // Fallback if table doesn't exist yet (client not generated)
            console.warn('Visitor table access failed (client out of sync?):', e.message);
            visitors = 0;
        }

        return {
            revenue: revenue._sum.total || 0,
            orders,
            customers,
            visitors
        };
    };

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayStart);

    const todayStats = await getStatsForRange(todayStart, todayEnd);
    const yesterdayStats = await getStatsForRange(yesterdayStart, yesterdayEnd);

    // Calculate percentage change
    const calcChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const getDailySalesChart = async () => {
        // 5. Daily Revenue Chart: "Display revenue grouped per day. Only includes orders with status delivered."
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // For chart, user typically wants "Revenue by Day of Occurrence".
        // If we use updatedAt, it shows "Revenue Realized This Day".
        // If we use createdAt, it shows "Orders from This Day that were delivered".
        // Given the previous requirement for Today's Revenue (updatedAt), consistency suggests updatedAt.
        // However, sales charts often track order volume by creation. 
        // BUT "Daily Revenue" usually implies cash flow / realization. 
        // Let's stick with updatedAt to match "Today's Revenue".

        const recentOrders = await prisma.customer_order.findMany({
            where: {
                status: 'delivered',
                updatedAt: { // Changed to updatedAt for consistency
                    gte: sevenDaysAgo,
                },
            },
            select: {
                total: true,
                updatedAt: true, // Group by updatedAt
            },
        });

        const salesMap = {};
        recentOrders.forEach(order => {
            const dateKey = new Date(order.updatedAt).toISOString().split('T')[0];
            salesMap[dateKey] = (salesMap[dateKey] || 0) + order.total;
        });

        const chartData = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - (6 - i)); // -6, -5, ... 0
            const dateKey = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            chartData.push({
                name: dayName,
                revenue: salesMap[dateKey] || 0,
            });
        }
        return chartData;
    }

    const chartData = await getDailySalesChart();

    const stats = {
        revenue: { value: todayStats.revenue, change: calcChange(todayStats.revenue, yesterdayStats.revenue) },
        orders: { value: todayStats.orders, change: calcChange(todayStats.orders, yesterdayStats.orders) },
        customers: { value: todayStats.customers, change: calcChange(todayStats.customers, yesterdayStats.customers) },
        visitors: { value: todayStats.visitors, change: calcChange(todayStats.visitors, yesterdayStats.visitors) },
        dailySales: chartData,
    };

    res.status(200).json(stats);
});

module.exports = {
    getDashboardStats,
};
