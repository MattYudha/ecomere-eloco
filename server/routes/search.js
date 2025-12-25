const express = require('express');

const router = express.Router();
const { searchProducts, autocomplete } = require('../controllers/search');

router.route('/').get(searchProducts);
router.route('/autocomplete').get(autocomplete); // ✅ NEW: Autocomplete endpoint

module.exports = router;
