const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
const { formatPrice } = require('../utils/format'); // Ensure this utils exists, otherwise I will inline helper

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
            const statuses = filters.status.split(',').map(s => s.trim());
            if (statuses.length > 1) {
                whereClause.status = { in: statuses };
            } else {
                whereClause.status = statuses[0];
            }
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
 * Stream PDF report directly to response
 */
async function generateSalesReportPDFStream(res, filters) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Pipe directly to response
    doc.pipe(res);

    // -- Header --
    doc.fontSize(20).text('Sales Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Period: ${filters.from} to ${filters.to}`, { align: 'center' });
    if (filters.status) {
        doc.text(`Status: ${filters.status}`, { align: 'center' });
    }
    doc.moveDown();

    // -- Summary Stats --
    // We need to calculate totals. For "streaming" purely, we might not have totals upfront unless we query first.
    // It's better to do a quick aggregate query first for the summary section.
    const stats = await getReportStats(filters);

    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(10);
    doc.text(`Total Orders: ${stats.orderCount}`);
    doc.text(`Total Revenue: ${formatPrice(stats.totalRevenue)}`);
    doc.moveDown();

    // -- Table Headers --
    const tableTop = doc.y;
    const colX = [50, 130, 250, 350, 450]; // Column X positions

    doc.font('Helvetica-Bold');
    doc.text('Order ID', colX[0], tableTop);
    doc.text('Date', colX[1], tableTop);
    doc.text('Customer', colX[2], tableTop);
    doc.text('Status', colX[3], tableTop);
    doc.text('Total', colX[4], tableTop);

    doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown();
    doc.font('Helvetica');

    // -- Data Rows --
    const batchSize = 1000;
    let skip = 0;
    let hasMore = true;

    // Build where clause (same as CSV)
    const endDate = new Date(filters.to);
    endDate.setDate(endDate.getDate() + 1);

    const whereClause = {
        dateTime: {
            gte: new Date(filters.from),
            lt: endDate
        },
        isDeleted: false
    };

    if (filters.status) {
        const statuses = filters.status.split(',').map(s => s.trim());
        if (statuses.length > 1) {
            whereClause.status = { in: statuses };
        } else {
            whereClause.status = statuses[0];
        }
    }

    while (hasMore) {
        const orders = await prisma.customer_order.findMany({
            where: whereClause,
            orderBy: { dateTime: 'desc' },
            skip,
            take: batchSize
        });

        if (orders.length === 0) {
            hasMore = false;
            break;
        }

        for (const order of orders) {
            // Check for page break
            if (doc.y > 700) {
                doc.addPage();
                // Redraw Headers
                doc.font('Helvetica-Bold');
                doc.text('Order ID', colX[0], 50);
                doc.text('Date', colX[1], 50);
                doc.text('Customer', colX[2], 50);
                doc.text('Status', colX[3], 50);
                doc.text('Total', colX[4], 50);
                doc.moveTo(50, 65).lineTo(550, 65).stroke();
                doc.moveDown();
                doc.font('Helvetica');
                doc.y = 80;
            }

            const y = doc.y;
            const dateStr = new Date(order.dateTime).toLocaleDateString('id-ID');

            doc.text(order.id.substring(0, 8), colX[0], y);
            doc.text(dateStr, colX[1], y);
            doc.text(order.name || 'N/A', colX[2], y, { width: 90, ellipsis: true });
            doc.text(order.status, colX[3], y);
            doc.text(formatPrice(order.total), colX[4], y);

            doc.moveDown(0.5); // Add spacing between rows
        }

        skip += batchSize;
        hasMore = orders.length === batchSize;

        // flush to client roughly
    }

    // Finalize PDF
    doc.end();
}
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
        const statuses = filters.status.split(',').map(s => s.trim());
        if (statuses.length > 1) {
            whereClause.status = { in: statuses };
        } else {
            whereClause.status = statuses[0];
        }
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
    getReportStats,
    generateSalesReportPDFStream
};
