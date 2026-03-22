const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: false // Optional for teachers/admins, but should be provided by students
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "teacher", "admin"],
        default: "student"
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    enrollmentNo: {
        type: String
    },
    rollNo: {
        type: String
    },
    branch: {
        type: String
    },
    year: {
        type: Number
    },
    semester: {
        type: Number
    },
    assignedSubjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
