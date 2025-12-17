const prisma = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler, AppError } = require('../utils/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me-in-prod';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Helper to set cookie
const setCookie = (req, res, token) => {
    const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    const isProduction = process.env.NODE_ENV === 'production' && !isLocalhost;

    const options = {
        httpOnly: true,
        secure: isProduction, // True in Prod (HTTPS), False in Dev (HTTP or Localhost)
        sameSite: isProduction ? 'none' : 'lax', // None for cross-site (Prod), Lax for Localhost
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

    res.status(201).json(excludePassword(user));
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

    res.status(200).json(excludePassword(user));
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
    const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    const isProduction = process.env.NODE_ENV === 'production' && !isLocalhost;

    res.cookie('eloco_session', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    });

    res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me OR /api/users/profile
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    let token;

    // DEBUG: Check incoming cookies
    console.log('[Auth] getMe - Cookies received:', req.cookies);
    console.log('[Auth] getMe - Headers received:', req.headers.authorization ? 'Has Auth Header' : 'No Auth Header');

    if (req.cookies.eloco_session) {
        token = req.cookies.eloco_session;
    }

    //   // Allow Bearer token as fallback?
    //   if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     token = req.headers.authorization.split(' ')[1];
    //   }

    if (!token) {
        // Return null or 401? useAuth expects 401/error to set user null
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
        throw new AppError('Not authorized to access this route', 401);
    }
});

module.exports = {
    register,
    login,
    logout,
    getMe,
};
