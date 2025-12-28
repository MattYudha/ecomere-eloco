const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { generateShippingLabel, generateBulkLabels } = require('../services/labelGenerator');
const { generateSalesReportStream, getReportStats } = require('../services/reportGenerator');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();

// Concurrency tracking for bulk prints
let activeBulkPrints = 0;
const MAX_CONCURRENT_BULK = 2;

// Admin auth middleware - MUST run after authMiddleware
function requireAdmin(req, res, next) {
    // Check if user is authenticated and is admin
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
}

// Generate idempotent batch ID
function generateBatchId(orderIds, userId) {
    return crypto
        .createHash('sha256')
        .update(orderIds.sort().join(',') + userId)
        .digest('hex')
        .substring(0, 16);
}

// POST /api/admin/orders/:id/label (SINGLE LABEL)
router.post('/orders/:id/label', authMiddleware, requireAdmin, async (req, res) => {
    const startTime = Date.now();

    try {
        const { id } = req.params;

        // Get order with validation
        const order = await prisma.customer_order.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // SECURITY: Validate order ownership (if multi-merchant)
        // Uncomment if you have merchantId in orders:
        // if (req.user.merchantId && order.merchantId !== req.user.merchantId) {
        //   return res.status(403).json({ error: 'Access denied' });
        // }

        // Validate courier is set (NO DEFAULT)
        if (!order.courier) {
            return res.status(400).json({
                error: 'Courier belum dipilih. Silakan pilih kurir terlebih dahulu.',
                field: 'courier'
            });
        }

        // Generate PDF
        const pdf = await generateShippingLabel(order);

        // PHASE 2: Database audit log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'PRINT_LABEL',
                orderId: order.id,
                requestId: req.headers['x-request-id'] || null,
                metadata: {
                    courier: order.courier,
                    courierService: order.courierService,
                    timestamp: new Date().toISOString(),
                    duration: Date.now() - startTime
                }
            }
        });

        console.log('[AUDIT] Label printed:', {
            orderId: order.id,
            userId: req.user.id,
            courier: order.courier,
            duration: Date.now() - startTime + 'ms'
        });

        // Set headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', pdf.length);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Label_${order.id.substring(0, 8)}.pdf`
        );

        // Send PDF as binary buffer
        res.end(pdf, 'binary');

    } catch (error) {
        console.error('[API] Error generating label:', error);

        // Specific error messages
        if (error.message && error.message.includes('busy')) {
            return res.status(503).json({
                error: 'Server sedang sibuk. Silakan coba lagi.'
            });
        }

        res.status(500).json({ error: 'Gagal generate label' });
    }
});

// Payload size guard for bulk print
function validateBulkPrintPayload(req, res, next) {
    const { orderIds } = req.body;

    // Validate array
    if (!Array.isArray(orderIds)) {
        return res.status(400).json({ error: 'orderIds must be an array' });
    }

    // Hard limit: max 50 IDs
    if (orderIds.length > 50) {
        return res.status(400).json({
            error: 'Maximum 50 orders at once',
            limit: 50,
            received: orderIds.length
        });
    }

    // Validate each ID is string
    const invalidIds = orderIds.filter(id => typeof id !== 'string');
    if (invalidIds.length > 0) {
        return res.status(400).json({
            error: 'All orderIds must be strings',
            invalidCount: invalidIds.length
        });
    }

    next();
}

