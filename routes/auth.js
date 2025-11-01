const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validate,
  registerSchema,
  loginSchema,
} = require('../utils/validation');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(loginSchema), login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;


