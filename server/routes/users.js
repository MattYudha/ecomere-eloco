const express = require('express');
const router = express.Router();

const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
} = require('../controllers/users');

router.route('/').get(getAllUsers).post(createUser);

const { getMe } = require('../controllers/auth');

// 🔴 ADD THIS: explicit OPTIONS handler
router.options('/profile', (req, res) => {
  return res.sendStatus(204);
});

// Must be before /:id capture
router.get('/profile', getMe);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

router.route('/email/:email').get(getUserByEmail);

module.exports = router;