// POST /api/admin/orders/bulk-label (BULK PRINT)
router.post('/orders/bulk-label', authMiddleware, requireAdmin, validateBulkPrintPayload, async (req, res) => {
    const startTime = Date.now();

    // Concurrency limit
    if (activeBulkPrints >= MAX_CONCURRENT_BULK) {
        return res.status(503).json({
            error: 'Server sedang memproses bulk print lain. Silakan tunggu.'
        });
    }

    activeBulkPrints++;

    try {
        const { orderIds, sortBy = 'createdAt' } = req.body;

        // Validation
        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ error: 'No orders selected' });
        }

        if (orderIds.length > 50) {
            return res.status(400).json({
                error: 'Maximum 50 orders at once',
                limit: 50
            });
        }

        // Generate idempotent batch ID
        const batchId = generateBatchId(orderIds, req.user.id);

        // Check if already processed (idempotency)
        const existing = await prisma.auditLog.findUnique({
            where: { batchId }
        });

        if (existing) {
            console.log('[Bulk] Duplicate request detected, batchId:', batchId);
            // Still generate PDF (idempotent operation)
            // But don't create new audit log
        }

        // Get orders with sorting
        const orders = await prisma.customer_order.findMany({
            where: {
                id: { in: orderIds },
                courier: { not: null } // Only orders with courier
            },
            orderBy: {
                [sortBy]: 'desc' // createdAt, courier, city
            }
        });

        if (orders.length === 0) {
            return res.status(400).json({
                error: 'No valid orders found. Ensure all orders have courier selected.'
            });
        }

        // Generate bulk PDF with partial failure handling
        const result = await generateBulkLabels(orders);

        // Log failures
        if (result.stats.failed > 0) {
            console.warn('[Bulk] Partial failure:', result.stats);
        }

        const duration = Date.now() - startTime;

        // Performance warning
        if (duration > 15000) {
            console.warn('[Bulk] Slow bulk print:', {
                orderCount: orders.length,
                duration: duration + 'ms'
            });
        }

        // Create audit log (if not duplicate)
        if (!existing) {
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'BULK_PRINT_LABEL',
                    orderIds: orderIds,
                    batchId: batchId,
                    requestId: req.headers['x-request-id'] || null,
                    metadata: {
                        orderCount: orders.length,
                        successful: result.stats.successful,
                        failed: result.stats.failed,
                        failedOrders: result.stats.failedOrders,
                        sortBy: sortBy,
                        duration: duration,
                        timestamp: new Date().toISOString()
                    }
                }
            });
        }

        console.log('[AUDIT] Bulk labels printed:', {
            batchId,
            userId: req.user.id,
            total: result.stats.total,
            successful: result.stats.successful,
            failed: result.stats.failed,
            duration: duration + 'ms'
        });

        // Set custom header with stats
        res.setHeader('X-Label-Stats', JSON.stringify(result.stats));
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Labels_Bulk_${batchId}.pdf`
        );

        // Send PDF
        res.send(result.pdf);

    } catch (error) {
        console.error('[API] Error generating bulk labels:', error);

        if (error.message && error.message.includes('busy')) {
            return res.status(503).json({
                error: 'Server sedang sibuk. Silakan coba lagi.'
            });
        }

        res.status(500).json({ error: 'Gagal generate bulk labels' });
    } finally {
        activeBulkPrints--;
    }
});

// ============================================
// SALES REPORT EXPORT
// ============================================

// Export sales report to CSV
router.get('/reports/sales/export', authMiddleware, requireAdmin, async (req, res) => {
    const { from, to, format = 'csv', status } = req.query;

    // Validation
    if (!from || !to) {
        return res.status(400).json({ error: 'from and to dates required (YYYY-MM-DD)' });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);

    if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Max 1 year range
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (endDate - startDate > oneYear) {
        return res.status(400).json({ error: 'Max date range: 1 year' });
    }

    // Ensure endDate is after startDate
    if (endDate < startDate) {
        return res.status(400).json({ error: 'End date must be after start date' });
    }

    try {
        console.log(`[Export] User ${req.user.id} requesting export from ${from} to ${to}`);

        // Create audit log
        await prisma.auditLog.create({
            data: {
                action: 'EXPORT_SALES_REPORT',
                userId: req.user.id,
                metadata: JSON.stringify({
                    from,
                    to,
                    format,
                    status: status || 'delivered,shipped',
                    timestamp: new Date().toISOString(),
                    userEmail: req.user.email
                })
            }
        }).catch(err => {
            // Log error but don't fail export
            console.error('[Export] Audit log failed:', err.message);
        });

        // Set response headers
        const filename = `sales_report_${from}_to_${to}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Cache-Control', 'no-cache');

        // UTF-8 BOM for Excel compatibility
        res.write('\uFEFF');

        // Stream CSV data
        const stream = generateSalesReportStream({ from, to, status });

        let rowCount = 0;
        for await (const chunk of stream) {
            res.write(chunk);
            if (rowCount === 0) {
                rowCount++; // Header
            } else {
                rowCount++;
            }
        }

        res.end();

        console.log(`[Export] Successfully exported ${rowCount - 1} orders`);

    } catch (error) {
        console.error('[Export] Error:', error);

        // If headers already sent, can't send JSON error
        if (res.headersSent) {
            res.end();
        } else {
            res.status(500).json({ error: 'Export failed. Please try again.' });
        }
    }
});

// Get report statistics (for confirmation dialog)
router.get('/reports/sales/stats', authMiddleware, requireAdmin, async (req, res) => {
    const { from, to, status } = req.query;

    if (!from || !to) {
        return res.status(400).json({ error: 'from and to dates required' });
    }

    try {
        const stats = await getReportStats({ from, to, status });
        res.json(stats);
    } catch (error) {
        console.error('[Stats] Error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

module.exports = router;
