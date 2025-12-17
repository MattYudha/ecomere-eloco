const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
} = require('../controllers/auth');

const router = express.Router();

const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', register);
router.post('/login', authLimiter, login);
router.get('/logout', logout); // Support GET for simple links
router.post('/logout', logout); // Support POST for actions
router.get('/me', getMe);
router.get('/signout', logout); // Alias for NextAuth compatibility involved refactors
router.post('/signout', logout); // Alias 

module.exports = router;
