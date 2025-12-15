const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardStats');

router.get('/', getDashboardStats);

module.exports = router;
