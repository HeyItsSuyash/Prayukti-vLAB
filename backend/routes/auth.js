const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const attendanceMiddleware = require('../middleware/attendanceMiddleware');

// Register
router.post('/register', authController.signupUser);
router.post('/signup', authController.signupUser); // Alias for frontend

// Verify OTP
router.post('/verify-otp', authController.verifyOtp, attendanceMiddleware.onLogin, authController.sendSigninResponse);

// Login sequence with attendance tracking
router.post('/login', authController.signinUser, attendanceMiddleware.onLogin, authController.sendSigninResponse);
router.post('/signin', authController.signinUser, attendanceMiddleware.onLogin, authController.sendSigninResponse);

// Logout (handled in attendance routes)
// router.post('/logout', protect, attendanceMiddleware.onLogout);

// Resend OTP
router.post('/resend-otp', authController.resendOtp);

module.exports = router;
