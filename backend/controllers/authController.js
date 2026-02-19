const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const generateOtp = require('../utils/generateOtp');

// Transporter configured once
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const isAllowedDomain = (email) => {
    if (!email) return false;
    const cleanEmail = email.toLowerCase().trim();
    return cleanEmail.endsWith("@mmmut.ac.in");
};

exports.signupUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log(`[AUTH] Registration attempt: ${email}`);

        if (!isAllowedDomain(email)) {
            console.log(`[AUTH] Domain blocked: ${email}`);
            return res.status(400).json({ message: "Only @mmmut.ac.in emails are allowed" });
        }

        let user = await User.findOne({ email });
        console.log(`[AUTH] User found in DB: ${!!user}`);

        if (user && user.isVerified) {
            console.log(`[AUTH] User already verified: ${email}`);
            return res.status(400).json({ message: "Student already registered" });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        console.log(`[AUTH] OTP generated: ${otp}, Expiry: ${otpExpiry}`);

        const hashedPassword = await bcrypt.hash(password, 10);

        if (user) {
            console.log(`[AUTH] Updating unverified user: ${email}`);
            user.fullName = fullName;
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        } else {
            console.log(`[AUTH] Creating new user: ${email}`);
            user = new User({
                fullName: fullName,
                email: email,
                password: hashedPassword,
                otp: otp,
                otpExpiry: otpExpiry,
                isVerified: false
            });
            await user.save();
        }

        console.log(`[AUTH] User record saved. Sending email to ${email}...`);

        const mailOptions = {
            from: `"Prayukti vLAB" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Prayukti vLAB OTP Verification",
            text: `Your OTP is: ${otp}\nValid for 10 minutes.`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`[AUTH] Email sent successfully to ${email}`);
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            console.error("[AUTH] Mailer ERROR:", error);
            res.status(500).json({ message: "Error sending OTP. Please try again." });
        }
    } catch (err) {
        console.error("[AUTH] Signup CRASH:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Student not registered" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: "Account verified successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during verification" });
    }
};

exports.signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[AUTH] Login attempt: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`[AUTH] User not found: ${email}`);
            return res.status(404).json({ message: "Student not registered" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[AUTH] Password mismatch: ${email}`);
            return res.status(400).json({ message: "Invalid password" });
        }

        if (!user.isVerified) {
            console.log(`[AUTH] User not verified: ${email}`);
            return res.status(401).json({ message: "Your account is not verified" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        console.log(`[AUTH] Login successful: ${email}`);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("[AUTH] Signin CRASH:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Student not registered" });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        const mailOptions = {
            from: `"Prayukti vLAB" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Prayukti vLAB OTP Verification",
            text: `Your OTP is: ${otp}\nValid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "New OTP sent to email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during Resend OTP" });
    }
};

