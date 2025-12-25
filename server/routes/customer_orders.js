const express = require('express');

const router = express.Router();

const {
  getCustomerOrder,
  createCustomerOrder,
  updateCustomerOrder,
  deleteCustomerOrder,
  getAllOrders,
  bulkDeleteOrders,
  getOrdersByUserId,
} = require('../controllers/customer_orders');

router.route('/bulk').delete(bulkDeleteOrders);

router.route('/').get(getAllOrders).post(createCustomerOrder);

// Route for getting orders by user ID
router.route('/user/:userId').get(getOrdersByUserId);

router
  .route('/:id')
  .get(getCustomerOrder)
  .put(updateCustomerOrder)
  .delete(deleteCustomerOrder);

module.exports = router;