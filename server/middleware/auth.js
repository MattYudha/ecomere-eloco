const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  let token = req.header('Authorization');

  console.log('[AUTH_DEBUG] Authorization Header:', token ? 'PRESENT' : 'MISSING');
  console.log('[AUTH_DEBUG] Cookies:', req.cookies ? Object.keys(req.cookies) : 'NONE');

  // Check cookies if no header
  if (!token && req.cookies && req.cookies.eloco_session) {
    console.log('[AUTH_DEBUG] Found eloco_session cookie');
    token = req.cookies.eloco_session;
  } else if (token) {
    // If header exists, split "Bearer TOKEN"
    token = token.split(' ')[1];
  }

  // Check if no token
  if (!token) {
    console.log('[AUTH_DEBUG] No token found in header or cookies');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const tokenString = token; // Token is now just the string

    // Expected format: "Bearer TOKEN_STRING"
    // const tokenString = token.split(' ')[1]; 
    if (!tokenString) {
      return res.status(401).json({ msg: 'Token format invalid, authorization denied' });
    }

    // Replace with your actual JWT secret from environment variables
    // For development, you might use a placeholder, but ensure it's secure in production.
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ msg: 'Internal Server Error: JWT secret not configured.' });
    }

    const decoded = jwt.verify(tokenString, jwtSecret);

    // Attach user to the request object
    // Payload is { id, role } directly
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
