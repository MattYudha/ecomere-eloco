const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Routers
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

// Logging & utils
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

const app = express();
app.set('trust proxy', 1);

/* =========================
   CORS Configuration
   ========================= */

// Debug incoming requests (useful for monitoring origins)
app.use((req, res, next) => {
  console.log(
    `[Incoming] ${req.method} | Origin: ${req.headers.origin || 'none'} | ${req.url}`
  );
  next();
});

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
    // Allow non-browser requests (curl, server-to-server)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    console.warn(`[CORS BLOCKED] Origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// Apply CORS globally
// Apply CORS globally
app.use(cors(corsOptions));
// Express 5 fix: '*' is not supported, use '(.*)' or avoid it.
// However, since we have invalid options requests handled below manually, 
// strictly speaking we might not need this if we use app.use(cors()) and the bypass. 
// But to keep it working with the library's recommended setup (adjusted for v5):
app.options('(.*)', cors(corsOptions));

// GLOBAL PREFLIGHT BYPASS
// Ensure OPTIONS requests return 204 immediately, bypassing all subsequent middleware (auth, etc.)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

/* =========================
   Core Middlewares
   ========================= */

app.use(addRequestId);
app.use(securityLogger);
app.use(trackVisitor);
app.use(requestLogger);
app.use(errorLogger);

app.use(generalLimiter);

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

/* =========================
   Rate-limited Routes
   ========================= */

app.use('/api/users', userManagementLimiter);
app.use('/api/search', searchLimiter);
app.use('/api/orders', orderLimiter);
app.use('/api/order-product', orderLimiter);
app.use('/api/images', uploadLimiter);
app.use('/api/main-image', uploadLimiter);
app.use('/api/wishlist', wishlistLimiter);
app.use('/api/bulk-upload', uploadLimiter);
app.use('/api/users/email', authLimiter);

/* =========================
   API Routes
   ========================= */

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

/* =========================
   Health & Info
   ========================= */

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    requestId: req.reqId,
  });
});

/* =========================
   404 & Error Handling
   ========================= */

// 404 & Error Handling
// =========================

// Express 5 fix: Use pathless middleware for catch-all instead of '*'
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    requestId: req.reqId,
  });
});

// Final error handler (OPTIONS already bypassed)
app.use((err, req, res, next) => {
  handleServerError(err, res, `${req.method} ${req.path}`);
});

/* =========================
   Start Server
   ========================= */

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS, rate limiting, logging ENABLED');
});
