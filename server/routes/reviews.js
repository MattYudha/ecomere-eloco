const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviews');
const authenticateToken = require('../middleware/auth');

// POST /api/reviews - Create a review
router.post('/', authenticateToken, reviewController.createReview);

// GET /api/reviews/:productId - Get reviews for a product
router.get('/:productId', reviewController.getReviews);

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id', authenticateToken, reviewController.deleteReview);

module.exports = router;
