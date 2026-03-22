const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateOtp = require('../utils/generateOtp');
const { sendEmail } = require('../services/emailService');

const isAllowedDomain = (email) => {
    if (!email) return false;
    const cleanEmail = email.toLowerCase().trim();
    return cleanEmail.endsWith("@mmmut.ac.in");
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const signupUser = async (req, res) => {
    try {
        const { fullName, email, password, rollNo } = req.body;
        const { fullName, email, password, rollNo, role, enrollmentNo, branch, year, semester } = req.body;
        console.log(`[AUTH] Registration attempt: ${email}`);

        if (!isAllowedDomain(email)) {
            console.log(`[AUTH] Domain blocked: ${email}`);
            return res.status(400).json({ message: "Only @mmmut.ac.in emails are allowed" });
        }

        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            console.log(`[AUTH] User already verified: ${email}`);
            return res.status(400).json({ message: "User already registered" });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const hashedPassword = await bcrypt.hash(password, 10);

        if (user) {
            console.log(`[AUTH] Updating unverified user: ${email}`);
            user.fullName = fullName;
            user.rollNo = rollNo;
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            user.role = role || 'student';
            await user.save();
        } else {
            console.log(`[AUTH] Creating new user: ${email}`);
            user = new User({
                fullName: fullName,
                rollNo: rollNo,
                email: email,
                fullName,
                email,
                password: hashedPassword,
                role: role || 'student',
                otp,
                otpExpiry,
                isVerified: false,
                rollNo,
                enrollmentNo,
                branch,
                year,
                semester
            });
            await user.save();
        }

        console.log(`[AUTH] User record saved. Sending email to ${email}...`);

        // Send OTP via Email
        try {
            await sendEmail({
                to: email,
                subject: 'Your OTP for Prayukti vLAB',
                html: `<h3>Welcome to Prayukti vLAB!</h3><p>Your OTP is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`
            });
        } catch (mailError) {
            console.error("Signup email error:", mailError);
            // We still return 201 because the user is created
        }

        res.status(201).json({ message: 'Registration successful. Please verify your OTP.' });
    } catch (error) {
        console.error("[AUTH] Signup CRASH:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not registered" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Account verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during verification' });
    }
};

exports.signinUser = async (req, res, next) => {
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const signinUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`[AUTH] Login attempt: ${email}`);

        let user;
        try {
            user = await User.findOne({ email });
        } catch (dbErr) {
            console.error("[AUTH] DB connection error during login:", dbErr.message);
            if (process.env.MOCK_AUTH === 'true') {
                console.log("[AUTH] MOCK_AUTH enabled. Bypassing DB for:", email);
            } else {
                throw dbErr;
            }
        }

        // Mock Auth Bypass
        if (!user && process.env.MOCK_AUTH === 'true') {
            if (email && email.toLowerCase().endsWith("@mmmut.ac.in")) {
                console.log(`[AUTH] MOCK LOGIN SUCCESS for domain: ${email}`);
                res.locals.userId = "mock_user_id_" + Date.now();
                res.locals.userRole = email.toLowerCase().includes("admin") ? "admin" : "student";
                res.locals.userEmail = email;
                res.locals.userFullName = "Mock User (" + res.locals.userRole + ")";
                res.locals.userRollNo = "MOCK12345";
                return next();
            } else {
                return res.status(401).json({ message: "Mock Auth: Only @mmmut.ac.in emails allowed for bypass" });
            }
        }

        if (!user) {
            console.log(`[AUTH] User not found: ${email}`);
            return res.status(404).json({ message: "User not registered" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[AUTH] Password mismatch: ${email}`);
            return res.status(400).json({ message: "Invalid password" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }

        // Set data for middleware
        res.locals.userId = user._id;
        res.locals.userRole = user.role;
        res.locals.userEmail = user.email;
        res.locals.userFullName = user.fullName;
        res.locals.userRollNo = user.rollNo;

        // Pass to attendanceMiddleware.onLogin
        next();
    } catch (err) {
        console.error("[AUTH] Signin CRASH:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};

/**
 * Send final signin response after middleware sequence
 */
exports.sendSigninResponse = (req, res) => {
const sendSigninResponse = (req, res) => {
    try {
        const { userId, userEmail, userRole, userFullName, userRollNo, attendance_log_id } = res.locals;

        const token = jwt.sign(
            { id: userId, email: userEmail, role: userRole, attendance_log_id: attendance_log_id },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: userId,
                fullName: userFullName,
                rollNo: userRollNo,
                email: userEmail,
                role: userRole
            }
        });
    } catch (err) {
        console.error("[AUTH] Signin Response Error:", err);
        res.status(500).json({ message: "Failed to finalize login response" });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not registered" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendEmail({
            to: email,
            subject: 'New OTP for Prayukti vLAB',
            html: `<h3>New OTP is: <strong>${otp}</strong></h3><p>It will expire in 10 minutes.</p>`
        });

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    signupUser,
    verifyOtp,
    signinUser,
    sendSigninResponse,
    resendOtp
};
