'use strict';

const express = require('express');
const path = require('path');

// =========================
// Environment (LOCAL ONLY)
// =========================
// Railway inject env via "Variables", bukan dari .env file.
// Jadi .env hanya dibaca saat dev/local.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

// =========================
// Crash visibility (biar kelihatan di Railway logs)
// =========================
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT_EXCEPTION]', err);
  // optional: process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED_REJECTION]', err);
  // optional: process.exit(1);
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
} = require('./middleware/rateLimiter');

const { handleServerError } = require('./utils/errorHandler');

// =========================
// App Init
// =========================
const app = express();

// Railway / reverse proxy
app.set('trust proxy', 1);

// =========================
// Health Check (PALING ATAS)
// =========================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// =========================
// CORS Configuration
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

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    console.warn(`[CORS BLOCKED] Origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-Id',
  ],
  optionsSuccessStatus: 204,
};

// CORS harus sebelum routes
app.use(cors(corsOptions));

// =========================
// OPTIONS short-circuit
// =========================
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

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
app.use(cookieParser());

// upload: pilih limit biar aman
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
    createParentPath: true,
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
app.use('/api/users/email', authLimiter);

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

// =========================
// 404 Handler
// =========================
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    requestId: req.reqId,
  });
});

// =========================
// Final Error Handler
// =========================
app.use((err, req, res, next) => {
  handleServerError(err, res, `${req.method} ${req.path}`);
});

// =========================
// Start Server (RAILWAY FIX)
// =========================
// Railway wajib pakai PORT dari environment. Jangan fallback hardcode saat production.
const isProd = process.env.NODE_ENV === 'production';

const PORT = isProd ? Number(process.env.PORT) : Number(process.env.PORT || 3001);

if (isProd && !PORT) {
  // Ini penting supaya kamu langsung tahu problem env di Railway logs
  throw new Error('PORT environment variable is not set in production');
}

// bind ke 0.0.0.0 supaya accessible via Railway proxy
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('CORS, rate limiting, logging ENABLED');
  console.log(`NODE_ENV=${process.env.NODE_ENV || 'undefined'}`);
});
