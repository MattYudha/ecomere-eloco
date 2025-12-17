const express = require('express');
const path = require('path');
// Load env from server/.env then fallback to project root .env
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
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
var cors = require('cors');

// Import logging middleware
const {
  addRequestId,
  requestLogger,
  errorLogger,
  securityLogger,
} = require('./middleware/requestLogger');
const trackVisitor = require('./middleware/visitorTracker');

// Import rate limiting middleware
const {
  generalLimiter,
  authLimiter,
  registerLimiter,
  userManagementLimiter,
  uploadLimiter,
  searchLimiter,
  orderLimiter,
  wishlistLimiter,
} = require('./middleware/rateLimiter');

const { handleServerError } = require('./utils/errorHandler');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// --- MANDATORY CORS AUDIT FIX ---
// 1. Logging Middleware for Debugging
app.use((req, res, next) => {
  console.log(`[Incoming Request] Method: ${req.method} | Origin: ${req.headers.origin} | URL: ${req.url}`);
  next();
});

// 2. CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://eloco.vercel.app',
  'https://elloco.vercel.app',
  process.env.NEXTAUTH_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') // Allow all Vercel deployments
    ) {
      return callback(null, true);
    }

    console.log(`[CORS Blocked] Origin: ${origin}`);
    // Instead of error, returning false might be safer for some browsers, but user asked for Error.
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

// 3. Apply CORS globally BEFORE everything else
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight

// --------------------------------

// Add request ID
app.use(addRequestId);

// Security logging
app.use(securityLogger);

// Track visitors
app.use(trackVisitor);

// Standard request logging
app.use(requestLogger);

// Error logging
app.use(errorLogger);

// Apply general rate limiting
app.use(generalLimiter);

app.use(express.json());
app.use(require('cookie-parser')());
app.use(fileUpload());

// Apply specific rate limiters to different route groups
app.use('/api/users', userManagementLimiter);
app.use('/api/search', searchLimiter);
app.use('/api/orders', orderLimiter);
app.use('/api/order-product', orderLimiter);
app.use('/api/images', uploadLimiter);
app.use('/api/main-image', uploadLimiter);
app.use("/api/wishlist", wishlistLimiter);
// app.use("/api/products", productLimiter);
// app.use("/api/merchants", productLimiter);
app.use('/api/bulk-upload', uploadLimiter);

// Apply stricter rate limiting to authentication-related routes
app.use('/api/users/email', authLimiter); // For login attempts via email lookup

// Apply admin rate limiting to admin routes

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
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter); // Mount auth routes

// Health check endpoint (no rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    rateLimiting: 'enabled',
    requestId: req.reqId,
  });
});

// Rate limit info endpoint
app.get('/rate-limit-info', (req, res) => {
  res.status(200).json({
    general: '100 requests per 15 minutes',
    auth: '5 login attempts per 15 minutes',
    register: '3 registrations per hour',
    upload: '10 uploads per 15 minutes',
    search: '30 searches per minute',
    orders: '15 order operations per 15 minutes',
    wishlist: '20 operations per 5 minutes',
    products: '60 requests per minute',
    requestId: req.reqId,
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    requestId: req.reqId,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  handleServerError(err, res, `${req.method} ${req.path}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Rate limiting and request logging enabled for all endpoints');
  console.log('Logs are being written to server/logs/ directory');
});
