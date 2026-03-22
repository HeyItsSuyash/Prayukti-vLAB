const User = require('../models/User');
const { sendEmail, sendWelcomeEmail } = require('../services/emailService');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }
        const users = await User.find(filter).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new user (Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { 
        fullName, email, password, role, 
        enrollmentNo, rollNo, branch, year, semester, assignedSubjects 
    } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: role || 'student',
            isVerified: true,
            enrollmentNo,
            rollNo,
            branch,
            year,
            semester,
            assignedSubjects
        });

        // Send welcome email with credentials
        try {
            await sendWelcomeEmail(user, password);
        } catch (mailError) {
            console.error("Failed to send welcome email:", mailError);
        }

        res.status(201).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.enrollmentNo = req.body.enrollmentNo || user.enrollmentNo;
        user.rollNo = req.body.rollNo || user.rollNo;
        user.branch = req.body.branch || user.branch;
        user.year = req.body.year || user.year;
        user.semester = req.body.semester || user.semester;
        user.assignedSubjects = req.body.assignedSubjects || user.assignedSubjects;

        if (req.body.password) {
            const bcrypt = require('bcryptjs');
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Send individual email to user
// @route   POST /api/users/send-email
// @access  Private/Admin
const sendMailToUser = async (req, res) => {
    const { userId, subject, content } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await sendEmail({
            to: user.email,
            subject: subject,
            html: `<div style="font-family: sans-serif; padding: 20px;">${content}</div>`
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    }
};

module.exports = {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    sendMailToUser
};
