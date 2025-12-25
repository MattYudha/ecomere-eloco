const express = require('express');

const router = express.Router();
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    searchProducts,
    getProductById,
    getRelatedProducts, // Import new function
} = require('../controllers/products');

router.route('/related').get(getRelatedProducts); // Add related products route

router.route('/bulk').delete(bulkDeleteProducts); // Must be before /:id to avoid collision

router.route('/').get(getAllProducts).post(createProduct);

router
    .route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;