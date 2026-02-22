const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.signupUser);
router.post('/signup', authController.signupUser); // Alias for frontend

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

// Login
router.post('/login', authController.signinUser);
router.post('/signin', authController.signinUser); // Alias for frontend

// Resend OTP
router.post('/resend-otp', authController.resendOtp);

module.exports = router;
