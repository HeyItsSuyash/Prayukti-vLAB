const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.signupUser);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

// Login
router.post('/login', authController.signinUser);

// Resend OTP
router.post('/resend-otp', authController.resendOtp);

module.exports = router;
