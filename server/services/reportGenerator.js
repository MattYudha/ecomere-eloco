const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CSV Header with accounting-ready columns
const CSV_HEADER = 'Order ID,Order Date,Customer Name,Email,Phone,Address,Payment Method,Order Status,Subtotal,Shipping Cost,Total,Courier,Courier Service\n';

/**
 * Streaming CSV generator for sales reports
 * Yields data in batches to prevent memory issues
 */
async function* generateSalesReportStream(filters) {
    // Yield UTF-8 BOM + header first
    yield CSV_HEADER;

    // Stream orders in batches (1000 at a time)
    const batchSize = 1000;
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
        // Build where clause dynamically
        // Add 1 day to 'to' date to make it inclusive (end of day)
        const endDate = new Date(filters.to);
        endDate.setDate(endDate.getDate() + 1);

        const whereClause = {
            dateTime: {
                gte: new Date(filters.from),
                lt: endDate  // Changed from lte to lt with +1 day
            },
            isDeleted: false
        };

        // Only add status filter if explicitly provided
        if (filters.status) {
            whereClause.status = filters.status;
        }

        console.log('[CSV Export] Query params:', {
            from: filters.from,
            to: filters.to,
            endDateAdjusted: endDate.toISOString(),
            status: filters.status,
            whereClause: JSON.stringify(whereClause)
        });

        const orders = await prisma.customer_order.findMany({
            where: whereClause,
            orderBy: { dateTime: 'desc' },
            skip,
            take: batchSize
        });

        console.log(`[CSV Export] Found ${orders.length} orders in batch ${skip / batchSize + 1}`);

        if (orders.length === 0) {
            hasMore = false;
            break;
        }

        // Convert to CSV rows
        for (const order of orders) {
            try {
                const csvRow = formatOrderToCSV(order);
                yield csvRow;
            } catch (error) {
                console.error(`[CSV Export] Error formatting order ${order.id}:`, error);
                // Continue with next order instead of failing entire export
            }
        }

        skip += batchSize;
        hasMore = orders.length === batchSize;
    }
}

/**
 * Format single order to CSV row
 * Handles CSV injection prevention and proper escaping
 */
function formatOrderToCSV(order) {
    // CSV escape function - prevents injection and handles special chars
    const escape = (str) => {
        if (!str) return '';
        const escaped = String(str).replace(/"/g, '""');
        // Wrap in quotes if contains comma, newline, or quote
        return escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')
            ? `"${escaped}"`
            : escaped;
    };

    // Format date in Asia/Jakarta timezone
    const date = new Date(order.dateTime).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Build full address
    const fullAddress = [
        order.adress,
        order.apartment,
        order.city,
        order.country
    ].filter(Boolean).join(', ');

    // Calculate subtotal (total - shipping)
    const shippingCost = order.shippingCost || 0;
    const subtotal = order.total - shippingCost;

    // Payment method
    const paymentMethod = order.paymentMethod || 'Non Tunai';

    // Build CSV row
    return [
        escape(order.id.substring(0, 8)),
        escape(date),
        escape(`${order.name} ${order.lastname}`.trim()),
        escape(order.email),
        escape(order.phone),
        escape(fullAddress),
        escape(paymentMethod),
        escape(order.status),
        subtotal,
        shippingCost,
        order.total,
        escape(order.courier || '-'),
        escape(order.courierService || '-')
    ].join(',') + '\n';
}

/**
 * Get report statistics (for confirmation dialog)
 */
async function getReportStats(filters) {
    // Build where clause dynamically
    // Add 1 day to 'to' date to make it inclusive (end of day)
    const endDate = new Date(filters.to);
    endDate.setDate(endDate.getDate() + 1);

    const whereClause = {
        dateTime: {
            gte: new Date(filters.from),
            lt: endDate  // Changed from lte to lt with +1 day
        },
        isDeleted: false
    };

    // Only add status filter if explicitly provided
    if (filters.status) {
        whereClause.status = filters.status;
    }

    const count = await prisma.customer_order.count({
        where: whereClause
    });

    const totalRevenue = await prisma.customer_order.aggregate({
        where: whereClause,
        _sum: {
            total: true
        }
    });

    return {
        orderCount: count,
        totalRevenue: totalRevenue._sum.total || 0
    };
}

module.exports = {
    generateSalesReportStream,
    getReportStats
};
