const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // Expected format: "Bearer TOKEN_STRING"
    const tokenString = token.split(' ')[1]; 
    if (!tokenString) {
        return res.status(401).json({ msg: 'Token format invalid, authorization denied' });
    }

    // Replace with your actual JWT secret from environment variables
    // For development, you might use a placeholder, but ensure it's secure in production.
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; 

    const decoded = jwt.verify(tokenString, jwtSecret);

    // Attach user to the request object
    // Assuming the JWT payload contains a 'userId' field
    req.user = decoded.user; 
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
