const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { generateSalesReportStream, getReportStats } = require('../services/reportGenerator');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();

// Admin auth middleware - MUST run after authMiddleware
function requireAdmin(req, res, next) {
    // Check if user is authenticated and is admin
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
}

// ============================================
// SALES REPORT EXPORT (NO PUPPETEER NEEDED)
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
