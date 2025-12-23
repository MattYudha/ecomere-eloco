const prisma = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler, AppError } = require('../utils/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me-in-prod';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Helper to set cookie
const setCookie = (req, res, token) => {
    // Simplify production check: Trust NODE_ENV.
    // In Railway/Vercel (Production), we MUST use Secure + SameSite: None for cross-origin cookies.
    const isProduction = process.env.NODE_ENV === 'production';

    const options = {
        httpOnly: true,
        secure: isProduction, // Always true in production (HTTPS)
        sameSite: isProduction ? 'none' : 'lax', // 'none' is required for cross-site (Vercel -> Railway)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    };

    // DEBUG: Print cookie settings
    console.log('[Auth] Setting Cookie:', {
        hostname: req.hostname,
        NODE_ENV: process.env.NODE_ENV,
        isProduction,
        options
    });

    res.cookie('eloco_session', token, options);
};

// Helper: exclude password
function excludePassword(user) {
    if (!user) return user;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, lastname, email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Email and password are required', 400);
    }

    const userExists = await prisma.user.findUnique({
        where: { email },
    });

    if (userExists) {
        throw new AppError('User already exists', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            name: name ? `${name} ${lastname || ''}`.trim() : undefined,
            email,
            password: hashedPassword,
            role: 'user', // Default role
        },
    });

    // Create Token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
    });

    setCookie(req, res, token);

    res.status(201).json({ user: excludePassword(user), token });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Please provide an email and password', 400);
    }

    // Check for user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
    }

    // Create Token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
    });

    setCookie(req, res, token);

    res.status(200).json({ user: excludePassword(user), token });
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('eloco_session', '', {
        expires: new Date(0), // Expire immediately
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/', // Ensure path matches creation
    });

    res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me OR /api/users/profile
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    let token;
    let authSource = 'none';

    // 1. Try Cookie
    if (req.cookies.eloco_session) {
        token = req.cookies.eloco_session;
        authSource = 'cookie';
    }

    // 2. Try Bearer Token (Fallback for mobile/API/cross-origin issues)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        authSource = 'header';
    }

    // DEBUG: Helpful logs for auth failures
    if (!token) {
        console.warn('[Auth] getMe - 401 Unauthorized. No token in Cookie or Header.');
        console.warn('Checks -> Cookie:', !!req.cookies.eloco_session, '| Header:', !!req.headers.authorization);
        throw new AppError('Not authorized to access this route', 401);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.status(200).json(excludePassword(user));
    } catch (err) {
        console.error('[Auth] getMe - Verification Error:', err.message);

        // Clear the invalid cookie so the browser stops sending it
        const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
        const isProduction = process.env.NODE_ENV === 'production' && !isLocalhost;
        res.cookie('eloco_session', '', {
            expires: new Date(0),
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
        });

        throw new AppError('Not authorized to access this route', 401);
    }
});

module.exports = {
    register,
    login,
    logout,
    getMe,
};
