'use strict';

// Load env vars immediately
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');

// Coba load .env
const result = require('dotenv').config({ path: envPath });

if (result.error) {
    // Di production (Railway), .env file mungkin tidak ada karena variables di-inject langsung.
    // Kita suppress error ENOENT agar logs tidak penuh error palsu.
    if (result.error.code === 'ENOENT') {
        console.log('[INFO] .env file not found (likely production environment). Using system environment variables.');
    } else {
        console.error('[WARN] Failed to load .env file:', result.error);
    }
} else {
    console.log('[INFO] Loaded environment variables from .env file.');
}

// Opsional: Load parent .env jika ada (setup monorepo lokal)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
// path is already required above
const http = require('http');
const socketIo = require('./utils/socket');

// =========================
// Environment (LOCAL ONLY)
// =========================
// (Moved to top)

// =========================
// Crash visibility (biar kelihatan di Railway logs)
// =========================
process.on('uncaughtException', (err) => {
    console.error('[UNCAUGHT_EXCEPTION]', err);
});

process.on('unhandledRejection', (err) => {
    console.error('[UNHANDLED_REJECTION]', err);
});

const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// =========================
// Routers
// =========================
const productsRouter = require('./routes/products');
const productImagesRouter = require('./routes/productImages');
const categoryRouter = require('./routes/category');
const searchRouter = require('./routes/search');
const mainImageRouter = require('./routes/mainImages');
const userRouter = require('./routes/users');
const orderRouter = require('./routes/customer_orders');
const slugRouter = require('./routes/slugs');
const orderProductRouter = require('./routes/customer_order_product');
const wishlistRouter = require('./routes/wishlist');
const notificationsRouter = require('./routes/notifications');
const merchantRouter = require('./routes/merchant');
const bulkUploadRouter = require('./routes/bulkUpload');
const dashboardStatsRouter = require('./routes/dashboardStats');
const authRouter = require('./routes/auth');
const reviewsRouter = require('./routes/reviews');
// Use lightweight admin router (no Puppeteer/label generation)
const adminRouter = require('./routes/admin-lite');

// =========================
// Middleware & Utils
// =========================
const {
    addRequestId,
    requestLogger,
    errorLogger,
    securityLogger,
} = require('./middleware/requestLogger');

const trackVisitor = require('./middleware/visitorTracker');

const {
    generalLimiter,
    authLimiter,
    userManagementLimiter,
    uploadLimiter,
    searchLimiter,
    orderLimiter,
    wishlistLimiter,
    lookupLimiter,
} = require('./middleware/rateLimiter');

const { handleServerError } = require('./utils/errorHandler');

// =========================
// App Init
// =========================
// =========================
// App Init
// =========================
const app = express();
const server = http.createServer(app);
socketIo.init(server);

// Railway / reverse proxy (penting untuk ip/secure cookies jika ada)
app.set('trust proxy', 1);

// =========================
// Basic routes (paling atas)
// =========================
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// =========================
// CORS Configuration (SAFE)
// =========================
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://eloco.vercel.app',
    'https://elloco.vercel.app',
    process.env.FRONTEND_URL,
    process.env.NEXTAUTH_URL,
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // allow non-browser / server-to-server (curl, health checks, etc.)
        if (!origin) return callback(null, true);

        const ok =
            allowedOrigins.includes(origin) ||
            // opsi: subdomain vercel preview
            origin.endsWith('.vercel.app');

        if (!ok) {
            console.warn(`[CORS BLOCKED] Origin: ${origin}`);
            // Still allow the request but don't set CORS headers
            return callback(null, false);
        }

        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-Request-Id',
    ],
    exposedHeaders: ['X-Request-Id'],
    optionsSuccessStatus: 204,
    preflightContinue: false,
};

// CORS harus sebelum routes
app.use(cors(corsOptions));

// Note: CORS middleware already handles OPTIONS preflight requests
// No need for explicit app.options() handler

// =========================
// Core Middlewares
// =========================
app.use(addRequestId);
app.use(securityLogger);
app.use(trackVisitor);
app.use(requestLogger);
app.use(errorLogger);

app.use(generalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// upload: limit biar aman
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
        abortOnLimit: true,
        createParentPath: true,
        limitHandler: (req, res, next) => {
            res.status(413).json({ error: 'File too large. Maximum size is 50MB.' });
        },
    })
);

// =========================
// Rate Limited Groups
// =========================
app.use('/api/users', userManagementLimiter);
app.use('/api/search', searchLimiter);
app.use('/api/orders', orderLimiter);
app.use('/api/order-product', orderLimiter);
app.use('/api/images', uploadLimiter);
app.use('/api/main-image', uploadLimiter);
app.use('/api/wishlist', wishlistLimiter);
app.use('/api/bulk-upload', uploadLimiter);
app.use('/api/users/email', lookupLimiter);

// =========================
// API Routes
// =========================
app.use('/api/products', productsRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/images', productImagesRouter);
app.use('/api/main-image', mainImageRouter);
app.use('/api/users', userRouter);
app.use('/api/search', searchRouter);
app.use('/api/orders', orderRouter);
app.use('/api/order-product', orderProductRouter);
app.use('/api/slugs', slugRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/merchants', merchantRouter);
app.use('/api/bulk-upload', bulkUploadRouter);
app.use('/api/dashboard-stats', dashboardStatsRouter);
app.use('/api/auth', authRouter);
app.use('/api/reviews', reviewsRouter);
// Admin routes (lightweight version - CSV export only, no label printing)
app.use('/api/admin', adminRouter);

// =========================
// 404 Handler
// =========================
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        requestId: req.reqId,
        path: req.originalUrl,
    });
});

// =========================
// Final Error Handler
// =========================
app.use((err, req, res, next) => {
    try {
        console.error('[EXPRESS_ERROR]', {
            requestId: req.reqId,
            method: req.method,
            path: req.originalUrl,
            message: err?.message,
            stack: err?.stack,
        });
    } catch (_) {
        // ignore logging errors
    }

    handleServerError(err, res, `${req.method} ${req.path}`);
});

// =========================
// Start Server (RAILWAY FIX)
// =========================
// Railway umumnya pakai PORT. Beberapa setup pakai RAILWAY_TCP_APPLICATION_PORT.
// Kita ambil yang tersedia, fallback aman untuk local.
const PORT =
    Number(process.env.PORT) ||
    Number(process.env.RAILWAY_TCP_APPLICATION_PORT) ||
    3001;

// bind ke 0.0.0.0 supaya accessible via Railway proxy
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`NODE_ENV=${process.env.NODE_ENV || 'undefined'}`);
    console.log(`ENV PORT=${process.env.PORT || 'undefined'}`);
    console.log(
        `RAILWAY_TCP_APPLICATION_PORT=${process.env.RAILWAY_TCP_APPLICATION_PORT || 'undefined'}`
    );
    console.log('CORS, rate limiting, logging ENABLED');
});